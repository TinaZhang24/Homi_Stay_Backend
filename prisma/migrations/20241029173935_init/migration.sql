/*
  Warnings:

  - A unique constraint covering the columns `[reviewId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reviewId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "reviewId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_reviewId_key" ON "Booking"("reviewId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
