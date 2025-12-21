import { provider } from "../services/provider";
import abi from "../abi/daoABI.json";
import { ethers } from "ethers";
import { storage } from "../storage/proposalsStorage";
import { applyEvent } from "./applyEvent";
import { retryWithBackoff } from "../utils/retry";

const daoAddress = process.env.DAO_ADDRESS!;
const iface = new ethers.Interface(abi);

export function startPolling() {
  const interval = Number(process.env.POOLING_INTERVAL || 3000);

  console.log(`⏱️ Polling every ${interval} ms...`);

  setInterval(async () => {
    const currentBlock = await retryWithBackoff(() => provider.getBlockNumber());

    const fromBlock = storage.lastBlockProcessed + 1;
    const toBlock = currentBlock;

    console.log(`⏱️ Polling from block ${fromBlock} to ${toBlock}`);

    if (fromBlock > toBlock) return;

    const logs = await retryWithBackoff(() =>
      provider.getLogs({
      address: daoAddress,
      fromBlock,
      toBlock
      })
    );

    for (const log of logs) {
      const parsed = iface.parseLog(log);
      if (!parsed) continue;
      await applyEvent(parsed, log);
    }

    storage.lastBlockProcessed = currentBlock;
  }, interval);
}
