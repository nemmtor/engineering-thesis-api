import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/auth/auth.types';
import { ErrorDto } from 'src/docs/swaggerTypes/error';
import { Sale } from 'src/docs/swaggerTypes/sale-response';
import { JwtGuard } from 'src/jwt/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/guards/roles/roles.decorator';
import { StatusType, UserRole } from '.prisma/client';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleService } from './sale.service';
import { FormatSaleResponseInterceptor } from './interceptors/format-sale-response.interceptor';
import { AssignSaleDto } from './dto/assign-sale.dto';
import { ChangeSaleStatusDto } from './dto/change-sale-status.dto';

@ApiTags('Sale')
@UseInterceptors(FormatSaleResponseInterceptor)
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

  @ApiOperation({ summary: 'Get sales' })
  @ApiQuery({ name: 'statuses[]', required: false })
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
    description: 'Success',
    status: 200,
    type: [Sale],
  })
  @UseGuards(JwtGuard)
  @Get()
  async getSales(
    @Req() req: RequestWithUser,
    @Query() query: { statuses: StatusType[] },
  ) {
    return this.saleService.findSales(query.statuses, req.user.id);
  }

  @ApiOperation({ summary: 'Get unassigned sales' })
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
    description: 'Success',
    status: 200,
    type: [Sale],
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(
    UserRole.MANAGER,
    UserRole.SALES_REPRESENTATIVE,
    UserRole.QUALITY_CONTROLLER,
  )
  @Get('/unassigned')
  async getUnassignedSales(@Req() req: RequestWithUser) {
    return this.saleService.getUnassignedSales(req.user);
  }

  @ApiOperation({ summary: 'Assign sale' })
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
    description: 'Success',
    status: 200,
    type: [Sale],
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(
    UserRole.MANAGER,
    UserRole.SALES_REPRESENTATIVE,
    UserRole.QUALITY_CONTROLLER,
  )
  @Post('/assign')
  async assignSale(
    @Req() req: RequestWithUser,
    @Body() assignSaleDto: AssignSaleDto,
  ) {
    return this.saleService.assignSale(assignSaleDto, req.user);
  }

  @ApiOperation({ summary: 'Change status' })
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
    description: 'Success',
    status: 200,
    type: [Sale],
  })
  @UseGuards(JwtGuard)
  @Post('/change-status')
  async changeStatus(
    @Req() req: RequestWithUser,
    @Body() assignSaleDto: ChangeSaleStatusDto,
  ) {
    return this.saleService.assignSale(assignSaleDto, req.user);
  }
}
