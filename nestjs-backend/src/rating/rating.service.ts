import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GameWinner } from '../games/dto/game.dto';
import { PlayerRatingDto, PlayerRatingListResponse } from './dto/rating.dto';

const DEFAULT_RATING = 5000;
const FRIENDLY_GAME = "47"

@Injectable()
export class RatingService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getRatingByPlayer(playerId: bigint): Promise<{ rating: number } | null> {
    return await this.databaseService.ratings_history.findFirst({
      select: {
        rating: true,
      },
      where: {
        player_id: playerId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
  private roundValue(value: number) {
    if (value < 0) {
      const roundedPositiveValue = Math.round(Math.abs(value));
      return roundedPositiveValue * -1;
    }

    return Math.round(value);
  }
  private  getRatingDifference(
    defeated: number,
    winner: number,
    addValue: number = 100,
    gameType: string,
  ) {
    let basicCalculus = (defeated - winner) * 0.05;
    if (gameType === FRIENDLY_GAME) basicCalculus = basicCalculus / 2;

    const newValue = this.roundValue(basicCalculus) + addValue;

    if (addValue !== 0 && newValue <= 0) {
      return 1;
    }
    if (newValue > 200) {
      return 200;
    }

    return newValue;
  };

  private getSmallerValue(value1: number, value2: number) {
    if (value1 > value2) return { bigger: value1, smaller: value2 };
    if (value1 < value2) return { bigger: value1, smaller: value2 };
    return { bigger: value1, smaller: value2 };
  };

  private getNewRatings(
    usaRating: number,
    ussrRating: number,
    gameWinner: GameWinner,
    tournamentId: string,
  ): {
    newUsaRating: number;
    newUssrRating: number;
    usaRating: number;
    ussrRating: number;
  } {
    let newUsaRating: number = 0;
    let newUssrRating: number = 0;

    if (gameWinner === "1") {
      const ratingDifference: number = this.getRatingDifference(
        ussrRating,
        usaRating,
        tournamentId === FRIENDLY_GAME ? 50 : 100,
        tournamentId,
      );
      newUsaRating = usaRating + ratingDifference;
      newUssrRating = ussrRating - ratingDifference;
    } else if (gameWinner === "2") {
      const ratingDifference: number = this.getRatingDifference(
        usaRating,
        ussrRating,
        tournamentId === FRIENDLY_GAME ? 50 : 100,
        tournamentId,
      );
      newUsaRating = usaRating - ratingDifference;
      newUssrRating = ussrRating + ratingDifference;
    } else if (gameWinner === "3") {
      const { bigger, smaller } = this.getSmallerValue(usaRating, ussrRating);
      const ratingDifference: number = this.getRatingDifference(smaller, bigger, 0, tournamentId);
      console.log("ratingDifference", ratingDifference, usaRating, ussrRating, bigger, smaller);

      if (usaRating <= ussrRating) {
        newUsaRating = usaRating + Math.abs(ratingDifference);
        newUssrRating = ussrRating - Math.abs(ratingDifference);
        console.log("usaRating <= ussrRating", newUsaRating, newUssrRating);
      } else if (usaRating > ussrRating) {
        newUsaRating = usaRating - Math.abs(ratingDifference);
        newUssrRating = ussrRating + Math.abs(ratingDifference);
        console.log("usaRating > ussrRating", newUsaRating, newUssrRating);
      }
    }
    return { newUsaRating, newUssrRating, usaRating, ussrRating };
  }

  async calculateRating({
    usaPlayerId,
    ussrPlayerId,
    gameWinner,
    tournamentId,
  }: {
    usaPlayerId: bigint;
    ussrPlayerId: bigint;
    gameWinner: GameWinner;
    tournamentId: string;
  }): Promise<{
    newUsaRating: number;
    newUssrRating: number;
    usaRating: number;
    ussrRating: number;
  }> {
    const usaRatingRecord = await this.getRatingByPlayer(usaPlayerId);
    const ussrRatingRecord = await this.getRatingByPlayer(ussrPlayerId);

    const usaRating = usaRatingRecord?.rating || DEFAULT_RATING;
    const ussrRating = ussrRatingRecord?.rating || DEFAULT_RATING;

    console.log('usaRating, ussrRating', usaRating, ussrRating);

    return this.getNewRatings(usaRating, ussrRating, gameWinner, tournamentId);
  }

  async getPlayerRatings({
    page,
    pageSize,
    playerIds,
    countryId,
    playdeckName,
    nameSearch,
    federationSearch,
    orderBy = 'rating',
    orderDirection = 'desc',
  }: {
    page: number;
    pageSize: number;
    playerIds?: string[];
    countryId?: string;
    playdeckName?: string;
    nameSearch?: string;
    federationSearch?: string;
    orderBy?: 'rating' | 'name' | 'country';
    orderDirection?: 'asc' | 'desc';
  }): Promise<PlayerRatingListResponse> {
    const skip = (page - 1) * pageSize;

    // Build where conditions
    const whereConditions: any = {};

    // Filter by specific player IDs
    if (playerIds && playerIds.length > 0) {
      whereConditions.id = {
        in: playerIds.map(id => BigInt(id)),
      };
    }

    // Filter by country
    if (countryId) {
      whereConditions.country_id = BigInt(countryId);
    }

    // Filter by playdek name (using the 'name' field)
    if (playdeckName) {
      whereConditions.playdek_name = {
        contains: playdeckName,
      };
    }

    // Filter by name (first + last name)
    if (nameSearch) {
      whereConditions.OR = [
        {
          first_name: {
            contains: nameSearch,
          },
        },
        {
          last_name: {
            contains: nameSearch,
          },
        },
      ];
    }

    // Filter by federation (country name)
    if (federationSearch) {
      whereConditions.countries = {
        country_name: {
          contains: federationSearch,
        },
      };
    }

    // Get users with their latest ratings
    const users = await this.databaseService.users.findMany({
      where: whereConditions,
      include: {
        countries: {
          select: {
            tld_code: true,
            country_name: true,
          },
        },
        ratings_history: {
          select: {
            rating: true,
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
        },
      },
      skip,
      take: pageSize,
    });

    // Get total count for pagination
    const totalCount = await this.databaseService.users.count({
      where: whereConditions,
    });

    // Transform and sort results
    let results: PlayerRatingDto[] = users.map((user, index) => ({
      id: user.id.toString(),
      rank: skip + index + 1, // Will be recalculated after sorting
      name: `${user.first_name} ${user.last_name}`.trim(),
      first_name: user.first_name,
      last_name: user.last_name,
      countryCode: user.countries?.tld_code || undefined,
      country_name: user.countries?.country_name || undefined,
      rating: user.ratings_history[0]?.rating || DEFAULT_RATING,
      playdek_name: user.playdek_name || undefined,
    }));

    // Sort results
    results.sort((a, b) => {
      let comparison = 0;

      switch (orderBy) {
        case 'rating':
          comparison = b.rating - a.rating; // Default desc for rating
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'country':
          comparison = (a.country_name || '').localeCompare(b.country_name || '');
          break;
        default:
          comparison = b.rating - a.rating;
      }

      return orderDirection === 'asc' ? comparison : -comparison;
    });

    // Recalculate ranks based on sorted order
    results = results.map((result, index) => ({
      ...result,
      rank: skip + index + 1,
    }));

    return {
      results,
      totalRows: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }
}
