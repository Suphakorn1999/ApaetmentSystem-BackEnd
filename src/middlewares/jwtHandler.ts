import { sign, SignOptions, verify } from 'jsonwebtoken';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();


function generateToken(json: any) {
  const secretKey: any = process.env.TokenKey;

  const options: SignOptions = {
    expiresIn: '24h',
  };
  return sign(json, secretKey, options);
}

function verifyToken(req: any, res: any, next: express.NextFunction) {
  const authHeader: any = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  if (authHeader.split(' ')[0] != 'Bearer') {
    return res.status(403).json('Not Bearer');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  const secretKey: any = process.env.TokenKey;

  try {
    const decoded = verify(token, secretKey);
    req.body.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Failed to authenticate token.' });
  }
}


module.exports = { generateToken, verifyToken };
