-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "system";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "warehouse";

-- CreateTable
CREATE TABLE "system"."users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(60) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "status_id" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."user_personal_data" (
    "id" SERIAL NOT NULL,
    "firstname" VARCHAR(60) NOT NULL,
    "lastname" VARCHAR(60) NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "phone_number" VARCHAR(60) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_personal_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."users_status" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,

    CONSTRAINT "users_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system"."roles_by_users" (
    "role_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "system"."customers" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse"."products" (
    "id" SERIAL NOT NULL,
    "SKU" VARCHAR(60) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "stock" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "buy_price" DOUBLE PRECISION NOT NULL,
    "sell_price" DOUBLE PRECISION NOT NULL,
    "image" TEXT,
    "stock_umbral" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse"."products_categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,

    CONSTRAINT "products_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "system"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "system"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_personal_data_user_id_key" ON "system"."user_personal_data"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_status_name_key" ON "system"."users_status"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "system"."roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_by_users_role_id_user_id_key" ON "system"."roles_by_users"("role_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_SKU_key" ON "warehouse"."products"("SKU");

-- CreateIndex
CREATE UNIQUE INDEX "products_categories_name_key" ON "warehouse"."products_categories"("name");

-- AddForeignKey
ALTER TABLE "system"."users" ADD CONSTRAINT "users_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "system"."users_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."user_personal_data" ADD CONSTRAINT "user_personal_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."roles_by_users" ADD CONSTRAINT "roles_by_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system"."roles_by_users" ADD CONSTRAINT "roles_by_users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "system"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse"."products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "warehouse"."products_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
