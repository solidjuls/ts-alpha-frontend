import { get, getAll, update, create } from "backend/controller/user.controller";
import { checkAuth } from "backend/utils/adminCheck";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "POST") {
    const user = await update(req.body);
    res.status(200).json();
  } else if (req.method === "PUT") {
    await checkAuth(req, res)
    const response = await create(req.body);
    if (response.error) {
      res.status(500).json(response.error);
    }
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
