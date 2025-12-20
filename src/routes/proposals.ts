import { Router } from "express";
import { getAllProposals, getProposalById, getProposalResults } from "../controllers/proposalsController";

const router = Router();

router.get("/", getAllProposals);
router.get("/:id", getProposalById);

export default router;