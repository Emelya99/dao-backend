import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import proposalsRouter from './routes/proposals';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/proposals', proposalsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});