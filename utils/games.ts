export const getWinnerText = (gameWinner: GameWinner) => {
    if (gameWinner === "1") {
      return "USA";
    } else if (gameWinner == "2") {
      return "USSR";
    }
    return "TIE";
  };