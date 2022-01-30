import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CeidgCompany } from 'src/docs/swaggerTypes/ceidg-response';
import { CeidgService } from './ceidg.service';

@ApiTags('Ceidg')
@Controller('ceidg')
export class CeidgController {
  constructor(private readonly ceidgService: CeidgService) {}

  @ApiOperation({ summary: 'Get company data from ceidg' })
  @ApiResponse({
    description: 'Success',
    status: 200,
    type: CeidgCompany,
  })
  @Get(':taxNumber')
  findOne(@Param('taxNumber') taxNumber: string) {
    return this.ceidgService.findOne(taxNumber);
  }
}
