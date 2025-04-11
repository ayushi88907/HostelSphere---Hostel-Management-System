-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_hostelId_fkey";

-- AlterTable
ALTER TABLE "Hostel" ALTER COLUMN "roomCount" DROP NOT NULL,
ALTER COLUMN "roomOccoupied" DROP NOT NULL;
