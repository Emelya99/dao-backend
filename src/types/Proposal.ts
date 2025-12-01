export interface Proposal {
  id: number;
  creator: string;
  description: string;
  proposalContract: string;

  startBlock: number;
  createdAt: string;
  endBlock: number | null;
  executedAt: string | null;
  executed: boolean;

  voteCountFor: number;
  voteCountAgainst: number;

  transactionHash: string;

  votes: ProposalVote[];
}

export interface ProposalVote {
  voter: string;
  support: boolean;
  amount: number;
  blockNumber: number;
  timestamp: string;
  transactionHash: string;
}