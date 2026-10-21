-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "notesFileId" TEXT,
ADD COLUMN     "notesFileName" TEXT,
ADD COLUMN     "videoFileId" TEXT,
ADD COLUMN     "videoFileName" TEXT,
ADD COLUMN     "videoSize" INTEGER,
ALTER COLUMN "youtubeUrl" DROP NOT NULL;
