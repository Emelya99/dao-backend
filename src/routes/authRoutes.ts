import { Router } from "express";
import { getNonce, verifySiwe } from "../auth/siweController";

export const authRouter = Router();

authRouter.get("/nonce", getNonce);
authRouter.post("/verify", verifySiwe);