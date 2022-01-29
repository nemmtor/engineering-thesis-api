import { Controller, Get, Param } from '@nestjs/common';
import { CeidgService } from './ceidg.service';

@Controller('ceidg')
export class CeidgController {
  constructor(private readonly ceidgService: CeidgService) {}

  @Get(':taxNumber')
  findOne(@Param('taxNumber') taxNumber: string) {
    return this.ceidgService.findOne(taxNumber);
  }
}
