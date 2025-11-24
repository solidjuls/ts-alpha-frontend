import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GameWinner } from '../games/dto/game.dto';
import { PlayerRatingDto, PlayerRatingListResponse } from './dto/rating.dto';

const DEFAULT_RATING = 1500;

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

  private getNewRatings(
    usaRating: number,
    ussrRating: number,
    gameWinner: GameWinner,
    gameType: string,
  ): {
    newUsaRating: number;
    newUssrRating: number;
    usaRating: number;
    ussrRating: number;
  } {
    const K = 32; // K-factor for Elo rating system
    
    // Calculate expected scores
    const expectedUsaScore = 1 / (1 + Math.pow(10, (ussrRating - usaRating) / 400));
    const expectedUssrScore = 1 / (1 + Math.pow(10, (usaRating - ussrRating) / 400));
    
    // Determine actual scores based on game winner
    let usaActualScore: number;
    let ussrActualScore: number;
    
    switch (gameWinner) {
      case "1": // USA wins
        usaActualScore = 1;
        ussrActualScore = 0;
        break;
      case "2": // USSR wins
        usaActualScore = 0;
        ussrActualScore = 1;
        break;
      case "3": // Tie
        usaActualScore = 0.5;
        ussrActualScore = 0.5;
        break;
      default:
        throw new Error(`Invalid game winner: ${gameWinner}`);
    }
    
    // Calculate new ratings
    const newUsaRating = Math.round(usaRating + K * (usaActualScore - expectedUsaScore));
    const newUssrRating = Math.round(ussrRating + K * (ussrActualScore - expectedUssrScore));
    
    return {
      newUsaRating,
      newUssrRating,
      usaRating,
      ussrRating,
    };
  }

  async calculateRating({
    usaPlayerId,
    ussrPlayerId,
    gameWinner,
    gameType,
  }: {
    usaPlayerId: bigint;
    ussrPlayerId: bigint;
    gameWinner: GameWinner;
    gameType: string;
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

    return this.getNewRatings(usaRating, ussrRating, gameWinner, gameType);
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
      whereConditions.name = {
        contains: playdeckName,
        mode: 'insensitive',
      };
    }

    // Filter by name (first + last name)
    if (nameSearch) {
      whereConditions.OR = [
        {
          first_name: {
            contains: nameSearch,
            mode: 'insensitive',
          },
        },
        {
          last_name: {
            contains: nameSearch,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Filter by federation (country name)
    if (federationSearch) {
      whereConditions.countries = {
        country_name: {
          contains: federationSearch,
          mode: 'insensitive',
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
      playdek_name: user.name || undefined,
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
