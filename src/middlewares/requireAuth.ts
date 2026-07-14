// src/middlewares/requireAuth.ts
import { Request, Response, NextFunction } from 'express';

const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.AUTH_SERVER_URL}/api/auth/jwks`)
);

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = header.split(' ')[1];

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: process.env.AUTH_SERVER_URL,
    });

    req.user = {
      id: payload.sub as string,
      email: payload.email as string | undefined,
    };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default requireAuth;