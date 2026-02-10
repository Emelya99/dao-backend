import { Router } from "express";
import { mintTokens } from "../controllers/faucetController";

const router = Router();

router.post("/", mintTokens);

export default router;
