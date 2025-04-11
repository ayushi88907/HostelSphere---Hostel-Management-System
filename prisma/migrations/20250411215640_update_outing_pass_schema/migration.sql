/*
  Warnings:

  - You are about to drop the column `approverId` on the `Outing` table. All the data in the column will be lost.
  - The `approvalStatus` column on the `Outing` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `parentsContact` to the `Outing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentsEmail` to the `Outing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Outing" DROP COLUMN "approverId",
ADD COLUMN     "approvedByParents" "Verified" NOT NULL DEFAULT 'Pending',
ADD COLUMN     "approverById" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "leavingTime" TIMESTAMP(3),
ADD COLUMN     "parentsContact" TEXT NOT NULL,
ADD COLUMN     "parentsEmail" TEXT NOT NULL,
DROP COLUMN "approvalStatus",
ADD COLUMN     "approvalStatus" "Verified" NOT NULL DEFAULT 'Pending';

-- AddForeignKey
ALTER TABLE "Outing" ADD CONSTRAINT "Outing_approverById_fkey" FOREIGN KEY ("approverById") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
