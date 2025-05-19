import { getGameWithRatings } from "backend/controller/game.controller";
import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../backend/utils/prisma";

interface QueryParams {
  userFilter?: string | null;
  fromDate?: string;
}

interface WinTypeStats {
  total_games: number;
  wins: number;
  losses: number;
  ties: number;
  defcon_wins: number;
  final_scoring_wins: number;
  vp_track_wins: number;
  wargames_wins: number;
  forfeit_wins: number;
  timer_wins: number;
  cuban_wins: number;
  scoring_card_wins: number;
  unknown_wins: number;
  defcon_losses: number;
  final_scoring_losses: number;
  vp_track_losses: number;
  wargames_losses: number;
  forfeit_losses: number;
  timer_losses: number;
  cuban_losses: number;
  scoring_card_losses: number;
  unknown_losses: number;
}

const createPrismaFilter = (params: QueryParams) => {
  const { userFilter, fromDate } = params;

  const filter: Prisma.game_resultsWhereInput = {};

  if (userFilter) {
    const userFilterArray = userFilter.split(",").map(Number);
    filter.OR = [
      { usa_player_id: { in: userFilterArray } },
      { ussr_player_id: { in: userFilterArray } },
    ];
  }

  if (fromDate) {
    filter.game_date = { gte: new Date(fromDate) };
  }

  return filter;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userFilter, fromDate } = req.query;

    if (!userFilter) {
      return res.status(400).json({ error: "userFilter is required" });
    }

    const userId = parseInt(userFilter as string);

    // Build the date filter condition
    let dateFilter = "";
    if (fromDate) {
      dateFilter = `AND game_date >= '${fromDate}'`;
    }

    // SQL query to get win/loss statistics for USA
    const usaStats = await prisma.$queryRaw<WinTypeStats[]>`
      SELECT 
        COUNT(*) as total_games,
        SUM(CASE WHEN game_winner = '1' THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN game_winner = '2' THEN 1 ELSE 0 END) as losses,
        SUM(CASE WHEN game_winner = '3' THEN 1 ELSE 0 END) as ties,
        SUM(CASE WHEN game_winner = '1' AND end_mode = 'DEFCON' THEN 1 ELSE 0 END) as defcon_wins,
        SUM(CASE WHEN game_winner = '1' AND (end_mode = 'Final Scoring' OR end_mode = 'Europe Control') THEN 1 ELSE 0 END) as final_scoring_wins,
        SUM(CASE WHEN game_winner = '1' AND end_mode = 'VP Track (+20)' THEN 1 ELSE 0 END) as vp_track_wins,
        SUM(CASE WHEN game_winner = '1' AND end_mode = 'Wargames' THEN 1 ELSE 0 END) as wargames_wins,
        SUM(CASE WHEN game_winner = '1' AND end_mode = 'Forfeit' THEN 1 ELSE 0 END) as forfeit_wins,
        SUM(CASE WHEN game_winner = '1' AND end_mode = 'Timer Expired' THEN 1 ELSE 0 END) as timer_wins,
        SUM(CASE WHEN game_winner = '1' AND end_mode = 'Cuban Missile Crisis' THEN 1 ELSE 0 END) as cuban_wins,
        SUM(CASE WHEN game_winner = '1' AND end_mode = 'Scoring Card Held' THEN 1 ELSE 0 END) as scoring_card_wins,
        SUM(CASE WHEN game_winner = '1' AND (end_mode IS NULL OR end_mode NOT IN ('DEFCON', 'Final Scoring', 'Europe Control', 'VP Track (+20)', 'Wargames', 'Forfeit', 'Timer Expired', 'Cuban Missile Crisis', 'Scoring Card Held')) THEN 1 ELSE 0 END) as unknown_wins,
        SUM(CASE WHEN game_winner = '2' AND end_mode = 'DEFCON' THEN 1 ELSE 0 END) as defcon_losses,
        SUM(CASE WHEN game_winner = '2' AND (end_mode = 'Final Scoring' OR end_mode = 'Europe Control') THEN 1 ELSE 0 END) as final_scoring_losses,
        SUM(CASE WHEN game_winner = '2' AND end_mode = 'VP Track (+20)' THEN 1 ELSE 0 END) as vp_track_losses,
        SUM(CASE WHEN game_winner = '2' AND end_mode = 'Wargames' THEN 1 ELSE 0 END) as wargames_losses,
        SUM(CASE WHEN game_winner = '2' AND end_mode = 'Forfeit' THEN 1 ELSE 0 END) as forfeit_losses,
        SUM(CASE WHEN game_winner = '2' AND end_mode = 'Timer Expired' THEN 1 ELSE 0 END) as timer_losses,
        SUM(CASE WHEN game_winner = '2' AND end_mode = 'Cuban Missile Crisis' THEN 1 ELSE 0 END) as cuban_losses,
        SUM(CASE WHEN game_winner = '2' AND end_mode = 'Scoring Card Held' THEN 1 ELSE 0 END) as scoring_card_losses,
        SUM(CASE WHEN game_winner = '2' AND (end_mode IS NULL OR end_mode NOT IN ('DEFCON', 'Final Scoring', 'Europe Control', 'VP Track (+20)', 'Wargames', 'Forfeit', 'Timer Expired', 'Cuban Missile Crisis', 'Scoring Card Held')) THEN 1 ELSE 0 END) as unknown_losses
      FROM game_results
      WHERE usa_player_id = ${userId} ${Prisma.raw(dateFilter)}
    `;

    // SQL query to get win/loss statistics for USSR
    const ussrStats = await prisma.$queryRaw<WinTypeStats[]>`
      SELECT 
        COUNT(*) as total_games,
        SUM(CASE WHEN game_winner = '2' THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN game_winner = '1' THEN 1 ELSE 0 END) as losses,
        SUM(CASE WHEN game_winner = '3' THEN 1 ELSE 0 END) as ties,
        SUM(CASE WHEN game_winner = '2' AND end_mode = 'DEFCON' THEN 1 ELSE 0 END) as defcon_wins,
        SUM(CASE WHEN game_winner = '2' AND (end_mode = 'Final Scoring' OR end_mode = 'Europe Control') THEN 1 ELSE 0 END) as final_scoring_wins,
        SUM(CASE WHEN game_winner = '2' AND end_mode = 'VP Track (+20)' THEN 1 ELSE 0 END) as vp_track_wins,
        SUM(CASE WHEN game_winner = '2' AND end_mode = 'Wargames' THEN 1 ELSE 0 END) as wargames_wins,
        SUM(CASE WHEN game_winner = '2' AND end_mode = 'Forfeit' THEN 1 ELSE 0 END) as forfeit_wins,
        SUM(CASE WHEN game_winner = '2' AND end_mode = 'Timer Expired' THEN 1 ELSE 0 END) as timer_wins,
        SUM(CASE WHEN game_winner = '2' AND end_mode = 'Cuban Missile Crisis' THEN 1 ELSE 0 END) as cuban_wins,
        SUM(CASE WHEN game_winner = '2' AND end_mode = 'Scoring Card Held' THEN 1 ELSE 0 END) as scoring_card_wins,
        SUM(CASE WHEN game_winner = '2' AND (end_mode IS NULL OR end_mode NOT IN ('DEFCON', 'Final Scoring', 'Europe Control', 'VP Track (+20)', 'Wargames', 'Forfeit', 'Timer Expired', 'Cuban Missile Crisis', 'Scoring Card Held')) THEN 1 ELSE 0 END) as unknown_wins,
        SUM(CASE WHEN game_winner = '1' AND end_mode = 'DEFCON' THEN 1 ELSE 0 END) as defcon_losses,
        SUM(CASE WHEN game_winner = '1' AND (end_mode = 'Final Scoring' OR end_mode = 'Europe Control') THEN 1 ELSE 0 END) as final_scoring_losses,
        SUM(CASE WHEN game_winner = '1' AND end_mode = 'VP Track (+20)' THEN 1 ELSE 0 END) as vp_track_losses,
        SUM(CASE WHEN game_winner = '1' AND end_mode = 'Wargames' THEN 1 ELSE 0 END) as wargames_losses,
        SUM(CASE WHEN game_winner = '1' AND end_mode = 'Forfeit' THEN 1 ELSE 0 END) as forfeit_losses,
        SUM(CASE WHEN game_winner = '1' AND end_mode = 'Timer Expired' THEN 1 ELSE 0 END) as timer_losses,
        SUM(CASE WHEN game_winner = '1' AND end_mode = 'Cuban Missile Crisis' THEN 1 ELSE 0 END) as cuban_losses,
        SUM(CASE WHEN game_winner = '1' AND end_mode = 'Scoring Card Held' THEN 1 ELSE 0 END) as scoring_card_losses,
        SUM(CASE WHEN game_winner = '1' AND (end_mode IS NULL OR end_mode NOT IN ('DEFCON', 'Final Scoring', 'Europe Control', 'VP Track (+20)', 'Wargames', 'Forfeit', 'Timer Expired', 'Cuban Missile Crisis', 'Scoring Card Held')) THEN 1 ELSE 0 END) as unknown_losses
      FROM game_results
      WHERE ussr_player_id = ${userId} ${Prisma.raw(dateFilter)}
    `;

    // Format the results to match the expected structure
    const result = {
      USA: {
        wins: Number(usaStats[0].wins) || 0,
        losses: Number(usaStats[0].losses) || 0,
        ties: Number(usaStats[0].ties) || 0,
        winTypes: {
          DEFCON: Number(usaStats[0].defcon_wins) || 0,
          "Final Scoring": Number(usaStats[0].final_scoring_wins) || 0,
          "VP Track": Number(usaStats[0].vp_track_wins) || 0,
          Wargames: Number(usaStats[0].wargames_wins) || 0,
          Forfeit: Number(usaStats[0].forfeit_wins) || 0,
          "Timer Expired": Number(usaStats[0].timer_wins) || 0,
          "Cuban Missile Crisis": Number(usaStats[0].cuban_wins) || 0,
          "Scoring Card Held": Number(usaStats[0].scoring_card_wins) || 0,
          Unknown: Number(usaStats[0].unknown_wins) || 0,
        },
        lossTypes: {
          DEFCON: Number(usaStats[0].defcon_losses) || 0,
          "Final Scoring": Number(usaStats[0].final_scoring_losses) || 0,
          "VP Track": Number(usaStats[0].vp_track_losses) || 0,
          Wargames: Number(usaStats[0].wargames_losses) || 0,
          Forfeit: Number(usaStats[0].forfeit_losses) || 0,
          "Timer Expired": Number(usaStats[0].timer_losses) || 0,
          "Cuban Missile Crisis": Number(usaStats[0].cuban_losses) || 0,
          "Scoring Card Held": Number(usaStats[0].scoring_card_losses) || 0,
          Unknown: Number(usaStats[0].unknown_losses) || 0,
        },
      },
      USSR: {
        wins: Number(ussrStats[0].wins) || 0,
        losses: Number(ussrStats[0].losses) || 0,
        ties: Number(ussrStats[0].ties) || 0,
        winTypes: {
          DEFCON: Number(ussrStats[0].defcon_wins) || 0,
          "Final Scoring": Number(ussrStats[0].final_scoring_wins) || 0,
          "VP Track": Number(ussrStats[0].vp_track_wins) || 0,
          Wargames: Number(ussrStats[0].wargames_wins) || 0,
          Forfeit: Number(ussrStats[0].forfeit_wins) || 0,
          "Timer Expired": Number(ussrStats[0].timer_wins) || 0,
          "Cuban Missile Crisis": Number(ussrStats[0].cuban_wins) || 0,
          "Scoring Card Held": Number(ussrStats[0].scoring_card_wins) || 0,
          Unknown: Number(ussrStats[0].unknown_wins) || 0,
        },
        lossTypes: {
          DEFCON: Number(ussrStats[0].defcon_losses) || 0,
          "Final Scoring": Number(ussrStats[0].final_scoring_losses) || 0,
          "VP Track": Number(ussrStats[0].vp_track_losses) || 0,
          Wargames: Number(ussrStats[0].wargames_losses) || 0,
          Forfeit: Number(ussrStats[0].forfeit_losses) || 0,
          "Timer Expired": Number(ussrStats[0].timer_losses) || 0,
          "Cuban Missile Crisis": Number(ussrStats[0].cuban_losses) || 0,
          "Scoring Card Held": Number(ussrStats[0].scoring_card_losses) || 0,
          Unknown: Number(ussrStats[0].unknown_losses) || 0,
        },
      },
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in win-types API:", error);
    res.status(500).json({ error: "Failed to fetch win type statistics" });
  }
}
