import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusType } from '.prisma/client';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SaleService {
  constructor(private prismaService: PrismaService) {}

  async createSale(createSaleDto: CreateSaleDto, userId: string) {
    try {
      const sale = await this.prismaService.sale.create({
        data: {
          item: { connect: { id: createSaleDto.itemId } },
          user: { connect: { id: userId } },
          customer: { create: createSaleDto.customer },
          contract: { create: createSaleDto.contract },
          status: { create: { type: StatusType.BEFORE_QA } },
          others: createSaleDto.others,
        },
      });

      return sale;
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
