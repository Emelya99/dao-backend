import { Request, Response } from "express";
import { storage } from "../storage/proposalsStorage";

export const getAllProposals = (req: Request, res: Response) => {
  const list = Array.from(storage.proposals.values()).map(p => ({
    id: p.id,
    creator: p.creator,
    description: p.description,
    proposalContract: p.proposalContract,
    executed: p.executed,
    deadline: p.deadline,
    voteCountFor: p.voteCountFor,
    voteCountAgainst: p.voteCountAgainst,
    createdAt: p.createdAt,
    transactionHash: p.transactionHash
  }));

  res.json({
    status: "ok",
    data: {
      proposals: list,
      count: list.length
    }
  });
};

export const getProposalById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const proposal = storage.proposals.get(id);

  if (!proposal) {
    return res.status(404).json({
      status: "error",
      message: `Proposal ${id} not found`
    });
  }

  // Return full proposal data WITHOUT votes array
  const { votes, ...proposalWithoutVotes } = proposal;

  res.json({
    status: "ok",
    data: {
      proposal: proposalWithoutVotes
    }
  });
};

export const getProposalResults = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const proposal = storage.proposals.get(id);

  if (!proposal) {
    return res.status(404).json({
      status: "error",
      message: `Proposal ${id} not found`
    });
  }

  res.json({
    status: "ok",
    data: {
      results: {
        proposalId: proposal.id,
        voteCountFor: proposal.voteCountFor,
        voteCountAgainst: proposal.voteCountAgainst,
        totalVotes: proposal.voteCountFor + proposal.voteCountAgainst,
        executed: proposal.executed,
        deadline: proposal.deadline,
        votes: proposal.votes
      }
    }
  });
};