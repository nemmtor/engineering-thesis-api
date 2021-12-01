import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusType } from '.prisma/client';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SaleService {
  constructor(private prismaService: PrismaService) {}

  async createSale(createSaleDto: CreateSaleDto, userId: string) {
    try {
      const queries: any[] = [
        this.prismaService.sale.create({
          data: {
            item: { connect: { id: createSaleDto.itemId } },
            user: { connect: { id: userId } },
            customer: {
              connectOrCreate: {
                where: { taxNumber: createSaleDto.customer.taxNumber },
                create: createSaleDto.customer,
              },
            },
            contract: { create: createSaleDto.contract },
            status: { create: { type: StatusType.BEFORE_QA } },
            others: createSaleDto.others,
          },
        }),
      ];

      const existingCustomer = await this.prismaService.customer.findUnique({
        where: { taxNumber: createSaleDto.customer.taxNumber },
      });

      if (existingCustomer) {
        queries.unshift(
          this.prismaService.customer.update({
            data: createSaleDto.customer,
            where: { taxNumber: createSaleDto.customer.taxNumber },
          }),
        );
      }
      const results = await this.prismaService.$transaction(queries);
      console.log(results);

      const sale = results[results.length - 1];

      return sale;
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
