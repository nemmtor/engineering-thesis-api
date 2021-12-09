import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserWithRole } from 'src/user/user.types';
import { Prisma, StatusType, UserRole } from '.prisma/client';
import { CreateSaleDto } from './dto/create-sale.dto';

const userSelect = {
  avatarUrl: true,
  createdAt: true,
  archivedAt: true,
  email: true,
  id: true,
  isActive: true,
  name: true,
  updatedAt: true,
  roleId: true,
};

const isValidStatus = (status: any): status is StatusType => {
  if (Object.keys(StatusType).includes(status)) {
    return true;
  }
  return false;
};

// TODO: it should be in pipe
const isArrayOfValidStatuses = (statuses: any): statuses is StatusType[] => {
  if (!Array.isArray(statuses)) return false;

  if (!statuses.every(isValidStatus)) return false;

  return true;
};

@Injectable()
export class SaleService {
  constructor(private prismaService: PrismaService) {}

  async getUnassignedSales(user: UserWithRole) {
    const where: Prisma.SaleWhereInput = {};

    if (
      user.role.name === UserRole.ADMIN ||
      user.role.name === UserRole.MANAGER
    ) {
      where.AND = {
        status: { is: { type: { in: ['BEFORE_QA', 'SALE_CONFIRMED'] } } },
      };

      where.OR = [{ qaId: { equals: null } }, { repId: { equals: null } }];
    }

    if (user.role.name === UserRole.SALES_REPRESENTATIVE) {
      where.AND = {
        status: { is: { type: { equals: 'SALE_CONFIRMED' } } },
      };

      where.OR = [{ repId: { equals: null } }];
    }

    if (user.role.name === UserRole.QUALITY_CONTROLLER) {
      where.AND = {
        status: { is: { type: { equals: 'BEFORE_QA' } } },
      };

      where.OR = [{ qaId: { equals: null } }];
    }

    try {
      const sales = await this.prismaService.sale.findMany({
        select: {
          id: true,
          contract: true,
          customer: true,
          item: true,
          qa: { select: userSelect },
          user: { select: userSelect },
          rep: { select: userSelect },
          status: true,
          others: true,
        },
        where,
      });

      return sales;
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async findSales(statuses: StatusType[], userId: string) {
    if (!!statuses && !isArrayOfValidStatuses(statuses)) {
      throw new BadRequestException();
    }

    try {
      const sales = await this.prismaService.sale.findMany({
        select: {
          id: true,
          contract: true,
          customer: true,
          item: true,
          qa: { select: userSelect },
          user: { select: userSelect },
          rep: { select: userSelect },
          status: true,
          others: true,
        },
        where: {
          OR: [{ userId }, { qaId: userId }, { repId: userId }],
          AND: { status: { is: { type: { in: statuses } } } },
        },
      });

      return sales;
    } catch (error) {
      throw new ConflictException(error);
    }
  }

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

      const sale = results[results.length - 1];

      return sale;
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
