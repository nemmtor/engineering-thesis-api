import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({ log: [{ level: 'query', emit: 'stdout' }] });
  }
}
