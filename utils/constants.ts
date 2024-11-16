type DropdownType = {
  code: string;
  name: string;
};

export const GAME_QUERY = "game-getAll";

export const turns: Array<DropdownType> = [
  {
    code: "1",
    name: "1",
  },
  {
    code: "2",
    name: "2",
  },
  {
    code: "3",
    name: "3",
  },
  {
    code: "4",
    name: "4",
  },
  {
    code: "5",
    name: "5",
  },
  {
    code: "6",
    name: "6",
  },
  {
    code: "7",
    name: "7",
  },
  {
    code: "8",
    name: "8",
  },
  {
    code: "9",
    name: "9",
  },
  {
    code: "10",
    name: "10",
  },
  {
    code: "Final Scoring",
    name: "11",
  },
];

export const endType: Array<DropdownType> = [
  {
    code: "VP Track (+20)",
    name: "VP Track (+20)",
  },
  {
    code: "Final Scoring",
    name: "Final Scoring",
  },
  {
    code: "Wargames",
    name: "Wargames",
  },
  {
    code: "DEFCON",
    name: "DEFCON",
  },
  {
    code: "Forfeit",
    name: "Forfeit",
  },
  {
    code: "Timer Expired",
    name: "Timer Expired",
  },
  {
    code: "Europe Control",
    name: "Europe Control",
  },
  {
    code: "Scoring Card Held",
    name: "Scoring Card Held",
  },
  {
    code: "Cuban Missile Crisis",
    name: "Cuban Missile Crisis",
  },
];

const getEndType = ({ winningOption, endTurn }: { winningOption: string; endTurn: string }) => {
  // if TIE then Wargammes, Final Scoring
  // if endTurn <= 7 then VP Track, DEFCON, Forfeit, Timer Expired, Europe COntrol, Scoring Card Held, Cuban Missile...
};

const getEndTurn = ({ winningOption }: { winningOption: string }) => {
  // if TIE then 8, 9, 10
};
export const gameWinningOptions: Array<DropdownType> = [
  {
    code: "1",
    name: "USA",
  },
  {
    code: "2",
    name: "USSR",
  },
  {
    code: "3",
    name: "Tie",
  },
];

export const gameSides: Array<DropdownType> = [
  {
    code: "1",
    name: "USA",
  },
  {
    code: "2",
    name: "USSR",
  },
];

export const userRoles = {
  SUPERADMIN: 3,
  ADMIN: 2,
  PLAYER: 1,
};
