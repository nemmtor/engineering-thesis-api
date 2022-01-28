import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserWithRole } from 'src/user/user.types';
import { NotificationService } from 'src/notification/notification.service';
import { Prisma, Sale, StatusType, UserRole } from '.prisma/client';
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
  constructor(
    private prismaService: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async getUnassignedSales(user: UserWithRole) {
    const where: Prisma.SaleWhereInput = {};

    if (
      user.role.name === UserRole.ADMIN ||
      user.role.name === UserRole.MANAGER
    ) {
      where.OR = [
        {
          AND: {
            status: { is: { type: { equals: 'BEFORE_QA' } } },
            qaId: { equals: null },
          },
        },
        {
          AND: {
            status: { is: { type: { equals: 'SALE_CONFIRMED' } } },
            repId: { equals: null },
          },
        },
      ];
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

  async findSales(statuses: StatusType[], userId: string, userRole: UserRole) {
    if (!!statuses && !isArrayOfValidStatuses(statuses)) {
      throw new BadRequestException();
    }

    const where: Prisma.SaleWhereInput = {
      AND: { status: { is: { type: { in: statuses } } } },
    };

    if (userRole === UserRole.USER) {
      where.AND = { ...where.AND, userId };
    }

    if (userRole === UserRole.SALES_REPRESENTATIVE) {
      where.AND = { ...where.AND, repId: userId };
    }

    if (userRole === UserRole.QUALITY_CONTROLLER) {
      where.AND = { ...where.AND, qaId: userId };
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

  async findById(saleId: string, user: UserWithRole) {
    const where: Prisma.SaleWhereInput = { id: saleId };

    if (user.role.name === 'QUALITY_CONTROLLER') {
      where.AND = { qaId: user.id };
    } else if (user.role.name === 'SALES_REPRESENTATIVE') {
      where.AND = { repId: user.id };
    } else if (user.role.name === 'USER') {
      where.AND = { userId: user.id };
    }

    const sale = await this.prismaService.sale.findFirst({
      select: saleSelect,
      where,
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return sale;
  }

  async createSale(createSaleDto: CreateSaleDto, user: UserWithRole) {
    const userId = user.id;

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

      const sale = results[results.length - 1] as Sale;

      await this.notificationService.addNotification({
        message: `Sprzedawca ${user.name} dodał nową sprzedaż.`,
        channel: 'manager',
      });

      await this.notificationService.addNotification({
        message: `Sprzedaż dla klienta: ${createSaleDto.customer.name}(nip: ${createSaleDto.customer.taxNumber}) oczekuje na weryfikację.`,
        channel: 'qa',
      });

      return sale;
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async updateSale(createSaleDto: CreateSaleDto, saleId: string) {
    const foundSale = await this.prismaService.sale.findUnique({
      where: { id: saleId },
      select: saleSelect,
    });

    if (!foundSale) {
      throw new NotFoundException('Sale not found');
    }

    try {
      const queries: any[] = [
        this.prismaService.sale.update({
          where: {
            id: saleId,
          },
          data: {
            item: { connect: { id: createSaleDto.itemId } },
            others: createSaleDto.others,
          },
          select: saleSelect,
        }),
        this.prismaService.customer.update({
          where: { id: foundSale.customer.id },
          data: createSaleDto.customer,
        }),
        this.prismaService.contract.update({
          where: { id: foundSale.contract.id },
          data: createSaleDto.contract,
        }),
      ];

      await this.prismaService.$transaction(queries);

      return null;
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async assignSale(assignSaleDto: AssignSaleDto, user: UserWithRole) {
    const sale = await this.prismaService.sale.findUnique({
      where: { id: assignSaleDto.saleId },
      select: {
        status: true,
        userId: true,
        repId: true,
        qaId: true,
        customer: { select: { name: true } },
      },
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

      this.notificationService.addNotification({
        channel: 'manager',
        message: `Sprzedaż dla klienta ${sale.customer.name} została przypisana do przedstawiciela: ${user.name}`,
      });

      this.notificationService.addNotification({
        channel: `${sale.userId}`,
        message:
          'Twoja sprzedaż została przypisana do przedstawiciela handlowego',
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

      this.notificationService.addNotification({
        channel: 'manager',
        message: `Sprzedaż dla klienta ${sale.customer.name} została przypisana do kontrolera: ${user.name}`,
      });

      this.notificationService.addNotification({
        channel: `${sale.userId}`,
        message: 'Twoja sprzedaż została przypisana do kontrolera jakości',
      });

      return updatedSale;
    }

    // Admin or Manager change QA or sales rep
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

      this.notificationService.addNotification({
        channel: assignSaleDto.userRole === 'qa' ? 'qa' : 'rep',
        message: `Manager przypisał Ci sprzedaż dla ${sale.customer.name}`,
      });

      this.notificationService.addNotification({
        channel: `${sale.userId}`,
        message: `Twoja sprzedaż została przypisana do ${
          assignSaleDto.userRole === 'qa'
            ? 'kontrolera jakości'
            : 'przedstawiciela handlowego'
        }.`,
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
      select: saleSelect,
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    if (
      user.role.name === UserRole.SALES_REPRESENTATIVE &&
      sale.status.type === StatusType.SALE_CONFIRMED &&
      sale.rep?.id === user.id
    ) {
      if (
        !['SIGN_ACCEPTED', 'SIGN_REJECTED'].includes(changeSaleStatusDto.status)
      ) {
        return new BadRequestException('Wrong status');
      }

      await this.prismaService.saleStatus.update({
        where: { id: sale.status.id },
        data: {
          type: changeSaleStatusDto.status,
          message: changeSaleStatusDto.message,
        },
      });

      return {
        ...sale,
        status: {
          ...sale.status,
          type: changeSaleStatusDto.status,
          message: changeSaleStatusDto.message,
        },
      };
    }

    if (
      user.role.name === UserRole.QUALITY_CONTROLLER &&
      sale.status.type === StatusType.BEFORE_QA &&
      sale.qa?.id === user.id
    ) {
      if (
        !['QA_REJECTED', 'QA_ACCEPTED'].includes(changeSaleStatusDto.status)
      ) {
        return new BadRequestException('Wrong status');
      }

      await this.prismaService.saleStatus.update({
        where: { id: sale.status.id },
        data: {
          type: changeSaleStatusDto.status,
          message: changeSaleStatusDto.message,
        },
      });

      return {
        ...sale,
        status: {
          ...sale.status,
          type: changeSaleStatusDto.status,
          message: changeSaleStatusDto.message,
        },
      };
    }

    if (
      user.role.name === UserRole.USER &&
      ['QA_REJECTED'].includes(sale.status.type) &&
      sale.user.id === user.id
    ) {
      if (!['BEFORE_QA', 'RESIGNATION'].includes(changeSaleStatusDto.status)) {
        return new BadRequestException('Wrong status');
      }

      await this.prismaService.saleStatus.update({
        where: { id: sale.status.id },
        data: {
          type: changeSaleStatusDto.status,
          message: changeSaleStatusDto.message,
        },
      });

      return {
        ...sale,
        status: {
          ...sale.status,
          type: changeSaleStatusDto.status,
          message: changeSaleStatusDto.message,
        },
      };
    }

    if (
      user.role.name === UserRole.USER &&
      ['QA_ACCEPTED'].includes(sale.status.type) &&
      sale.user.id === user.id
    ) {
      if (
        !['SALE_CONFIRMED', 'RESIGNATION'].includes(changeSaleStatusDto.status)
      ) {
        return new BadRequestException('Wrong status');
      }

      await this.prismaService.saleStatus.update({
        where: { id: sale.status.id },
        data: {
          type: changeSaleStatusDto.status,
          message: changeSaleStatusDto.message,
        },
      });

      return {
        ...sale,
        status: {
          ...sale.status,
          type: changeSaleStatusDto.status,
          message: changeSaleStatusDto.message,
        },
      };
    }

    if (['ADMIN', 'MANAGER'].includes(user.role.name)) {
      await this.prismaService.saleStatus.update({
        where: { id: sale.status.id },
        data: {
          type: changeSaleStatusDto.status,
          message: changeSaleStatusDto.message,
        },
      });

      return {
        ...sale,
        status: {
          ...sale.status,
          type: changeSaleStatusDto.status,
          message: changeSaleStatusDto.message,
        },
      };
    }

    return new BadRequestException("Couldn't find proper sale");
  }
}
