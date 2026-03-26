import { Router } from 'express';
import { Question } from '../models/Question';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const questions = await Question.find().limit(limit);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
});

router.post('/', async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create question', error: err });
  }
});

export default router;
