/*
  Warnings:

  - Made the column `roomCount` on table `Hostel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Hostel" ALTER COLUMN "roomCount" SET NOT NULL;
