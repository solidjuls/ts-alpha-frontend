import { NextApiRequest, NextApiResponse } from "next";

export type Country = {
  country_name: string;
  id: string;
  tld_code: string;
};

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

export interface ScheduleType {
    tournaments_id: number;
    game_code: string;
    usa_player_id: bigint;
    ussr_player_id: bigint;
    due_date: string;
}
