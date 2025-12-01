import { provider } from "../../services/provider";
import proposalAbi from "../../abi/proposalABI.json";
import { ethers } from "ethers";
import { storage } from "../../storage/proposalsStorage";
import { applyProposalVote } from "./applyProposalVote";

const iface = new ethers.Interface(proposalAbi);

export async function syncProposalEvents(address: string, id: number) {
  const startBlock = Number(process.env.START_BLOCK);
  const current = await provider.getBlockNumber();

  console.log(`📦 Syncing votes for Proposal #${id} from block ${startBlock} to ${current}`);

  const logs = await provider.getLogs({
    address,
    fromBlock: startBlock,
    toBlock: current
  });

  for (const log of logs) {
    const parsed = iface.parseLog(log);
    if (!parsed) continue;

    applyProposalVote(parsed, log, id);
  }

  storage.lastCheckedBlocks[id] = current;
  console.log(`📦 Loaded votes for #${id}`);
}
