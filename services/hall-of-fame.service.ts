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
  cl: HallOfFameEntry[];
  rats: HallOfFameEntry[];
  atlantic: HallOfFameEntry[];
  basque: HallOfFameEntry[];
  belgium: HallOfFameEntry[];
  canadian: HallOfFameEntry[];
  catalan: HallOfFameEntry[];
  chinese: HallOfFameEntry[];
  dutch: HallOfFameEntry[];
  eeu: HallOfFameApiEntry[];
  french: HallOfFameEntry[];
  greek: HallOfFameEntry[];
  hongKong: HallOfFameEntry[];
  israel: HallOfFameEntry[];
  italian: HallOfFameEntry[];
  korean: HallOfFameEntry[];
  midwest: HallOfFameEntry[];
  nordic: HallOfFameEntry[];
  polish: HallOfFameEntry[];
  portuguese: HallOfFameEntry[];
  southern: HallOfFameEntry[];
  spanish: HallOfFameEntry[];
  uk: HallOfFameEntry[];
  western: HallOfFameEntry[];
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
    cl: [],
    rats: [],
    atlantic: [],
    basque: [],
    belgium: [],
    canadian: [],
    catalan: [],
    chinese: [],
    dutch: [],
    eeu: [],
    french: [],
    greek: [],
    hongKong: [],
    israel: [],
    italian: [],
    korean: [],
    midwest: [],
    nordic: [],
    polish: [],
    portuguese: [],
    southern: [],
    spanish: [],
    uk: [],
    western: [],
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
    else if (leagueType === 'CL') {
      grouped.cl.push(entry);
    }
    else if (leagueType === 'RATS') {
      grouped.rats.push(entry);
    }
    else if (leagueType === 'ATLANTIC') {
      grouped.atlantic.push(entry);
    }
    else if (leagueType === 'BASQUE') {
      grouped.basque.push(entry);
    }
    else if (leagueType === 'BELGIUM') {
      grouped.belgium.push(entry);
    }
    else if (leagueType === 'CANADIAN') {
      grouped.canadian.push(entry);
    }
    else if (leagueType === 'CATALAN') {
      grouped.catalan.push(entry);
    }
    else if (leagueType === 'CHINESE') {
      grouped.chinese.push(entry);
    }
    else if (leagueType === 'DUTCH') {
      grouped.dutch.push(entry);
    }
    else if (leagueType === 'EEU') {
      grouped.eeu.push(entry);
    }
    else if (leagueType === 'FRENCH') {
      grouped.french.push(entry);
    }
    else if (leagueType === 'GREEK') {
      grouped.greek.push(entry);
    }
    else if (leagueType === 'HONG KONG') {
      grouped.hongKong.push(entry);
    }
    else if (leagueType === 'ISRAEL') {
      grouped.israel.push(entry);
    }
    else if (leagueType === 'ITALIAN') {
      grouped.italian.push(entry);
    }
    else if (leagueType === 'KOREAN') {
      grouped.korean.push(entry);
    }
    else if (leagueType === 'MIDWEST') {
      grouped.midwest.push(entry);
    }
    else if (leagueType === 'NORDIC') {
      grouped.nordic.push(entry);
    }
    else if (leagueType === 'POLISH') {
      grouped.polish.push(entry);
    }
    else if (leagueType === 'PORTUGUESE') {
      grouped.portuguese.push(entry);
    }
    else if (leagueType === 'SOUTHERN') {
      grouped.southern.push(entry);
    }
    else if (leagueType === 'SPANISH') {
      grouped.spanish.push(entry);
    }
    else if (leagueType === 'UK') {
      grouped.uk.push(entry);
    }
    else if (leagueType === 'WESTERN') {
      grouped.western.push(entry);
    }
  });

  // Sort each league by season (string representing year)
  const sortBySeason = (a: HallOfFameEntry, b: HallOfFameEntry) =>
    a.season.localeCompare(b.season, undefined, { numeric: true });

  grouped.itsl.sort(sortBySeason);
  grouped.otsl.sort(sortBySeason);
  grouped.rtsl.sort(sortBySeason);
  grouped.cl.sort(sortBySeason);
  grouped.rats.sort(sortBySeason);
  grouped.atlantic.sort(sortBySeason);
  grouped.basque.sort(sortBySeason);
  grouped.belgium.sort(sortBySeason);
  grouped.canadian.sort(sortBySeason);
  grouped.catalan.sort(sortBySeason);
  grouped.chinese.sort(sortBySeason);
  grouped.dutch.sort(sortBySeason);
  grouped.eeu.sort(sortBySeason);
  grouped.french.sort(sortBySeason);
  grouped.greek.sort(sortBySeason);
  grouped.hongKong.sort(sortBySeason);
  grouped.israel.sort(sortBySeason);
  grouped.italian.sort(sortBySeason);
  grouped.korean.sort(sortBySeason);
  grouped.midwest.sort(sortBySeason);
  grouped.nordic.sort(sortBySeason);
  grouped.polish.sort(sortBySeason);
  grouped.portuguese.sort(sortBySeason);
  grouped.southern.sort(sortBySeason);
  grouped.spanish.sort(sortBySeason);
  grouped.uk.sort(sortBySeason);
  grouped.western.sort(sortBySeason);

  return grouped;
};

class HallOfFameService {
  async getHallOfFame(): Promise<HallOfFameResponse> {
    const response = await hallOfFameApi.get<HallOfFameApiEntry[]>('/hall-of-fame');
    return groupAndSortByLeague(response.data);
  }
}

export const hallOfFameService = new HallOfFameService();

