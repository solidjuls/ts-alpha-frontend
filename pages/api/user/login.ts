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

  if (user === null) {
    res.status(401).json({
      code: "UNAUTHORIZED",
      message: "User doesn't exist. Contact Junta so we can add register you as a valid user",
    });
    return
  }

  if (user === false) {
    res.status(401).json({
      code: "UNAUTHORIZED",
      message: "The password is incorrect",
    });
    return
  }
  if (!user) return 
  const token = jwt.sign(
    { mail: user.email, name: user.name, role: user.role, id: user.id.toString() },
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
      maxAge: 3600,
      path: "/",
    }),
  );

  res
    .status(200)
    .json({ name: user.name, email: user.email, id: user.id.toString(), role: user.role });
}
