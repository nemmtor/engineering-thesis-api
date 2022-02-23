import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserWithRole } from 'src/user/user.types';
import { ItemType, Prisma, Sale, StatusType, UserRole } from '.prisma/client';
import { AssignSaleDto } from './dto/assign-sale.dto';
import { ChangeSaleStatusDto } from './dto/change-sale-status.dto';
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

const toItemTypeReadable: Record<ItemType, string> = {
  CERTIFICATE: 'certyfikat',
  GREEN_STAMP: 'zieloną pieczęć',
  RED_STAMP: 'czerwoną pieczęć',
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

      const sale = results[results.length - 1] as Sale & {
        contract: { plannedSignAt: Date };
      };

      await this.notificationService.addSocketNotification({
        message: `Sprzedawca ${user.name} dodał nową sprzedaż.`,
        channel: 'manager',
      });

      await this.notificationService.addSocketNotification({
        message: `Sprzedaż dla klienta: ${createSaleDto.customer.name}(nip: ${createSaleDto.customer.taxNumber}) oczekuje na weryfikację.`,
        channel: 'qa',
      });

      const userNotificationDate = new Date(
        new Date().setDate(
          new Date(createSaleDto.contract.plannedSignAt).getDate() - 1,
        ),
      );

      await this.notificationService.addDbNotification(
        user.id,
        userNotificationDate,
        `Potwierdź sprzedaż dla klienta ${createSaleDto.customer.name}`,
      );

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
        contract: { select: { plannedSignAt: true } },
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

      this.notificationService.addSocketNotification({
        channel: 'manager',
        message: `Sprzedaż dla klienta ${sale.customer.name} została przypisana do przedstawiciela: ${user.name}`,
      });

      this.notificationService.addSocketNotification({
        channel: `${sale.userId}`,
        message:
          'Twoja sprzedaż została przypisana do przedstawiciela handlowego',
      });

      await this.notificationService.addDbNotification(
        user.id,
        sale.contract.plannedSignAt,
        `Udaj się dziś do klienta ${sale.customer.name} w celu podpisania umowy`,
      );

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

      this.notificationService.addSocketNotification({
        channel: 'manager',
        message: `Sprzedaż dla klienta ${sale.customer.name} została przypisana do kontrolera: ${user.name}`,
      });

      this.notificationService.addSocketNotification({
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

      this.notificationService.addSocketNotification({
        channel: assignSaleDto.userId,
        message: `Manager przypisał Ci sprzedaż dla ${sale.customer.name}`,
      });

      this.notificationService.addSocketNotification({
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

      if (changeSaleStatusDto.status === 'SALE_CONFIRMED') {
        this.notificationService.addSocketNotification({
          channel: 'rep',
          message:
            'Nowa sprzedaż oczekuje na przypisanie przez przedstawiciela handlowego',
        });
      }

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

      if (changeSaleStatusDto.status === 'SALE_CONFIRMED' && !sale.rep) {
        this.notificationService.addSocketNotification({
          channel: 'rep',
          message:
            'Nowa sprzedaż oczekuje na przypisanie przez przedstawiciela handlowego',
        });
      }

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

  async getContractPdf(id: string, user: UserWithRole) {
    const sale = await this.findById(id, user);

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'A4',
        bufferPages: true,
        // @ts-ignore
        font: 'fonts/font.ttf',
      });

      doc
        .text('Umowa o świadczenie usług prawnych', { align: 'center' })
        .moveDown(2);

      doc.text(
        `zawarta dnia ${sale.contract.plannedSignAt.toLocaleDateString(
          'pl',
        )} pod adresem ${sale.contract.signAddress}`,
      );

      doc.text(
        `pomiędzy ${sale.customer.name} zwaną/ym dalej Zleceniodawcą, a`,
      );

      doc
        .text(
          'kancelarią prawną Przykładowa Kancelaria Prawna, zwaną dalej Zleceniobiorcą.',
        )
        .moveDown(3);

      doc.text('§1.', { align: 'center' });

      doc
        .text(
          '1. Przedmiotem umowy jest świadczenie usług ochrony prawnej oraz windykacyjnej przez Zleceniobiorcę na rzecz Zleceniodawcy.',
        )
        .moveDown(0.5);

      doc
        .text(
          `2. Umowa zostaje zawarta na ${sale.contract.length} ${
            sale.contract.length === 24 ? 'miesiące' : 'miesięcy'
          }`,
        )
        .moveDown(0.5);

      doc
        .text(
          `3. Zleceniodawca zobowiązuje się uiszczać miesięczny abonament w wysokości ${sale.contract.price}zł brutto na wskazany numer rachunku: 92101101712222936230591007`,
        )
        .moveDown(0.5);

      doc
        .text(
          '4. Zleceniodawcy przysługuje odstąpienie od umowy świadczenia usług w terminie 30 dni od jej podpisania. Warunkiem skutecznego odstąpienia od umowy jest poinformowanie Zleceniobiorcy telefonicznie pod numerem 601202333 lub mailowo na adres biuro@przykladowa-kancelaria.pl',
        )
        .moveDown(0.5);

      doc
        .text(
          `5. Zleceniodawca otrzymał wraz z umową ${
            toItemTypeReadable[sale.item!.type]
          } którą jest zobowiązany oddać w terminie 7 dni od odstąpienia od umowy pod rygorem naliczenia opłaty 99zł brutto.`,
        )
        .moveDown(0.5);

      doc.text('6. Zleceniodawcy przysługujują w ramach umowy:');
      doc.text('- trzy godziny miesięcznie na obsługę prawną');
      doc.text('- dwa raporty BIK miesięcznie');
      doc.text('- jedna reprezentacja w sądzie w ciągu roku');
      doc.text('- nielimitowane konsultacje telefoniczne').moveDown(0.5);
      doc
        .text(
          'Każde przekroczenie wyżej wymienionych usług będzie wiązało się z naliczeniem dodatkowych opłat opisanych w cenniku dołączonym do umowy',
        )
        .moveDown(0.5);

      doc
        .text(
          'Zleceniodawca otrzyma od Zleceniobiorcy fakturę VAT nie później niż do 10 dnia każdego miesiąca.',
        )
        .moveDown(4);

      doc.text('......................');
      doc.text('Podpis Zleceniobiorcy').moveUp(2);

      doc.text('......................', { align: 'right' });
      doc.text('Podpis Zleceniodawcy', { align: 'right' });

      doc.end();

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });

    return pdfBuffer;
  }
}
