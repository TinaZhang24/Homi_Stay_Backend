/*
  Warnings:

  - You are about to drop the column `roomNumber` on the `Room` table. All the data in the column will be lost.
  - Added the required column `description` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomName` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "roomNumber",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "roomName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isAdmin" SET DEFAULT false;
