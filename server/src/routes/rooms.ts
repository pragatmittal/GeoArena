import { Router } from 'express';
import { Room } from '../models/Room';

const router = Router();

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

router.post('/', async (req, res) => {
  try {
    let code = generateCode();
    while (await Room.findOne({ code })) {
      code = generateCode();
    }
    
    const host = req.body.host || Math.random().toString(36).substring(2);

    const room = new Room({
      code,
      host,
      status: 'waiting',
      settings: req.body.settings || {},
      players: []
    });
    
    await room.save();
    res.status(201).json({ roomId: room._id, code });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create room' });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const room = await Room.findOne({ code });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch room' });
  }
});

export default router;
