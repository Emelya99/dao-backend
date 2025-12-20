import { provider } from "../../services/provider";
import proposalAbi from "../../abi/proposalABI.json";
import { ethers } from "ethers";
import { storage } from "../../storage/proposalsStorage";
import { applyProposalVote } from "./applyProposalVote";
import { retryWithBackoff } from "../../utils/retry";

const iface = new ethers.Interface(proposalAbi);

const chunkSize = Number(process.env.CHUNK_SIZE) || 40000;

async function getProposalLogsChunked(address: string, from: number, to: number) {
  let logs: ethers.Log[] = [];

  for (let start = from; start <= to; start += chunkSize) {
    const end = Math.min(start + chunkSize - 1, to);

    console.log(`📦 Loading votes for proposal from ${start} → ${end}`);

    const partialLogs = await retryWithBackoff(() =>
      provider.getLogs({
        address,
        fromBlock: start,
        toBlock: end,
      })
    );

    logs = logs.concat(partialLogs);
  }

  return logs;
}

export async function syncProposalEvents(address: string, id: number) {
  const startBlock = Number(process.env.START_BLOCK);
  const currentBlock = await retryWithBackoff(() => provider.getBlockNumber());

  console.log(
    `📦 Syncing votes for Proposal #${id} from block ${startBlock} to ${currentBlock}`
  );

  const logs = await getProposalLogsChunked(address, startBlock, currentBlock);

  for (const log of logs) {
    try {
      const parsed = iface.parseLog(log);
      if (!parsed) continue;

      applyProposalVote(parsed, log, id);
    } catch (err) {
      console.warn("⚠️ Error parsing proposal vote:", err);
    }
  }

  storage.lastCheckedBlocks[id] = currentBlock;

  console.log(`✅ Loaded votes for proposal #${id}`);
}
