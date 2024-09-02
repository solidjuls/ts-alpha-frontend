import { turns } from "utils/constants";

export const getWinnerText = (gameWinner) => {
  if (gameWinner === "1") {
    return "USA";
  } else if (gameWinner == "2") {
    return "USSR";
  }
  return "TIE";
};

export const getTurnText = (turnNumber) => {
  return turns.find((turn) => turn.value === String(turnNumber))?.text;
};
