-- DropIndex
DROP INDEX "user_email_key";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL;
