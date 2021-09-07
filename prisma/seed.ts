import { PrismaClient } from '@prisma/client';
import { SeedLoader } from './seed.loader';
import { loadUsers } from './seeds/users/load-users';

const prisma = new PrismaClient();

async function main() {
  const seedLoader = new SeedLoader(prisma);
  await seedLoader.loadSeed(loadUsers);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
