/*
  Warnings:

  - The values [ASSIGNED] on the enum `StatusType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusType_new" AS ENUM ('BEFORE_QA', 'QA_REJECTED', 'DEBT_REJECTED', 'QA_ACCEPTED', 'SALE_CONFIRMED', 'RESIGNATION', 'SIGN_REJECTED', 'SIGN_ACCEPTED');
ALTER TABLE "salestatus" ALTER COLUMN "type" TYPE "StatusType_new" USING ("type"::text::"StatusType_new");
ALTER TYPE "StatusType" RENAME TO "StatusType_old";
ALTER TYPE "StatusType_new" RENAME TO "StatusType";
DROP TYPE "StatusType_old";
COMMIT;
