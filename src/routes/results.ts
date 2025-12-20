import { Router } from "express";
import { getProposalResults } from "../controllers/proposalsController";

const router = Router();

router.get("/:id", getProposalResults);

export default router;

