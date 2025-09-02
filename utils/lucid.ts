import { Lucid, Blockfrost } from "@lucid-evolution/lucid";
import dotenv from 'dotenv';

dotenv.config({path: "../.env"});

export async function setupLucid() {
  const BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY as string;
  const SEED_PHRASES = process.env.SEED_PHRASES as string;

  const lucid = await Lucid(
    new Blockfrost("https://cardano-preview.blockfrost.io/api/v0", BLOCKFROST_API_KEY),
    "Preview"
  );
  
  lucid.selectWallet.fromSeed(SEED_PHRASES);
  
  return lucid;
}

export function getWalletAddress(lucid) {
  return lucid.wallet().address();
}