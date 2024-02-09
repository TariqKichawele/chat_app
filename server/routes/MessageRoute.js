import express from 'express';
import { sendMessage, getMessages } from '../controllers/MessageController.js';
import protectRoute  from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/send/:id',protectRoute, sendMessage);
router.get('/:id', protectRoute, getMessages)

export default router;