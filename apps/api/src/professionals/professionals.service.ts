import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ProfessionalsService {
  constructor(private prisma: PrismaService) {}

  async searchProfessionals(searchTerm: string) {
    const results = await this.prisma.$queryRaw`
        WITH search_data AS (
          SELECT
            *,
            CONCAT(
              LOWER(category), ' ',
              LOWER(array_to_string(zones, ' ')), ' ',
              LOWER(array_to_string(branches, ' '))
            ) as search_text
          FROM professionals
        )
        SELECT
          id, name, rating, category, zones, branches,
          similarity(search_text, LOWER(${searchTerm})) AS combined_score,
          CASE
            WHEN LOWER(${searchTerm}) ~* '(best|good|excellent|top|great|amazing|outstanding)' THEN rating
            ELSE NULL
          END AS prioritize_rating
        FROM search_data
        WHERE
          search_text ILIKE ANY (ARRAY['%' || ${searchTerm} || '%'])
          OR similarity(search_text, LOWER(${searchTerm})) > 0.1
        ORDER BY
          prioritize_rating DESC NULLS LAST,  -- Only sort by rating if keywords are found
          combined_score DESC  -- Otherwise, use text similarity
        LIMIT 10;
    `;

    return results;
  }
}
