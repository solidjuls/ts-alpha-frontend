type DropdownType = {
  text: string;
  value: string;
};

export const GAME_QUERY = "game-getAll";
export const leagueTypes: Array<DropdownType> = [
  {
    text: "National / Regional League",
    value: "National League",
  },
  {
    text: "ITSL",
    value: "ITSL",
  },
  {
    text: "OTSL",
    value: "OTSL",
  },
  {
    text: "RTSL",
    value: "RTSL",
  },
  {
    text: "TS Convention",
    value: "TSC",
  },
  {
    text: "TS World Cup",
    value: "TSWC",
  },
  {
    text: "Champions League",
    value: "CL",
  },
  {
    text: "Friendly Game",
    value: "FG",
  },
  {
    text: "Grand Slam",
    value: "GS",
  },
];

export const turns: Array<DropdownType> = [
  {
    text: "1",
    value: "1",
  },
  {
    text: "2",
    value: "2",
  },
  {
    text: "3",
    value: "3",
  },
  {
    text: "4",
    value: "4",
  },
  {
    text: "5",
    value: "5",
  },
  {
    text: "6",
    value: "6",
  },
  {
    text: "7",
    value: "7",
  },
  {
    text: "8",
    value: "8",
  },
  {
    text: "9",
    value: "9",
  },
  {
    text: "10",
    value: "10",
  },
];

export const endType: Array<DropdownType> = [
  {
    value: "VP Track (+20)",
    text: "VP Track (+20)",
  },
  {
    value: "Final Scoring",
    text: "Final Scoring",
  },
  {
    value: "Wargames",
    text: "Wargames",
  },
  {
    value: "DEFCON",
    text: "DEFCON",
  },
  {
    value: "Forfeit",
    text: "Forfeit",
  },
  {
    value: "Timer Expired",
    text: "Timer Expired",
  },
  {
    value: "Europe Control",
    text: "Europe Control",
  },
  {
    value: "Scoring Card Held",
    text: "Scoring Card Held",
  },
  {
    value: "Cuban Missile Crisis",
    text: "Cuban Missile Crisis",
  },
];

const getEndType = ({
  winningOption,
  endTurn,
}: {
  winningOption: string;
  endTurn: string;
}) => {
  // if TIE then Wargammes, Final Scoring
  // if endTurn <= 7 then VP Track, DEFCON, Forfeit, Timer Expired, Europe COntrol, Scoring Card Held, Cuban Missile...
};

const getEndTurn = ({ winningOption }: { winningOption: string }) => {
  // if TIE then 8, 9, 10
};
export const gameWinningOptions: Array<DropdownType> = [
  {
    value: "1",
    text: "USA",
  },
  {
    value: "2",
    text: "URSS",
  },
  {
    value: "3",
    text: "Tie",
  },
];
