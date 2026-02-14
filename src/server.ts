import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import proposalsRouter from "./routes/proposals";
import resultsRouter from "./routes/results";
import { authRouter } from "./routes/authRoutes";
import faucetRouter from "./routes/faucet";
import { startEventListener } from "./events";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:4173",
  "http://localhost:5173",
  "https://dao-front.vercel.app"
].filter(Boolean) as string[];

app.use(cors({
  origin: allowedOrigins,
  credentials: false
}));

app.use(express.json());

app.use("/auth", authRouter);
app.use("/proposals", proposalsRouter);
app.use("/results", resultsRouter);
app.use("/faucet", faucetRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await startEventListener();
});