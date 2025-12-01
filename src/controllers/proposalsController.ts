import { Request, Response } from "express";
import { storage } from "../storage/proposalsStorage";

export const getAllProposals = (req: Request, res: Response) => {
  const list = Array.from(storage.proposals.values());

  res.json({
    status: "ok",
    proposals: list,
    count: list.length
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

  res.json({
    status: "ok",
    proposal
  });
};