import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const roles: Prisma.RoleCreateInput[] = [
  { name: 'USER' },
  { name: 'SALES_REPRESENTATIVE' },
  { name: 'QUALITY_CONTROLLER' },
  { name: 'MANAGER' },
  { name: 'ADMIN' },
];

const saleItems: Prisma.SaleItemCreateInput[] = [
  { type: 'CERTIFICATE' },
  { type: 'GREEN_STAMP' },
  { type: 'RED_STAMP' },
];

const admin: Prisma.UserCreateInput = {
  email: 'admin@admin.com',
  name: 'Admin Admin',
  isActive: true,
  password: 'admin',
};

async function main() {
  console.log('Start seeding ...');
  for (const role of roles) {
    await prisma.role.create({
      data: role,
    });
  }

  for (const saleItem of saleItems) {
    await prisma.saleItem.create({
      data: saleItem,
    });
  }

  const password = await bcrypt.hash(admin.password, 10);
  await prisma.user.create({
    data: { ...admin, password, role: { connect: { id: 5 } } },
  });
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
