-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'QUALITY_CONTROLLER', 'SALES_REPRESENTATIVE', 'USER');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('RED_STAMP', 'GREEN_STAMP', 'CERTIFICATE');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('BEFORE_QA', 'QA_REJECTED', 'DEBT_REJECTED', 'QA_ACCEPTED', 'SALE_CONFIRMED', 'SIGN_REJECTED', 'SIGN_ACCEPTED', 'ASSIGNED');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "archived_at" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "role_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" "UserRole" NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "tax_nunber" TEXT NOT NULL,
    "activity_type" TEXT NOT NULL,
    "company_address" TEXT NOT NULL,
    "lawyer_id" TEXT,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lawyer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "lawyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "signed_at" TIMESTAMP(3) NOT NULL,
    "planned_signed_at" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "length" INTEGER NOT NULL,
    "sign_address" TEXT NOT NULL,

    CONSTRAINT "contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saleitem" (
    "id" SERIAL NOT NULL,
    "type" "ItemType" NOT NULL,

    CONSTRAINT "saleitem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salestatus" (
    "id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "type" "StatusType" NOT NULL,
    "message" TEXT,

    CONSTRAINT "salestatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "item_id" INTEGER NOT NULL,
    "status_id" TEXT NOT NULL,
    "others" TEXT,

    CONSTRAINT "sale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customer_email_key" ON "customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sale_contract_id_key" ON "sale"("contract_id");

-- CreateIndex
CREATE UNIQUE INDEX "sale_item_id_key" ON "sale"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "sale_status_id_key" ON "sale"("status_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_lawyer_id_fkey" FOREIGN KEY ("lawyer_id") REFERENCES "lawyer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale" ADD CONSTRAINT "sale_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale" ADD CONSTRAINT "sale_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale" ADD CONSTRAINT "sale_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale" ADD CONSTRAINT "sale_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "saleitem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale" ADD CONSTRAINT "sale_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "salestatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
