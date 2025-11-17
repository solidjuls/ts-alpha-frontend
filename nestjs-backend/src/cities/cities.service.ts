import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CityDto } from './dto/cities.dto';

@Injectable()
export class CitiesService {
  constructor(private databaseService: DatabaseService) {}

  async getCities(searchQuery?: string): Promise<CityDto[]> {
    const where = searchQuery ? {
      name: {
        startsWith: searchQuery,
        mode: 'insensitive' as const,
      },
    } : {};

    const cities = await this.databaseService.cities.findMany({
      select: {
        id: true,
        name: true,
        timeZoneId: true,
      },
      where,
      orderBy: {
        name: 'asc',
      },
      take: 100, // Limit results to prevent too many results
    });

    return cities.map(city => ({
      id: city.id.toString(),
      name: `${city.name} - ${city.timeZoneId}`,
    }));
  }
}
