import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GameWinner } from '../games/dto/game.dto';

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
}
