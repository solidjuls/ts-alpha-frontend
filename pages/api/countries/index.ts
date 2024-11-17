import { get } from "backend/controller/countries.controller";

export default async function handler(req, res) {
  const countries = await get();
  res.status(200).json(countries);
}
