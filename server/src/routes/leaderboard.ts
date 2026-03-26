import { Router } from 'express';
import { Leaderboard } from '../models/Leaderboard';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const top20 = await Leaderboard.find().sort({ totalScore: -1 }).limit(20);
    res.json(top20);
  } catch (err) {
    res.status(500).json({ message: 'Failed to find leaderboard' });
  }
});

router.get('/:user', async (req, res) => {
  try {
    const stats = await Leaderboard.findOne({ username: req.params.user });
    if (!stats) {
      return res.status(404).json({ message: 'User stats not found' });
    }
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user stats' });
  }
});

export default router;
