import { PrismaClient } from '@prisma/client';

export type SeedLoaderCallback = (prisma: PrismaClient) => Promise<void>;

export class SeedLoader {
  constructor(private prisma: PrismaClient) {}

  public async loadSeed(seedLoadCallback: SeedLoaderCallback) {
    await seedLoadCallback(this.prisma);
  }
}
