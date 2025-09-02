import { fromText,paymentCredentialOf, mintingPolicyToId, scriptFromNative, unixTimeToSlot } from "@lucid-evolution/lucid";
import { getWalletAddress, setupLucid } from "../utils/lucid.ts";

// Khởi tạo Lucid 
const lucid = await setupLucid();
const walletAddress = await getWalletAddress(lucid);
const publicKeyHash = paymentCredentialOf(walletAddress).hash;
console.log("Address:", walletAddress);
console.log("Public key hash:", publicKeyHash);

// Địa chỉ đích
const recipientAddress = "addr_test1qpuexzns2ze8g5csu30mnnk6gf2vx3kpwz2vcgvjsv7q3dr4mvw6eahqha5vj295mm0ugphljpesxaszfcff5hq9w63qrh0623";

// Minting policy
const deadlineTime = Date.now() + (60 * 60 * 1000);
const deadlineSlot = unixTimeToSlot("Preview", deadlineTime);
const mintingPolicy = scriptFromNative({
  type: "all",
  scripts: [
    { type: "sig", keyHash: publicKeyHash },
    {
      type: "before",
      slot: deadlineSlot,
    },
  ],
});
const policyId = mintingPolicyToId(mintingPolicy);
const nftBaseName = "C2VN-Nguyen Thuy Duong";
const assetName = fromText(nftBaseName)

// CIP-68 labels
const referenceLabel = "000643b0"; // (100) Reference NFT
const userLabel = "000de140";     // (222) User NFT
// Asset names với CIP-68 labels
const referenceAssetName = referenceLabel + assetName;
const userAssetName = userLabel + assetName;
const refUnit = policyId + referenceAssetName;
const usrUnit = policyId + userAssetName;

// Metadata theo CIP-68
const metadata = {
  "721": {
    [policyId]: {
      [nftBaseName]: {
        "name": nftBaseName,
        "level": 1,
        "description": "Assignment 3.2 - CIP-68 NFT",
        "image": "ipfs://QmQcDcUSK94BXF7frQ4SBDxmWVzXpRMnYQp6szfEQ3A4PH"
      }
    }
  }
};

const tx = await lucid
  .newTx()
  .validTo(deadlineTime - 60000)
  .mintAssets({
    [refUnit]: 1n,  // Reference NFT - keep
    [usrUnit]: 1n   // User NFT - send
  })
  .pay.ToAddress(recipientAddress, { [usrUnit]: 1n })
  .attachMetadata(721, metadata)
  .attach.MintingPolicy(mintingPolicy)
  .complete();

const signed = await tx.sign.withWallet().complete();
const txHash = await signed.submit();

console.log('✅ Token minted successfully!');
console.log('Transaction Hash:', txHash);
console.log('Policy ID:', policyId);
console.log('Asset Name:', assetName);
console.log('Full Asset ID:', policyId + assetName);