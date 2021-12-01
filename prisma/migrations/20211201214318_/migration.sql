-- DropIndex
DROP INDEX "sale_item_id_key";

-- AlterTable
ALTER TABLE "customer" ALTER COLUMN "email" DROP NOT NULL;
