import { createAuthenticatedAxios } from '../utils/api';

// API response format (snake_case from backend)
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

// Frontend format (camelCase)
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
  itsl: HallOfFameEntry[];
  otsl: HallOfFameEntry[];
  rtsl: HallOfFameEntry[];
}

// Create axios instance for NestJS backend with auth
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
    itsl: [],
    otsl: [],
    rtsl: [],
  };

  entries.forEach((apiEntry) => {
    const entry = mapApiEntryToEntry(apiEntry);
    const leagueType = entry.league_type?.toUpperCase();
    if (leagueType === 'ITSL') {
      grouped.itsl.push(entry);
    } else if (leagueType === 'OTSL') {
      grouped.otsl.push(entry);
    } else if (leagueType === 'RTSL') {
      grouped.rtsl.push(entry);
    }
  });

  // Sort each league by season (string representing year)
  const sortBySeason = (a: HallOfFameEntry, b: HallOfFameEntry) =>
    a.season.localeCompare(b.season, undefined, { numeric: true });

  grouped.itsl.sort(sortBySeason);
  grouped.otsl.sort(sortBySeason);
  grouped.rtsl.sort(sortBySeason);

  return grouped;
};

class HallOfFameService {
  async getHallOfFame(): Promise<HallOfFameResponse> {
    const response = await hallOfFameApi.get<HallOfFameApiEntry[]>('/hall-of-fame');
    return groupAndSortByLeague(response.data);
  }
}

export const hallOfFameService = new HallOfFameService();

