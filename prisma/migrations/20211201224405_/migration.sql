-- DropForeignKey
ALTER TABLE "sale" DROP CONSTRAINT "sale_qa_id_fkey";

-- DropForeignKey
ALTER TABLE "sale" DROP CONSTRAINT "sale_rep_id_fkey";

-- AlterTable
ALTER TABLE "sale" ALTER COLUMN "qa_id" DROP NOT NULL,
ALTER COLUMN "rep_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "sale" ADD CONSTRAINT "sale_qa_id_fkey" FOREIGN KEY ("qa_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale" ADD CONSTRAINT "sale_rep_id_fkey" FOREIGN KEY ("rep_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
