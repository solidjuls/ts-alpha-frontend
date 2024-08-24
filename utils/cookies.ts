import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import jwt from "jsonwebtoken";
// import type { NextApiRequest, NextApiResponse } from "next";

type CookiesReturn = (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  mail: string;
  role: number;
} | null;

export const getInfoFromCookies: CookiesReturn = (req, res) => {
  const token = req.cookies["token"];

  if (!token) return null;

  const payload = jwt.verify(token, process.env.TOKEN_SECRET);

  if (!payload) return null;

  return {
    mail: payload.mail,
    role: payload.role,
  };
};
