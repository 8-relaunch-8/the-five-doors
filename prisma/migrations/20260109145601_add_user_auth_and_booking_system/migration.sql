/*
  Warnings:

  - You are about to alter the column `name` on the `Artist` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `imageUrl` on the `Artist` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `title` on the `Artwork` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `imageUrl` on the `Artwork` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `title` on the `Collection` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `title` on the `Exhibition` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `title` on the `News` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Added the required column `updatedAt` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('ADULT', 'CHILD', 'STUDENT', 'SENIOR', 'GROUP', 'FAMILY', 'DISABLED', 'FREE');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'CANCELLED', 'PENDING');

-- DropForeignKey
ALTER TABLE "ExhibitionArtwork" DROP CONSTRAINT "ExhibitionArtwork_artworkId_fkey";

-- DropForeignKey
ALTER TABLE "ExhibitionArtwork" DROP CONSTRAINT "ExhibitionArtwork_exhibitionId_fkey";

-- AlterTable
ALTER TABLE "Artist" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "imageUrl" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Artwork" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "imageUrl" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Collection" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Exhibition" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "publishedAt" DROP NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "exhibitionId" BIGINT NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL,
    "ticketType" "TicketType" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "totalPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_exhibitionId_idx" ON "Booking"("exhibitionId");

-- CreateIndex
CREATE INDEX "Booking_visitDate_idx" ON "Booking"("visitDate");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Artwork_artistId_idx" ON "Artwork"("artistId");

-- CreateIndex
CREATE INDEX "Artwork_collectionId_idx" ON "Artwork"("collectionId");

-- CreateIndex
CREATE INDEX "Exhibition_startDate_idx" ON "Exhibition"("startDate");

-- CreateIndex
CREATE INDEX "Exhibition_endDate_idx" ON "Exhibition"("endDate");

-- CreateIndex
CREATE INDEX "ExhibitionArtwork_exhibitionId_idx" ON "ExhibitionArtwork"("exhibitionId");

-- CreateIndex
CREATE INDEX "ExhibitionArtwork_artworkId_idx" ON "ExhibitionArtwork"("artworkId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "Exhibition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitionArtwork" ADD CONSTRAINT "ExhibitionArtwork_exhibitionId_fkey" FOREIGN KEY ("exhibitionId") REFERENCES "Exhibition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitionArtwork" ADD CONSTRAINT "ExhibitionArtwork_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;
