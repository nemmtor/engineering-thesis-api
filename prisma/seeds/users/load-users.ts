import { SeedLoaderCallback } from 'prisma/seed.loader';
import { users } from './users';

export const loadUsers: SeedLoaderCallback = async (prisma) => {
  const createUserPromises = users.map((user) =>
    prisma.user.create({ data: user }),
  );

  await Promise.all(createUserPromises);
};
