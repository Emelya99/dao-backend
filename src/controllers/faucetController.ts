import { Request, Response } from "express";
import { ethers } from "ethers";
import { provider } from "../services/provider";
import daoAbi from "../abi/daoABI.json";
import tokenAbi from "../abi/tokenABI.json";

const DAO_ADDRESS = process.env.DAO_ADDRESS!;
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;

export async function mintTokens(req: Request, res: Response) {
  const address = req.body?.address;

  if (!address || typeof address !== "string") {
    return res.status(400).json({
      status: "error",
      message: "Missing or invalid address",
    });
  }

  if (!ethers.isAddress(address)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid Ethereum address",
    });
  }

  if (!PRIVATE_KEY || !DAO_ADDRESS || !TOKEN_ADDRESS) {
    return res.status(500).json({
      status: "error",
      message: "Faucet not configured (PRIVATE_KEY, DAO_ADDRESS, TOKEN_CONTRACT_ADDRESS)",
    });
  }

  try {
    const dao = new ethers.Contract(DAO_ADDRESS, daoAbi as ethers.InterfaceAbi, provider);
    const token = new ethers.Contract(TOKEN_ADDRESS, tokenAbi as ethers.InterfaceAbi, provider);

    const minTokens: bigint = await dao.minTokensToCreateProposal();
    const currentBalance: bigint = await token.balanceOf(address);

    if (currentBalance >= minTokens) {
      return res.status(400).json({
        status: "error",
        message: "Already have enough tokens",
      });
    }

    const amountToTransfer = minTokens - currentBalance;
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const tokenWithSigner = token.connect(wallet) as any;

    const tx = await tokenWithSigner.transfer(address, amountToTransfer);
    const receipt = await tx.wait();

    res.json({
      status: "ok",
      data: {
        txHash: receipt?.hash ?? tx.hash,
        amountTransferred: amountToTransfer.toString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Faucet transfer failed";
    return res.status(500).json({
      status: "error",
      message,
    });
  }
}
