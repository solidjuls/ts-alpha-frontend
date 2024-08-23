import { authenticateJWT } from "pages/api/auth/middleware";

export default function handler(req, res) {
  authenticateJWT(req, res, () => {
    res.status(200).json({ profile: { name: "John Doe", email: "john@example.com" } });
  });
}
