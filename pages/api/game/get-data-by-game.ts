import { authenticateJWT } from "pages/api/auth/middleware";

export default function handler(req, res) {
  authenticateJWT(req, res, () => {
    // Only admins. This one is for recreating
    res.status(200).json({ profile: { name: "John Doe", email: "john@example.com" } });
  });
}
