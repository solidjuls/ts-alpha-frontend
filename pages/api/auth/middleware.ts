// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";

// export const authenticateJWT = (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return res.status(401).json({ message: "Authentication required" });
//   }
// console.log("no passa?")
//   try {
//     const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.log("token expired from api auth")
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// };
