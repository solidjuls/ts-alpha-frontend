import jwt from "jsonwebtoken";

export const authenticateJWT = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
