import { provider } from "../services/provider";
import abi from "../abi/daoABI.json";
import { ethers } from "ethers";
import { applyEvent } from "./applyEvent";
import { storage } from "../storage/proposalsStorage";
import { retryWithBackoff } from "../utils/retry";

const daoAddress = process.env.DAO_ADDRESS!;
const iface = new ethers.Interface(abi);

const chunkSize = Number(process.env.CHUNK_SIZE) || 40000;

async function getLogsChunked(fromBlock: number, toBlock: number) {
  let logs: ethers.Log[] = [];

  for (let start = fromBlock; start <= toBlock; start += chunkSize) {
    const end = Math.min(start + chunkSize - 1, toBlock);

    console.log(`📦 Loading logs ${start} → ${end}`);

    const part = await retryWithBackoff(() =>
      provider.getLogs({
      address: daoAddress,
      fromBlock: start,
      toBlock: end
      })
    );

    logs = logs.concat(part);
  }

  return logs;
}

export async function syncPastEvents() {
  console.log("📦 Syncing past DAO events...");

  const currentBlock = await retryWithBackoff(() => provider.getBlockNumber());
  const startBlock = Number(process.env.START_BLOCK);

  console.log(`📦 Loading logs from block ${startBlock} to ${currentBlock}`);

  const logs = await getLogsChunked(startBlock, currentBlock);

  for (const log of logs) {
    try {
      const parsed = iface.parseLog(log);
      if (!parsed) continue;
      await applyEvent(parsed, log);
    } catch (err) {
      console.warn("⚠️ Error parsing log:", err);
    }
  }

  console.log(`✅ Archive loaded. Total proposals: ${storage.proposals.size}`);
  storage.lastBlockProcessed = currentBlock;
}
