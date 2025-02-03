import { Controller, Get, Query, BadRequestException } from '@nestjs/common';

import { ProfessionalsService } from './professionals.service';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}
  @Get()
  async getUsers(@Query() query: { search: string }) {
    if (!query.search || query.search.trim() === '') {
      throw new BadRequestException('Search query cannot be empty');
    }

    const users = await this.professionalsService.searchProfessionals(
      query.search,
    );

    return users;
  }
}
