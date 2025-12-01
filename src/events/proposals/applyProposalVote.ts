import { ethers } from "ethers";
import { storage } from "../../storage/proposalsStorage";

export function applyProposalVote(parsed: ethers.LogDescription, log: any, id: number) {
  if (parsed.name !== "Voted") return;

  const { voter, support, amount } = parsed.args;

  const proposal = storage.proposals.get(id);
  if (!proposal) return;

  proposal.votes.push({
    voter,
    support,
    amount: Number(amount),
    blockNumber: log.blockNumber,
    timestamp: new Date().toISOString(),
    transactionHash: log.transactionHash
  });

  support
    ? (proposal.voteCountFor += Number(amount))
    : (proposal.voteCountAgainst += Number(amount));

  proposal.endBlock = log.blockNumber;

  console.log(`🗳️ Voted (archive/live) → proposal #${id}, voter ${voter}`);
}
