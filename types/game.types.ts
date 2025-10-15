import { DropdownItemType } from "types/types";
import { TournamentStatusType } from "utils/constants";
import { z } from "zod";

export type TournamentsType = {
  id: string;
  tournament_name: string;
  status_id: TournamentStatusType;
  starting_date: string | null;
  adminId: string[];
  adminName: string[];
  created_at?: Date | null;
  updated_at?: Date | null;
};

export type SubmitFormValue<T> = {
  value: T | undefined;
  error: boolean;
};

export type UserProfileState = {
  name: SubmitFormValue<string>;
  preferredGamingPlatform: SubmitFormValue<string>;
  preferredGameDuration: SubmitFormValue<string>;
  city: SubmitFormValue<string>;
  country: SubmitFormValue<DropdownItemType[]>;
  phone: SubmitFormValue<string>;
};

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone_number: string;
  last_login_at: Date;
  preferred_gaming_platform: string;
  preferred_game_duration: string;
  timezone_id: string;
  cities: {
    id: string;
    name: string;
  };
  countries: {
    id: string;
    country_name: string;
  };
  rating: number;
};
 
export interface TournamentCreateState {
  tournamentName: SubmitFormValue<string>;
  statusId: SubmitFormValue<string>;
  description: SubmitFormValue<string>;
  startingDate: SubmitFormValue<Date>;
  admins: SubmitFormValue<string>;
}

export type UserCreateState = {
  name: SubmitFormValue<string>;
  preferredGamingPlatform: SubmitFormValue<string>;
  preferredGameDuration: SubmitFormValue<string>;
  city: SubmitFormValue<string>;
  country: SubmitFormValue<string>;
  first_name: SubmitFormValue<string>;
  last_name: SubmitFormValue<string>;
  email: SubmitFormValue<string>;
  phone: SubmitFormValue<string>;
};

export type Game = {
  id: bigint;
  created_at: Date | null;
  updated_at: Date | null;
  usaPlayerId: bigint;
  ussrPlayerId: bigint;
  usaRatingDifference: number;
  ussrRatingDifference: number;
  gameType: string;
  game_code: string;
  reported_at: Date;
  gameWinner: GameWinner;
  endTurn: number | null;
  endMode: string | null;
  gameDate: Date;
  video1: string | null;
  videoURL: string;
  reporter_id: bigint | null;
  usaCountryCode: string;
  ussrCountryCode: string;
  usaPlayer: string;
  ussrPlayer: string;
  ratingsUSA: GameRating;
  ratingsUSSR: GameRating;
};

export type GameAPIResponseType = {
  results: Game[];
};

export const zGameAPI = z.object({
  gameWinner: z.enum(["1", "2", "3"]),
  gameCode: z.string(),
  gameType: z.string(),
  usaPlayerId: z.string(),
  ussrPlayerId: z.string(),
  endTurn: z.string(),
  endMode: z.string(),
  video1: z.optional(z.string()),
});

export const zGameRecreateAPI = zGameAPI.extend({
  oldId: z.string(),
  gameDate: z.string(),
});

export type GameRating = {
  rating: number;
  previousRating: number;
};

export type BiggerLowerValue = {
  bigger: number;
  smaller: number;
};

export type GameWinner = "1" | "2" | "3";

export type GameAPI = z.infer<typeof zGameAPI>;

export type GameRecreate = z.infer<typeof zGameRecreateAPI>;
