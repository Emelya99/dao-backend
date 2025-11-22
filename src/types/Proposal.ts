export interface Proposal {
  id: number;
  creator: string;
  description: string;
  startBlock: number;
  createdAt: string;
  endBlock: number;
  executedAt: string | null;
  executed: boolean;
  voteCountFor: number;
  voteCountAgainst: number;
  transactionHash: string;

  votes: {
    voter: string;
    support: boolean;
    amount: number;
    blockNumber: number;
    timestamp: string;
    transactionHash: string;
  }[];
}