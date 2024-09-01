/* @ts-ignore */
import cookie from "cookie";
/* @ts-ignore */
import jwt from "jsonwebtoken";
import { authorize } from "backend/controller/user.controller";

export default async function handler(req, res) {
  const { mail, pwd } = req.body;
  const user = await authorize({
    email: mail,
    pwd,
  });
  console.log("mail", user);

  if (user === null) {
    res.status(401).json({
      code: "UNAUTHORIZED",
      message: "User doesn't exist",
    });
  }

  if (user === false) {
    res.status(401).json({
      code: "UNAUTHORIZED",
      message: "The password is incorrect",
    });
  }

  const token = jwt.sign(
    { mail: user.email, name: user.name, role: user.role, id: user.id.toString() },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "60d",
    },
  );

  console.log("bumbum", token);
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    }),
  );

  res.status(200).json({ name: user.name, email: user.email });
}
