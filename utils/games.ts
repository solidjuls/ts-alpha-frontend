import { GameWinner } from "types/game.types";
import { turns } from "utils/constants";

export const getWinnerText = (gameWinner: GameWinner) => {
  if (gameWinner === "1") {
    return "USA";
  } else if (gameWinner == "2") {
    return "USSR";
  }
  return "TIE";
};

export const getTurnText = (turnNumber: number | null) => {
  if (!turnNumber) return "-"
  return turns.find((turn) => turn.value === String(turnNumber))?.text;
};
