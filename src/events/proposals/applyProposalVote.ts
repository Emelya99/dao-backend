import { ethers } from "ethers";
import { storage } from "../../storage/proposalsStorage";
import { provider } from "../../services/provider";
import { retryWithBackoff } from "../../utils/retry";

export async function applyProposalVote(parsed: ethers.LogDescription, log: any, id: number) {
  if (parsed.name !== "Voted") return;

  const { voter, support, amount } = parsed.args;

  const proposal = storage.proposals.get(id);
  if (!proposal) return;

  // Get block timestamp
  let timestamp: string;
  try {
    const block = await retryWithBackoff(() => provider.getBlock(log.blockNumber));
    timestamp = block ? new Date(Number(block.timestamp) * 1000).toISOString() : new Date().toISOString();
  } catch {
    timestamp = new Date().toISOString();
  }

  proposal.votes.push({
    voter,
    support,
    amount: Number(amount),
    blockNumber: log.blockNumber,
    timestamp,
    transactionHash: log.transactionHash
  });

  support
    ? (proposal.voteCountFor += Number(amount))
    : (proposal.voteCountAgainst += Number(amount));

  proposal.endBlock = log.blockNumber;

  console.log(`🗳️ Voted (archive/live) → proposal #${id}, voter ${voter}`);
}
