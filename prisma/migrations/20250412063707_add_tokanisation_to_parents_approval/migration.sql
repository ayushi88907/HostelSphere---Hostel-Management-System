/*
  Warnings:

  - A unique constraint covering the columns `[parentApprovalToken]` on the table `Outing` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Outing" ADD COLUMN     "parentApprovalToken" TEXT,
ADD COLUMN     "tokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Outing_parentApprovalToken_key" ON "Outing"("parentApprovalToken");
