import { provider } from "../services/provider";
import abi from "../abi/daoABI.json";
import { ethers } from "ethers";
import { applyEvent } from "./applyEvent";
import { storage } from "../storage/proposalsStorage";

const daoAddress = process.env.DAO_ADDRESS!;
const iface = new ethers.Interface(abi);

export async function syncPastEvents() {
  console.log("📦 Syncing past DAO events...");

  const currentBlock = await provider.getBlockNumber();
  const startBlock = Number(process.env.START_BLOCK);

  console.log(`📦 Loading logs from block ${startBlock} to ${currentBlock}`);

  const logs = await provider.getLogs({
    address: daoAddress,
    fromBlock: startBlock,
    toBlock: currentBlock
  });

  for (const log of logs) {
    const parsed = iface.parseLog(log);
    if (!parsed) continue;
    applyEvent(parsed, log);
  }

  console.log(`✅ Archive loaded. Total proposals: ${storage.proposals.size}`);
  storage.lastBlockProcessed = currentBlock;
}
