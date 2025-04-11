/*
  Warnings:

  - The `isVerified` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Verified" AS ENUM ('Pending', 'Rejected', 'Approved');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "isVerified" "Verified" NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isVerified",
ADD COLUMN     "isVerified" "Verified" NOT NULL DEFAULT 'Pending';
