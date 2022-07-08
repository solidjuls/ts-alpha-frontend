import { z } from "zod";

export type GameDB = {
  id: bigint;
  created_at: Date | null;
  updated_at: Date | null;
  usaPlayerId: bigint;
  ussrPlayerId: bigint;
  gameType: string;
  game_code: string;
  reported_at: Date;
  gameWinner: GameWinner;
  endTurn: number | null;
  endMode: string | null;
  game_date: Date;
  video1: string | null;
  video2: string | null;
  video3: string | null;
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
  gameDate: z.string(),
  gameWinner: z.enum(["1", "2", "3"]),
  gameCode: z.string(),
  gameType: z.string(),
  usaPlayerId: z.string(),
  ussrPlayerId: z.string(),
  endTurn: z.string(),
  endMode: z.string(),
  video1: z.optional(z.string()),
  video2: z.optional(z.string()),
  video3: z.optional(z.string()),
});

export const zGameRecreateAPI = zGameAPI.extend({
  oldId: z.string(),
});

export type GameRating = {
  rating: number;
  ratingDifference: number;
};

export type BiggerLowerValue = {
  bigger: number;
  smaller: number;
};

export type GameWinner = "1" | "2" | "3";

export type Game = z.infer<typeof zGameAPI>;

export type GameRecreate = z.infer<typeof zGameRecreateAPI>;



type GameLeagueType = "National League" | "ITSL" | "OTSL" | "RTSL" | "Friendly";
type GameWinnerType = "1" | "2" | "3";
