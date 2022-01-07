import { ApiProperty } from '@nestjs/swagger';
import { Customer as PrismaCustomer } from '.prisma/client';

export class Customer implements PrismaCustomer {
  @ApiProperty({ example: 'Sklep spożywczy' })
  activityType: string;

  @ApiProperty({ example: 'ul. Polna 8f/26, 87-100 Toruń' })
  companyAddress: string;

  @ApiProperty({ example: 'FHU Adam Kowalski' })
  companyName: string;

  @ApiProperty({ example: new Date() })
  createdAt: Date;

  @ApiProperty({ example: new Date() })
  updatedAt: Date;

  @ApiProperty({ example: 'adam@kowalski.com' })
  email: string;

  @ApiProperty({ example: '600100300' })
  phone: string;

  @ApiProperty({ example: '113261b2-ccf4-192c-c123-rl02a4441' })
  id: string;

  @ApiProperty({ example: '3d9e3db6-ae68-45ec-8865-a2a0818e0b01' })
  lawyerId: string;

  @ApiProperty({ example: 'Adam Kowalski' })
  name: string;

  @ApiProperty({ example: '95602305951' })
  taxNumber: string;
}
