import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { RequestWithUser } from 'src/auth/auth.types';
import { Roles } from 'src/common/guards/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { ErrorDto } from 'src/docs/swaggerTypes/error';
import { Sale } from 'src/docs/swaggerTypes/sale-response';
import { JwtGuard } from 'src/jwt/guards/jwt.guard';
import { StatusType, UserRole } from '.prisma/client';
import { AssignSaleDto } from './dto/assign-sale.dto';
import { ChangeSaleStatusDto } from './dto/change-sale-status.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { FormatSaleResponseInterceptor } from './interceptors/format-sale-response.interceptor';
import { SaleService } from './sale.service';

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
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.USER)
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createSaleDto: CreateSaleDto,
  ) {
    return this.saleService.createSale(createSaleDto, req.user.id);
  }

  @ApiOperation({ summary: 'Update sale' })
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
    description: 'Sale updated',
    status: 201,
    type: Sale,
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.USER)
  @Put(':id')
  async update(
    @Req() req: RequestWithUser,
    @Param('id') saleId: string,
    @Body() createSaleDto: CreateSaleDto,
  ) {
    return this.saleService.updateSale(createSaleDto, saleId);
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
    return this.saleService.findSales(
      query.statuses,
      req.user.id,
      req.user.role.name,
    );
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

  @ApiOperation({ summary: 'Get sale by id' })
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
    type: Sale,
  })
  @UseGuards(JwtGuard)
  @Get(':id')
  async getSale(@Param('id') saleId: string, @Req() req: RequestWithUser) {
    return this.saleService.findById(saleId, req.user);
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
    @Body() changeSaleStatusDto: ChangeSaleStatusDto,
  ) {
    return this.saleService.changeSaleStatus(changeSaleStatusDto, req.user);
  }

  @ApiOperation({ summary: 'Upload contract image' })
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
  @Post('/upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './uploads/',
        filename: (_req, file, cb) => {
          const splittedFile = file.originalname.split('.');
          const extension = splittedFile[splittedFile.length - 1];
          cb(null, `${Date.now().toString()}.${extension}`);
        },
      }),
    }),
  )
  uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const response: string[] = [];

    if (!files || files.length === 0) {
      throw new BadRequestException('No files');
    }

    files.forEach((file) => {
      response.push(file.filename);
    });

    return response;
  }
}
