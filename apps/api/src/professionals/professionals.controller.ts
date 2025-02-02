import { Controller, Get, Query } from '@nestjs/common';

import { ProfessionalsService } from './professionals.service';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}
  @Get()
  async getUsers(@Query() query: { search: string }) {
    console.log(query.search);

    // TODO: Validation required for empty query parameter
    // Copy env variables from env example

    const users = await this.professionalsService.searchProfessionals(
      query.search,
    );

    return users;
  }
}
