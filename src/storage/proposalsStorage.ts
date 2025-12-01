import { Proposal } from "../types/Proposal";

export const storage = {
  proposals: new Map<number, Proposal>(),
  lastBlockProcessed: 0,      // DAO
  lastCheckedBlocks: {} as Record<number, number>  // ProposalContract blocks
};
