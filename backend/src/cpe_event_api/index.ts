import express from 'express';

import attendees from "./routes/attendees";
import event from "./routes/event";

const router = express.Router();

router.use('/attendees', attendees);
router.use('/events', event)

export default router;
