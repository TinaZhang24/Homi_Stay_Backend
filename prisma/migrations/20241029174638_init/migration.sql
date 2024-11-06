/*
  Warnings:

  - You are about to drop the column `reviewId` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookingId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_reviewId_fkey";

-- DropIndex
DROP INDEX "Booking_reviewId_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "reviewId";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "bookingId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_key" ON "Review"("bookingId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
