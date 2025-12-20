import { storage } from "../storage/proposalsStorage";
import { ethers } from "ethers";
import { syncProposalEvents } from "./proposals/syncProposalEvents";
import { startProposalPolling } from "./proposals/startProposalPolling";
import proposalAbi from "../abi/proposalABI.json";
import { provider } from "../services/provider";
import { retryWithBackoff } from "../utils/retry";

export async function applyEvent(parsed: ethers.LogDescription, log: any) {
  switch (parsed.name) {
    case "ProposalCreated": {
      const { id, creator, description, proposalAddress } = parsed.args;

      // Read deadline from ProposalContract
      const proposalContract = new ethers.Contract(proposalAddress, proposalAbi, provider);
      const deadline = await retryWithBackoff(() => proposalContract.deadline());

      storage.proposals.set(Number(id), {
        id: Number(id),
        creator,
        description,
        proposalContract: proposalAddress,
        startBlock: log.blockNumber,
        createdAt: new Date().toISOString(),
        endBlock: null,
        executedAt: null,
        executed: false,
        deadline: Number(deadline),
        voteCountFor: 0,
        voteCountAgainst: 0,
        transactionHash: log.transactionHash,
        votes: []
      });

      console.log("🔥 ProposalCreated:", Number(id));

      // subscribe to votes
      syncProposalEvents(proposalAddress, Number(id));
      startProposalPolling(proposalAddress, Number(id));

      break;
    }

    case "ProposalExecuted": {
      const { id } = parsed.args;

      const proposal = storage.proposals.get(Number(id));
      if (proposal) {
        proposal.executed = true;
        proposal.executedAt = new Date().toISOString();
        console.log("⚡ ProposalExecuted:", Number(id));
      }

      break;
    }

    default:
      console.log("ℹ Unknown event:", parsed.name);
  }
}
