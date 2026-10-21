/*
  Warnings:

  - A unique constraint covering the columns `[userId,videoId]` on the table `UserAccess` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `videoId` to the `UserAccess` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserAccess_userId_courseId_subject_chapter_key";

-- AlterTable
ALTER TABLE "UserAccess" ADD COLUMN     "videoId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "UserAccess_userId_idx" ON "UserAccess"("userId");

-- CreateIndex
CREATE INDEX "UserAccess_courseId_idx" ON "UserAccess"("courseId");

-- CreateIndex
CREATE INDEX "UserAccess_videoId_idx" ON "UserAccess"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccess_userId_videoId_key" ON "UserAccess"("userId", "videoId");

-- AddForeignKey
ALTER TABLE "UserAccess" ADD CONSTRAINT "UserAccess_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
