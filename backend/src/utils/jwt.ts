import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET env variable is required');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
if (!JWT_EXPIRES_IN) throw new Error('JWT_EXPIRES_IN env variable is required');

export const generateToken = (userId: number, email: string): string => {
  const options: jwt.SignOptions = { expiresIn: '7d' };
  return jwt.sign(
    { userId, email },
    JWT_SECRET as unknown as jwt.Secret,
    options
  );
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET as unknown as jwt.Secret) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const extractTokenFromHeader = (authHeader: string): string => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization header must start with Bearer');
  }
  return authHeader.substring(7);
}; 