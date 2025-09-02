import { fromText,paymentCredentialOf, mintingPolicyToId, scriptFromNative, unixTimeToSlot } from "@lucid-evolution/lucid";
import { getWalletAddress, setupLucid } from "../utils/lucid.ts";

// Khởi tạo Lucid 
const lucid = await setupLucid();
const walletAddress = await getWalletAddress(lucid);
const publicKeyHash = paymentCredentialOf(walletAddress).hash;
console.log("Address:", walletAddress);
console.log("Public key hash:", publicKeyHash);

const policyId = "d0c7cc4f36ba4c21fc05fc25f4ad2edc973bf4b769784652cac64400";
const nftBaseName = "C2VN-Nguyen Thuy Duong";

// Metadata cập nhật với level: 2
const updatedMetadata = {
  "721": {
    [policyId]: {
      [nftBaseName]: {
        "name": nftBaseName,
        "level": 2, 
        "description": "Assignment 3.2 - CIP-68 NFT",
        "image": "ipfs://QmQcDcUSK94BXF7frQ4SBDxmWVzXpRMnYQp6szfEQ3A4PH",
        "updatedAt": new Date().toISOString()
      }
    }
  }
};

// Build transaction chỉ để cập nhật metadata
const tx = await lucid
  .newTx()
  .attachMetadata(721, updatedMetadata)
  .complete();
const signed = await tx.sign.withWallet().complete();
const txHash = await signed.submit();

// Đợi confirm
await lucid.awaitTx(txHash);

console.log('✅ NFT Metadata updated successfully!');
console.log('Update Transaction Hash:', txHash);
console.log('Policy ID:', policyId);
console.log('NFT Name:', nftBaseName);
console.log('New Level: 2');