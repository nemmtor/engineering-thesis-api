-- DropForeignKey
ALTER TABLE "sale" DROP CONSTRAINT "sale_item_id_fkey";

-- AlterTable
ALTER TABLE "sale" ALTER COLUMN "item_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "sale" ADD CONSTRAINT "sale_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "saleitem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
