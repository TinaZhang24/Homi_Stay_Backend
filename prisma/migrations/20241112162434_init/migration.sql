/*
  Warnings:

  - You are about to drop the column `bookingId` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roomId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_bookingId_fkey";

-- DropIndex
DROP INDEX "Review_bookingId_key";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "bookingId",
ADD COLUMN     "roomId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_roomId_key" ON "Review"("roomId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
