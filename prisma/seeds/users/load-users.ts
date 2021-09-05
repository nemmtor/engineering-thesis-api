import { SeedLoaderCallback } from 'prisma/seed.loader';
import { users } from './users';

export const loadUsers: SeedLoaderCallback = async (prisma) => {
  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }
};
