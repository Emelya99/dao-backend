import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import proposalsRouter from "./routes/proposals";
import resultsRouter from "./routes/results";
import { authRouter } from "./routes/authRoutes";
import { startEventListener } from "./events";

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: false
}));

app.use(express.json());

app.use("/auth", authRouter);
app.use("/proposals", proposalsRouter);
app.use("/results", resultsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await startEventListener();
});