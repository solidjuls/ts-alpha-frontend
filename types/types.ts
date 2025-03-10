import { NextApiRequest, NextApiResponse } from "next";

export type ServerType = {
  req: NextApiRequest;
  res: NextApiResponse;
};

export type DropdownItemType = {
  value?: string;
  text?: string;
};

export type MultiSelectItemType = {
  code: string;
  name: string;
};
