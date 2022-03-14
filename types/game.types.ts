export type GameRating = {
  rating: number;
  ratingDifference: number;
};

export type GameWinner = "1" | "2" | "3";

export type Game = {
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
