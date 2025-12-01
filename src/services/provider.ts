import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

export const provider = new ethers.JsonRpcProvider(process.env.RPC_URL!);

(async () => {
  try {
    const net = await provider.getNetwork();
    console.log("🔌 Connected to network:", net);
  } catch (err) {
    console.error("RPC ERROR:", err);
  }
})();