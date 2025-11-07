import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import {
  GetGamesQueryDto,
  GameListResponse,
  GameFilterDto,
} from './dto/game.dto';

@Controller('games')
@UseGuards(JwtAuthGuard)
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @Public() // Making this public as game results are typically viewable by everyone
  async getGames(@Query() query: GetGamesQueryDto): Promise<GameListResponse> {
    try {
      const {
        id,
        p = '1',
        pageSize = '20',
        userFilter,
        toFilter,
        video,
      } = query;

      // Parse query parameters
      const page = Number(p);
      const pageSizeNum = Number(pageSize);

      // Create filter object
      const filter: GameFilterDto = {};

      if (id) {
        filter.id = Number(id);
      }

      if (userFilter) {
        filter.userFilter = userFilter.split(',').map(Number);
      }

      if (toFilter) {
        filter.toFilter = toFilter.split(',').map(Number);
      }

      if (video === 'true') {
        filter.video = true;
      }

      const result = await this.gamesService.getGamesWithRatings(
        filter,
        page,
        pageSizeNum,
      );

      return result;
    } catch (error) {
      console.error('[Games GET]', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('top/:count')
  @Public()
  async getTopGames(@Param('count') count: string): Promise<GameListResponse> {
    try {
      const topCount = Number(count);
      
      if (isNaN(topCount) || topCount <= 0 || topCount > 100) {
        throw new HttpException(
          'Invalid count parameter. Must be between 1 and 100.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.gamesService.getGamesWithRatings(
        {}, // No filters for top games
        1, // First page
        topCount, // Use count as page size
      );

      return result;
    } catch (error) {
      console.error('[Games GET Top]', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @Public()
  async getGameById(@Param('id') id: string) {
    try {
      const game = await this.gamesService.getGameById(id);
      
      if (!game) {
        throw new HttpException(
          'Game not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return game;
    } catch (error) {
      console.error('[Games GET by ID]', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  @Public()
  getHealth() {
    return { 
      status: 'Games API is healthy', 
      timestamp: new Date().toISOString() 
    };
  }
}
