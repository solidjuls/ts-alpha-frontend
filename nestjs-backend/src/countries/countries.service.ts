import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CountryDto } from './dto/countries.dto';

@Injectable()
export class CountriesService {
  constructor(private databaseService: DatabaseService) {}

  async getAllCountries(): Promise<CountryDto[]> {
    const countries = await this.databaseService.countries.findMany({
      select: {
        id: true,
        country_name: true,
        tld_code: true,
      },
      orderBy: {
        country_name: 'asc',
      },
    });

    return countries.map(country => ({
      id: country.id.toString(),
      country_name: country.country_name,
      tld_code: country.tld_code,
    }));
  }
}
