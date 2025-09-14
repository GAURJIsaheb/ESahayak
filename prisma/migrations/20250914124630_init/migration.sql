-- CreateEnum
CREATE TYPE "City" AS ENUM ('Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('Apartment', 'Villa', 'Plot', 'Office', 'Retail');

-- CreateEnum
CREATE TYPE "Bhk" AS ENUM ('Studio', '1', '2', '3', '4');

-- CreateEnum
CREATE TYPE "Purpose" AS ENUM ('Buy', 'Rent');

-- CreateEnum
CREATE TYPE "Timeline" AS ENUM ('0-3m', '3-6m', '>6m', 'Exploring');

-- CreateEnum
CREATE TYPE "Source" AS ENUM ('Website', 'Referral', 'Walk-in', 'Call', 'Other');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buyers" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "city" "City" NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "bhk" "Bhk",
    "purpose" "Purpose" NOT NULL,
    "budgetMin" INTEGER,
    "budgetMax" INTEGER,
    "timeline" "Timeline" NOT NULL,
    "source" "Source" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'New',
    "notes" TEXT,
    "tags" TEXT[],
    "ownerId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buyer_history" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diff" JSONB NOT NULL,

    CONSTRAINT "buyer_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "buyers" ADD CONSTRAINT "buyers_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_history" ADD CONSTRAINT "buyer_history_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "buyers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
