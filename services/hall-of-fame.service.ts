import { createAuthenticatedAxios } from '../utils/api';

export interface HallOfFameApiEntry {
  season: string;
  league_type: string;
  link?: string;
  players: number;
  flag1?: string;
  winner: string;
  winner_id?: number;
  flag2?: string;
  second?: string;
  second_id?: number;
  flag3?: string;
  third?: string;
  third_id?: number;
}

export interface HallOfFameEntry {
  season: string;
  league_type: string;
  link?: string;
  players: number;
  flag1?: string;
  winner: string;
  winnerID?: number;
  flag2?: string;
  second?: string;
  secondID?: number;
  flag3?: string;
  third?: string;
  thirdID?: number;
}

export interface HallOfFameResponse {
  ITSL: HallOfFameEntry[];
  OTSL: HallOfFameEntry[];
  RTSL: HallOfFameEntry[];
}

const hallOfFameApi = createAuthenticatedAxios();

const mapApiEntryToEntry = (apiEntry: HallOfFameApiEntry): HallOfFameEntry => ({
  season: apiEntry.season,
  league_type: apiEntry.league_type,
  link: apiEntry.link,
  players: apiEntry.players,
  flag1: apiEntry.flag1,
  winner: apiEntry.winner,
  winnerID: apiEntry.winner_id,
  flag2: apiEntry.flag2,
  second: apiEntry.second,
  secondID: apiEntry.second_id,
  flag3: apiEntry.flag3,
  third: apiEntry.third,
  thirdID: apiEntry.third_id,
});

const groupAndSortByLeague = (entries: HallOfFameApiEntry[]): HallOfFameResponse => {
  const grouped: HallOfFameResponse = {
    ITSL: [],
    OTSL: [],
    RTSL: [],
  };

  const leagueTypes = entries.map((entry) => entry.league_type);
  const uniqueLeagueTypes = leagueTypes.filter((item, index) => leagueTypes.indexOf(item) === index);

  entries.forEach((apiEntry) => {
    const entry = mapApiEntryToEntry(apiEntry);
    const leagueType = entry.league_type;
    if (uniqueLeagueTypes.includes(leagueType)) {
      if (!grouped[leagueType as keyof HallOfFameResponse]) {
        grouped[leagueType as keyof HallOfFameResponse] = [];
      }
      grouped[leagueType as keyof HallOfFameResponse].push(entry);
    }
  });

  // Sort each league by season (string representing year)

  const sortBySeason = (a: HallOfFameEntry, b: HallOfFameEntry) =>
    a.season.localeCompare(b.season, undefined, { numeric: true });

  uniqueLeagueTypes.forEach((leagueType) => {
    grouped[leagueType.toLowerCase() as keyof HallOfFameResponse]?.sort(sortBySeason);
  });

  return grouped;
};

class HallOfFameService {
  async getHallOfFame(): Promise<HallOfFameResponse> {
    const response = await hallOfFameApi.get<HallOfFameApiEntry[]>('/hall-of-fame');
    return groupAndSortByLeague(response.data);
  }
}

export const hallOfFameService = new HallOfFameService();

