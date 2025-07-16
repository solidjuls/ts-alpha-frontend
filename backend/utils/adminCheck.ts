import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { isUserAdmin } from "backend/controller/user.controller";

export const checkAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.cookies;
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

  const isAdmin = await isUserAdmin(decoded?.mail)
  if (!isAdmin) {
    res.status(401).json("Unauthorized");
    throw new Error("Unauthorized")
  }
}
