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
const mintingPolicy = scriptFromNative({
  type: "all",
  scripts: [
    { type: "sig", keyHash: publicKeyHash },
    {
      type: "before",
      slot: unixTimeToSlot("Preview", Date.now() + 1000000),
    },
  ],
});
const policyId = mintingPolicyToId(mintingPolicy);
const assetName = fromText("Assignment 3.1-Nguyen Thuy Duong")
const unit = policyId + assetName;

const tx = await lucid
  .newTx()
  .mintAssets({ [unit]: 700n })
  .pay.ToAddress(recipientAddress, { [unit]: 500n })
  .validTo(Date.now() + 100000)
  .attach.MintingPolicy(mintingPolicy)
  .complete();

const signed = await tx.sign.withWallet().complete();
const txHash = await signed.submit();

console.log('✅ Token minted successfully!');
console.log('Transaction Hash:', txHash);
console.log('Policy ID:', policyId);
console.log('Asset Name:', assetName);