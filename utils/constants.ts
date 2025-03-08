import { DropdownItemType } from "types/types";

export const GAME_QUERY = "game-getAll";

export const turns: Array<DropdownItemType> = [
  {
    value: "1",
    text: "1",
  },
  {
    value: "2",
    text: "2",
  },
  {
    value: "3",
    text: "3",
  },
  {
    value: "4",
    text: "4",
  },
  {
    value: "5",
    text: "5",
  },
  {
    value: "6",
    text: "6",
  },
  {
    value: "7",
    text: "7",
  },
  {
    value: "8",
    text: "8",
  },
  {
    value: "9",
    text: "9",
  },
  {
    value: "10",
    text: "10",
  },
  {
    value: "11",
    text: "Final Scoring",
  },
];

export const endType: Array<DropdownItemType> = [
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

const getEndType = ({ winningOption, endTurn }: { winningOption: string; endTurn: string }) => {
  // if TIE then Wargammes, Final Scoring
  // if endTurn <= 7 then VP Track, DEFCON, Forfeit, Timer Expired, Europe COntrol, Scoring Card Held, Cuban Missile...
};

const getEndTurn = ({ winningOption }: { winningOption: string }) => {
  // if TIE then 8, 9, 10
};
export const gameWinningOptions: Array<DropdownItemType> = [
  {
    value: "1",
    text: "USA",
  },
  {
    value: "2",
    text: "USSR",
  },
  {
    value: "3",
    text: "Tie",
  },
];

export const gameSides: Array<DropdownItemType> = [
  {
    value: "1",
    text: "USA",
  },
  {
    value: "2",
    text: "USSR",
  },
];

export const userRoles = {
  SUPERADMIN: 3,
  ADMIN: 2,
  PLAYER: 1,
};

export const platforms: Array<DropdownItemType> = [
  {
    value: "PC - Steam (Playdek)",
    text: "PC - Steam (Playdek)",
  },
  {
    value: "In person (Physical Game)",
    text: "In person (Physical Game)",
  },
  {
    value: "Mobile - Android App (Playdek)",
    text: "Mobile - Android App (Playdek)",
  },
  {
    value: "Mobile - Ios App (Playdek)",
    text: "Mobile - Ios App (Playdek)",
  },
  {
    value: "Mac - Steam (Playdek)",
    text: "Mac - Steam (Playdek)",
  },
  {
    value: "PC - Saito",
    text: "PC - Saito",
  },
  {
    value: "PC - Wargamesroom",
    text: "PC - Wargamesroom",
  },
  {
    value: "Vassal",
    text: "Vassal",
  },
];

export const gameDurations: Array<DropdownItemType> = [
  {
    value: "30 minutes",
    text: "30 minutes",
  },
  {
    value: "45 minutes",
    text: "45 minutes",
  },
  {
    value: "60 minutes",
    text: "60 minutes",
  },
  {
    value: "90 minutes",
    text: "90 minutes",
  },
  {
    value: "3 hours",
    text: "3 hours",
  },
  {
    value: "Asynch - 3 days",
    text: "Asynch - 3 days",
  },
  {
    value: "Asynch - 7 days",
    text: "Asynch - 7 days",
  },
  {
    value: "Asynch - 21 days",
    text: "Asynch - 21 days",
  },
  {
    value: "Asynch - 45 days",
    text: "Asynch - 45 days",
  },
];
