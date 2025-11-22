import { Request, Response } from 'express';
import { Proposal } from '../types/Proposal';

let proposals = new Map<number, Proposal>();

proposals.set(1, {
  id: 1,
  creator: "Artur",
  description: "My first DAO proposal",
  startBlock: 0,
  createdAt: new Date().toISOString(),
  endBlock: 0,
  executedAt: null,
  executed: false,
  voteCountFor: 0,
  voteCountAgainst: 0,
  transactionHash: "0x1234567890abcdef",

  votes: []
});

proposals.set(2, {
  id: 2,
  creator: "Artur",
  description: "My second DAO proposal",
  startBlock: 0,
  createdAt: new Date().toISOString(),
  endBlock: 0,
  executedAt: null,
  executed: false,
  voteCountFor: 0,
  voteCountAgainst: 0,
  transactionHash: "0x1234567890abcdef",

  votes: []
});

export const getAllProposals = (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    proposals: Array.from(proposals.values()),
    count: proposals.size
  });
};