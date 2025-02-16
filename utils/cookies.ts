import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

type CookiesReturn = (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  mail: string;
  role: number;
} | null;

export const getInfoFromCookies: CookiesReturn = (req, res) => {
  const token = req?.cookies["token"];

  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
  
    if (!payload) return null;
  
    return {
      id: payload.id,
      name: payload.name,
      mail: payload.mail,
      role: payload.role,
    };
  } catch(error) {
    return null;
  }
};
