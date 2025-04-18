/*
  Warnings:

  - You are about to drop the column `parentsContact` on the `Outing` table. All the data in the column will be lost.
  - You are about to drop the column `parentsEmail` on the `Outing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN     "isSuccessfullyResolved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Outing" DROP COLUMN "parentsContact",
DROP COLUMN "parentsEmail";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "parentsContact" TEXT,
ADD COLUMN     "parentsEmail" TEXT;
