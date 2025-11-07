import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
import {
  GameDto,
  GameListResponse,
  GameFilterDto,
  GameRatingDto,
} from './dto/game.dto';

@Injectable()
export class GamesService {
  constructor(private readonly databaseService: DatabaseService) {}

  private createPrismaFilter(filter: GameFilterDto): Prisma.game_resultsWhereInput {
    const prismaFilter: Prisma.game_resultsWhereInput = {};

    if (filter.id) {
      prismaFilter.id = filter.id;
    }

    if (filter.userFilter && filter.userFilter.length > 0) {
      prismaFilter.OR = [
        { usa_player_id: { in: filter.userFilter.map(id => BigInt(id)) } },
        { ussr_player_id: { in: filter.userFilter.map(id => BigInt(id)) } },
      ];
    }

    if (filter.toFilter && filter.toFilter.length > 0) {
      prismaFilter.game_type = { in: filter.toFilter };
    }

    if (filter.video === true) {
      prismaFilter.video1 = { not: null };
    }

    return prismaFilter;
  }

  private async getGamesWithRatingDifference(gamesWithRatingRelated: any[]): Promise<GameDto[]> {
    return await Promise.all(
      gamesWithRatingRelated.map(async (game: any) => {
        const ratingsUSA: GameRatingDto = {
          rating: game.ratingHistoryUSA,
          previousRating: game.usa_previous_rating,
        };

        const ratingsUSSR: GameRatingDto = {
          rating: game.ratingHistoryUSSR,
          previousRating: game.ussr_previous_rating,
        };

        const usaRatingDifference = ratingsUSA.rating - ratingsUSA.previousRating;
        const ussrRatingDifference = ratingsUSSR.rating - ratingsUSSR.previousRating;

        return {
          id: game.id.toString(),
          created_at: game.created_at,
          updated_at: game.updated_at,
          usaPlayerId: game.usa_player_id.toString(),
          ussrPlayerId: game.ussr_player_id.toString(),
          usaRatingDifference,
          ussrRatingDifference,
          gameType: game.tournaments?.tournament_name || 'Unknown',
          game_code: game.game_code,
          reported_at: game.created_at,
          gameWinner: game.game_winner,
          endTurn: game.end_turn ? Number(game.end_turn) : null,
          endMode: game.end_mode,
          gameDate: game.game_date,
          video1: game.video1,
          videoURL: game.video1 || '',
          reporter_id: game.reporter_id?.toString() || null,
          usaCountryCode: game.users_game_results_usa_player_idTousers?.countries?.tld_code || '',
          ussrCountryCode: game.users_game_results_ussr_player_idTousers?.countries?.tld_code || '',
          usaPlayer: `${game.users_game_results_usa_player_idTousers?.first_name || ''} ${game.users_game_results_usa_player_idTousers?.last_name || ''}`.trim(),
          ussrPlayer: `${game.users_game_results_ussr_player_idTousers?.first_name || ''} ${game.users_game_results_ussr_player_idTousers?.last_name || ''}`.trim(),
          ratingsUSA,
          ratingsUSSR,
        };
      }),
    );
  }

  async getGamesWithRatings(
    filter: GameFilterDto,
    page: number,
    pageSize: number,
  ): Promise<GameListResponse> {
    pageSize = pageSize || 20;
    const skip = (page - 1) * pageSize;

    const prismaFilter = this.createPrismaFilter(filter);

    const totalRows = await this.databaseService.game_results.count({
      where: prismaFilter,
    });

    const games = await this.databaseService.game_results.findMany({
      select: {
        id: true,
        usa_player_id: true,
        ussr_player_id: true,
        created_at: true,
        end_mode: true,
        end_turn: true,
        game_code: true,
        game_date: true,
        video1: true,
        game_winner: true,
        usa_previous_rating: true,
        ussr_previous_rating: true,
        reporter_id: true,
        ratings_history: {
          select: {
            rating: true,
            player_id: true,
          },
        },
        tournaments: {
          select: {
            tournament_name: true,
            id: true,
          },
        },
        users_game_results_usa_player_idTousers: {
          select: {
            first_name: true,
            last_name: true,
            countries: {
              select: {
                tld_code: true,
              },
            },
          },
        },
        users_game_results_ussr_player_idTousers: {
          select: {
            first_name: true,
            last_name: true,
            countries: {
              select: {
                tld_code: true,
              },
            },
          },
        },
      },
      where: prismaFilter,
      skip,
      take: pageSize,
      orderBy: [
        {
          created_at: 'desc',
        },
      ],
    });

    const normalizedGames = games.map((game) => {
      let ratingHistoryUSA = 0;
      let ratingHistoryUSSR = 0;
      
      game.ratings_history.forEach(({ rating, player_id }) => {
        if (player_id === game.usa_player_id) {
          ratingHistoryUSA = rating;
        } else if (player_id === game.ussr_player_id) {
          ratingHistoryUSSR = rating;
        }
      });

      return {
        ...game,
        ratingHistoryUSA,
        ratingHistoryUSSR,
      };
    });

    const results = await this.getGamesWithRatingDifference(normalizedGames);

    return {
      results,
      totalRows,
    };
  }

  async getGameById(id: string) {
    const game = await this.databaseService.game_results.findFirst({
      select: {
        created_at: true,
        updated_at: true,
        reported_at: true,
        game_code: true,
        end_turn: true,
        end_mode: true,
        video1: true,
        usa_player_id: true,
        ussr_player_id: true,
        game_winner: true,
        game_type: true,
        id: true,
        tournaments: {
          select: {
            id: true,
          },
        },
      },
      where: {
        id: BigInt(id),
      },
    });

    if (!game) {
      return null;
    }

    return {
      ...game,
      id: game.id.toString(),
      usa_player_id: game.usa_player_id.toString(),
      ussr_player_id: game.ussr_player_id.toString(),
    };
  }
}
