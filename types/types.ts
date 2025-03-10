import { NextApiRequest, NextApiResponse } from "next";

export type Country = {
  country_name: string
  id: string
  tld_code: string
}

export type City = {
  iD: string;
  name: string;
};

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
