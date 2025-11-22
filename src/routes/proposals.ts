import { Router } from 'express';
import { getAllProposals } from '../controllers/proposalsController';

const router = Router();

router.get('/', getAllProposals);

export default router;