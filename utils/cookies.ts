import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

type CookiesReturn = (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  mail: string;
  role: number;
  tournamentsAdmin: number[]
  tournamentsRegistered: number[]
  id: number
  name: string
} | null;

export const getInfoFromCookies: CookiesReturn = (req, res) => {
  const token = req?.cookies["token"];
  if (!token) return null;
  
  try {
    console.log("process.env.TOKEN_SECRET", process.env.JWT_SECRET)
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("payload", payload)

    if (!payload) return null;

    return {
      id: payload.id,
      name: payload.name,
      mail: payload.mail,
      role: payload.role,
      tournamentsAdmin: payload.tournamentsAdmin,
      tournamentsRegistered: payload.tournamentsRegistered
    };
  } catch (error) {
    console.log("error", error)
    return null;
  }
};
