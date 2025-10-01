/* @ts-ignore */
import cookie from "cookie";
/* @ts-ignore */
import jwt from "jsonwebtoken";
import { authorize } from "backend/controller/user.controller";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { mail, pwd } = req.body;
  const user = await authorize({
    email: mail,
    pwd,
  });

  if (user === null) {
    res.status(401).json({
      code: "UNAUTHORIZED",
      message:
        "User doesn't exist. Contact Junta so we can register you as a valid user by sending an email to ITS Junta its.junta@gmail.com",
    });
    return;
  }

  if (user === false) {
    res.status(401).json({
      code: "UNAUTHORIZED",
      message: "The password is incorrect",
    });
    return;
  }
  if (!user) return;

  const token = jwt.sign(
    { mail: user.email, name: user.name, role: user.role, id: user.id.toString(), tournamentsAdmin: user.tournamentsAdmin, tournamentsRegistered: user.tournamentsRegistered },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "60d",
    },
  );

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 8640000,
      path: "/",
    }),
  );

  res
    .status(200)
    .json({ name: user.name, email: user.email, id: user.id.toString(), role: user.role, tournaments: user.tournaments });
}
