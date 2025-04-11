/*
  Warnings:

  - You are about to drop the column `complaintDate` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `reslovedBy` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `resolveDate` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `upvote` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Complaint` table. All the data in the column will be lost.
  - The `status` column on the `Complaint` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hostelName` column on the `Hostel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[studentId]` on the table `Outing` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `raisedById` to the `Complaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Complaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Complaint` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WardenVerificationStatus" AS ENUM ('Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('Present', 'Absent', 'Leave');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED');

-- DropForeignKey
ALTER TABLE "Complaint" DROP CONSTRAINT "Complaint_userId_fkey";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "isVerified" "WardenVerificationStatus" DEFAULT 'Approved';

-- AlterTable
ALTER TABLE "Complaint" DROP COLUMN "complaintDate",
DROP COLUMN "reslovedBy",
DROP COLUMN "resolveDate",
DROP COLUMN "subject",
DROP COLUMN "upvote",
DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "raisedById" TEXT NOT NULL,
ADD COLUMN     "resolvedById" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ComplaintStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "description" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Hostel" DROP COLUMN "hostelName",
ADD COLUMN     "hostelName" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "ComplaintUpvote" (
    "id" TEXT NOT NULL,
    "complaintId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplaintUpvote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'Present',
    "userId" TEXT NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ComplaintUpvote_complaintId_userId_key" ON "ComplaintUpvote"("complaintId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Outing_studentId_key" ON "Outing"("studentId");

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_raisedById_fkey" FOREIGN KEY ("raisedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintUpvote" ADD CONSTRAINT "ComplaintUpvote_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintUpvote" ADD CONSTRAINT "ComplaintUpvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outing" ADD CONSTRAINT "Outing_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
