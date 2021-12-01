import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/auth/auth.types';
import { ErrorDto } from 'src/docs/swaggerTypes/error';
import { Sale } from 'src/docs/swaggerTypes/sale';
import { JwtGuard } from 'src/jwt/guards/jwt.guard';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleService } from './sale.service';

@ApiTags('Sale')
@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @ApiOperation({ summary: 'Create sale' })
  @ApiResponse({
    description: 'Error in database layer',
    status: 409,
    type: ErrorDto,
  })
  @ApiResponse({
    description: 'Unauthorized',
    type: ErrorDto,
    status: 401,
  })
  @ApiResponse({
    description: 'Sale created',
    status: 201,
    type: Sale,
  })
  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createSaleDto: CreateSaleDto,
  ) {
    return this.saleService.createSale(createSaleDto, req.user.id);
  }
}
