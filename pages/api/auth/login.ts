import jwt from "jsonwebtoken";
import cookie from "cookie";

export default function loginHandler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    // Verify user credentials (hardcoded for simplicity)
    if (username === "admin" && password === "password") {
      // Create JWT payload
      const payload = {
        username,
        role: "admin", // Assign role based on user
      };

      // Generate a JWT token
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

      // Set the JWT in a HttpOnly cookie
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

      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
