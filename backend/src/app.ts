import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import cpe_event_api from './cpe_event_api';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1', cpe_event_api)

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
