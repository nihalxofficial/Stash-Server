// src/app.ts
import express from 'express';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
import routes from './routes';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

export default app;