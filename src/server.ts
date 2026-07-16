// src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';

connectDB();

// Vercel needs the app itself, not a running listener
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Stash backend running on port ${PORT}`));
}

export default app;