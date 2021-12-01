/*
  Warnings:

  - A unique constraint covering the columns `[tax_nunber]` on the table `customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `qa_id` to the `sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rep_id` to the `sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sale" ADD COLUMN     "qa_id" TEXT NOT NULL,
ADD COLUMN     "rep_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "customer_tax_nunber_key" ON "customer"("tax_nunber");

-- AddForeignKey
ALTER TABLE "sale" ADD CONSTRAINT "sale_qa_id_fkey" FOREIGN KEY ("qa_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale" ADD CONSTRAINT "sale_rep_id_fkey" FOREIGN KEY ("rep_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
