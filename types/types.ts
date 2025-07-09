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

export interface ScheduleDBType {
  tournaments_id: number;
  game_code: string;
  usa_player_id: bigint;
  ussr_player_id: bigint;
  due_date: string;
}

export type ScheduleType = {
  countryUsa: string
  countryUssr: string
  idUsa: string
  idUssr: string
  nameUsa: string;
  nameUssr: string
  gameCode: string;
  tournamentId: string
  tournamentName: string
  dueDate: string
  id: string
  gameDate: string | null
}
