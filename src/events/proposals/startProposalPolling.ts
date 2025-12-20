import { provider } from "../../services/provider";
import proposalAbi from "../../abi/proposalABI.json";
import { ethers } from "ethers";
import { storage } from "../../storage/proposalsStorage";
import { applyProposalVote } from "./applyProposalVote";
import { retryWithBackoff } from "../../utils/retry";

const iface = new ethers.Interface(proposalAbi);

export function startProposalPolling(address: string, id: number) {
  const interval = Number(process.env.POOLING_INTERVAL || 3000);

  console.log(`⏱️ Polling ProposalContract #${id} every ${interval}ms...`);

  setInterval(async () => {
    const lastChecked = storage.lastCheckedBlocks[id] || Number(process.env.START_BLOCK);
    const currentBlock = await retryWithBackoff(() => provider.getBlockNumber());

    if (lastChecked >= currentBlock) return;

    const logs = await retryWithBackoff(() =>
      provider.getLogs({
        address,
        fromBlock: lastChecked + 1,
        toBlock: currentBlock
      })
    );

    for (const log of logs) {
      const parsed = iface.parseLog(log);
      if (!parsed) continue;
      applyProposalVote(parsed, log, id);
    }

    storage.lastCheckedBlocks[id] = currentBlock;
  }, interval);
}
