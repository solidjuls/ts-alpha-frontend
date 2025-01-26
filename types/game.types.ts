import { DropdownItemType } from "types/types";
import { z } from "zod";

export type SubmitFormValue<T> = {
  value: T;
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

export type UserCreateState = {
  name: SubmitFormValue<string>;
  preferredGamingPlatform: SubmitFormValue<DropdownItemType>;
  preferredGameDuration: SubmitFormValue<DropdownItemType>;
  city: SubmitFormValue<string>;
  country: SubmitFormValue<DropdownItemType>;
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
  game_date: Date;
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
