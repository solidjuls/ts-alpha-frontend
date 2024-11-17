import { get } from "backend/controller/cities.controller";

export default async function handler(req, res) {
  const cities = await get(req.query.q);
  res.status(200).json(cities);
}
