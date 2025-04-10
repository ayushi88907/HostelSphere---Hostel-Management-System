/*
  Warnings:

  - The values [reject] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `image` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Complaint` table. All the data in the column will be lost.
  - The `type` column on the `Complaint` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `subject` to the `Complaint` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ComplaintType" AS ENUM ('low', 'medium', 'high');

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('resolved', 'pending', 'inProgress');
ALTER TABLE "Complaint" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Outing" ALTER COLUMN "approvalStatus" DROP DEFAULT;
ALTER TABLE "Complaint" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TABLE "Outing" ALTER COLUMN "approvalStatus" TYPE "Status_new" USING ("approvalStatus"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Complaint" ALTER COLUMN "status" SET DEFAULT 'pending';
ALTER TABLE "Outing" ALTER COLUMN "approvalStatus" SET DEFAULT 'pending';
COMMIT;

-- AlterTable
ALTER TABLE "Complaint" DROP COLUMN "image",
DROP COLUMN "title",
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "resolvedMessage" TEXT,
ADD COLUMN     "subject" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "ComplaintType" NOT NULL DEFAULT 'low';
