import 'dotenv/config';
import jwt from 'jsonwebtoken';

export function generateToken(userId) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '5h' });
  return token;
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    console.error('Token verification failed:', err);
    return null;
  }
}