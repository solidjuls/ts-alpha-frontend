import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { jwtDecode } from 'jwt-decode';

// Token storage key
const TOKEN_KEY = 'auth_token';

// User payload type
export interface UserPayload {
  mail: string;
  role: number;
  id: string;
  name: string;
}

// Get token from localStorage (client-side only)
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

// Set token in localStorage (client-side only)
export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
};

// Remove token from localStorage (client-side only)
export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
};

// Decode token without verification (client-side) - for reading claims
export const decodeToken = (token: string): UserPayload | null => {
  try {
    const payload = jwtDecode(token);
    return {
      id: payload.id,
      name: payload.name,
      mail: payload.mail,
      role: payload.role,
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Get user info from localStorage token (client-side)
export const getUserFromToken = (): UserPayload | null => {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token);
};

// Check if token is expired (client-side)
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = jwtDecode(token);
    if (!payload.exp) {
      return false; // No expiration
    }

    const isExpired = Date.now() >= payload.exp * 1000;

    return isExpired;
  } catch (e) {
    return true;
  }
};

// Legacy function for server-side API routes that receive token in Authorization header
type AuthHeaderReturn = (
  req: NextApiRequest,
  res: NextApiResponse,
) => UserPayload | null;

export const getInfoFromAuthHeader: AuthHeaderReturn = (req, _res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    if (!payload) return null;

    return {
      id: payload.id,
      name: payload.name,
      mail: payload.mail,
      role: payload.role,
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

// Deprecated: kept for backwards compatibility during migration
// Use getInfoFromAuthHeader for API routes instead
export const getInfoFromCookies: AuthHeaderReturn = (req, _res) => {
  // First try Authorization header (new way)
  const authResult = getInfoFromAuthHeader(req, _res);
  if (authResult) return authResult;

  // Fallback to cookie (old way) - for backwards compatibility
  const token = req?.cookies["token"];
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    if (!payload) return null;

    return {
      id: payload.id,
      name: payload.name,
      mail: payload.mail,
      role: payload.role,
    };
  } catch (error) {
    console.error('Error verifying cookie token:', error);
    return null;
  }
};
