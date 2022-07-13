export const getWinnerText = (gameWinner) => {
    if (gameWinner === "1") {
      return "USA";
    } else if (gameWinner == "2") {
      return "USSR";
    }
    return "TIE";
  };