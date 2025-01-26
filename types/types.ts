import { NextApiRequest, NextApiResponse } from "next";

export type ServerType = {
  req: NextApiRequest;
  res: NextApiResponse;
};

export type DropdownItemType = {
  value: string;
  text: string;
};
