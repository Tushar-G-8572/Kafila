import {verifyToken} from "../services/generateToken.js";

export function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  try{
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  }catch(err){
    console.error('Error in authMiddleware:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
 }