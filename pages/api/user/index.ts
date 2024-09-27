import { get, getAll, update } from "backend/controller/user.controller";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "POST") {
    const user = await update(req.body);
    res.status(200).json();
  } else if (req.method === "GET") {
    if (id) {
      const user = await get(id);
      res.status(200).json(user);
    } else {
      const users = await getAll();
      res.status(200).json(users);
    }
  }
}
