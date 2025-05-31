import express from 'express';

import attendees from "./routes/attendees";

const router = express.Router();

router.use('/attendees', attendees);

export default router;
