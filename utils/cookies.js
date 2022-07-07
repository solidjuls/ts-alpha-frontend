import Cookies from "cookies";
import jwt from "jsonwebtoken";
// import type { NextApiRequest, NextApiResponse } from "next";

export const getInfoFromCookies = ({
  req,
  res,
}) => {
  const cookies = new Cookies(req, res);
  const token = cookies.get("auth-token");
  
  if (!token) return null;

  const payload = jwt.verify(token, process.env.TOKEN_SECRET);
  // check date

  if (!payload) return null;

  return {
    mail: payload.mail,
    role: payload.role,
  };
};
