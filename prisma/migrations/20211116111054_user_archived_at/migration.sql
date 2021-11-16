-- AlterTable
ALTER TABLE "User" ADD COLUMN     "archivedAt" TIMESTAMP(3);

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";
