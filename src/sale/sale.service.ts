import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserWithRole } from 'src/user/user.types';
import { Prisma, StatusType, UserRole } from '.prisma/client';
import { CreateSaleDto } from './dto/create-sale.dto';
import { AssignSaleDto } from './dto/assign-sale.dto';
import { ChangeSaleStatusDto } from './dto/change-sale-status.dto';

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

const saleSelect = {
  id: true,
  contract: true,
  customer: true,
  item: true,
  qa: { select: userSelect },
  user: { select: userSelect },
  rep: { select: userSelect },
  status: true,
  others: true,
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
        select: saleSelect,
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
        select: saleSelect,
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
            contract: {
              create: createSaleDto.contract,
            },
            status: { create: { type: StatusType.BEFORE_QA } },
            others: createSaleDto.others,
          },
          select: saleSelect,
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

  async assignSale(assignSaleDto: AssignSaleDto, user: UserWithRole) {
    const sale = await this.prismaService.sale.findUnique({
      where: { id: assignSaleDto.saleId },
      select: { status: true, repId: true, qaId: true },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    if (
      user.role.name === UserRole.SALES_REPRESENTATIVE &&
      sale.status.type === StatusType.SALE_CONFIRMED &&
      !sale.repId
    ) {
      const updatedSale = await this.prismaService.sale.update({
        where: { id: assignSaleDto.saleId },
        data: {
          repId: user.id,
        },
        select: saleSelect,
      });

      return updatedSale;
    }

    if (
      user.role.name === UserRole.QUALITY_CONTROLLER &&
      sale.status.type === StatusType.BEFORE_QA &&
      !sale.qaId
    ) {
      const updatedSale = await this.prismaService.sale.update({
        where: { id: assignSaleDto.saleId },
        data: {
          qaId: user.id,
        },
        select: saleSelect,
      });

      return updatedSale;
    }

    // Admin or Manager change QA
    if (
      ['ADMIN', 'MANAGER'].includes(user.role.name) &&
      assignSaleDto.userId
      // assignSaleDto.userRole === 'qa'
    ) {
      if (!assignSaleDto.userRole) {
        return new BadRequestException('User role is required');
      }

      const data =
        assignSaleDto.userRole === 'qa'
          ? { qaId: assignSaleDto.userId }
          : { repId: assignSaleDto.userId };

      const updatedSale = await this.prismaService.sale.update({
        where: { id: assignSaleDto.saleId },
        data,
        select: saleSelect,
      });

      return updatedSale;
    }

    return new BadRequestException("Couldn't find proper sale");
  }
  async changeSaleStatus(
    changeSaleStatusDto: ChangeSaleStatusDto,
    user: UserWithRole,
  ) {
    const sale = await this.prismaService.sale.findUnique({
      where: { id: changeSaleStatusDto.saleId },
      select: { status: true, repId: true },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    if (
      user.role.name === UserRole.SALES_REPRESENTATIVE &&
      sale.status.type === StatusType.SALE_CONFIRMED &&
      sale.repId === user.id
    ) {
      await this.prismaService.saleStatus.update({
        where: { id: sale.status.id },
        data: {
          type: changeSaleStatusDto.status,
          message: changeSaleStatusDto.message,
        },
      });

      return 'Ok';
    }

    return new BadRequestException("Couldn't find proper sale");
  }
}
