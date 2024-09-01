export default function handler(req, res) {
  res.status(200).json({ profile: { name: "John Doe", email: "john@example.com" } });
}
