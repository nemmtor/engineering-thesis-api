import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/auth/auth.types';
import { JwtGuard } from 'src/jwt/guards/jwt.guard';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleService } from './sale.service';

@ApiTags('Sale')
@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @ApiOperation({ summary: 'Create sale' })
  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createSaleDto: CreateSaleDto,
  ) {
    return this.saleService.createSale(createSaleDto, req.user.id);
  }
}
