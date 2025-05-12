import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

//---- TOKEN CONFIGURATION ----//
// Gere la generation , verification et rafraichissement des tokens //


// Configuration
export const TOKEN_CONFIG = {
  DURATION: {
    ACCESS: 15 * 60, // 15 minutes en secondes
    REFRESH: 7 * 24 * 60 * 60, // 7 jours en secondes
  }
};

interface JWTPayload {
  userId: string;
}

export function getUserFromToken(request: NextRequest): string {
  const token = request.cookies.get('next-auth.session-token')?.value;
  if (!token) throw new Error('No token found');

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    if (!decoded?.userId) throw new Error('Invalid token');
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Vérification du token d'email de vérification
interface EmailTokenPayload {
	email: string;
  }

  export function verifyEmailToken(token: string): EmailTokenPayload {
	try {
	  // On vérifie que le token d'email a été signé avec le bon secret
	  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as EmailTokenPayload;
	  return decoded;
	} catch (error) {
	  throw new Error('Token invalide ou expiré');
	}
  }

export function generateAccessToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: TOKEN_CONFIG.DURATION.ACCESS });
}

export function verifySessionToken(token: string): { success: boolean; userId?: string; role?: string } {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    return { success: true, userId: decoded.userId, role: decoded.role };
  } catch (error) {
    return { success: false };
  }
}
