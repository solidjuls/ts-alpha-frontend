import { NextApiRequest, NextApiResponse } from "next";

export type ServerType = {
  req: NextApiRequest;
  res: NextApiResponse;
}
