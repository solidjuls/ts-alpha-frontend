import { authenticateJWT } from "pages/api/auth/middleware";

export default function handler(req, res) {
  authenticateJWT(req, res, () => {
    // Only logged-in users can access this route
    res.status(200).json({ profile: { name: "John Doe", email: "john@example.com" } });
  });
}
