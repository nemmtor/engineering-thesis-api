/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User"
ADD COLUMN "roleId" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "UserRoles" (
    "id" SERIAL NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("id")
);

INSERT INTO "UserRoles" (role)
VALUES
  ('USER'),
  ('SALES_REPRESENTATIVE'),
  ('QUALITY_CONTROLLER'),
  ('MANAGER'),
  ('ADMIN');

UPDATE "User"
	SET "roleId"=1 WHERE "role" = 'USER';

UPDATE "User"
	SET "roleId"=2 WHERE "role" = 'SALES_REPRESENTATIVE';

UPDATE "User"
	SET "roleId"=3 WHERE "role" = 'QUALITY_CONTROLLER';

UPDATE "User"
	SET "roleId"=4 WHERE "role" = 'MANAGER';

UPDATE "User"
	SET "roleId"=5 WHERE "role" = 'ADMIN';


ALTER TABLE "User" DROP COLUMN "role";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "UserRoles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
