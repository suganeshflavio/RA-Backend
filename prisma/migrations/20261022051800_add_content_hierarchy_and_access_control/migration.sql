-- DropForeignKey
ALTER TABLE "StudentAttempt" DROP CONSTRAINT IF EXISTS "StudentAttempt_videoId_fkey";

-- DropForeignKey
ALTER TABLE "TestQuestion" DROP CONSTRAINT IF EXISTS "TestQuestion_videoId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT IF EXISTS "Video_courseId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "TestQuestion_videoId_idx";

-- DropIndex
DROP INDEX IF EXISTS "UserAccess_userId_videoId_key";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN IF EXISTS "subjects";

-- AlterTable
ALTER TABLE "StudentAttempt" ALTER COLUMN "videoId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TestQuestion" DROP COLUMN IF EXISTS "videoId";

-- AlterTable
ALTER TABLE "UserAccess" DROP COLUMN IF EXISTS "chapter",
DROP COLUMN IF EXISTS "subject";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN IF EXISTS "chapter",
DROP COLUMN IF EXISTS "courseId",
DROP COLUMN IF EXISTS "notesFileId",
DROP COLUMN IF EXISTS "notesFileName",
DROP COLUMN IF EXISTS "notesUrl",
DROP COLUMN IF EXISTS "order",
DROP COLUMN IF EXISTS "subject";

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "order" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InlineImage" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InlineImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "notesUrl" TEXT,
    "notesFileId" TEXT,
    "notesFileName" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseSubject" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "classId" TEXT,
    "order" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseTopic" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "order" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseVideo" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "classId" TEXT,
    "order" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseNotes" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "notesId" TEXT NOT NULL,
    "classId" TEXT,
    "order" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseNotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseMcqTest" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "classId" TEXT,
    "order" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseMcqTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotesAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "notesId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserNotesAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMcqTestAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserMcqTestAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TopicToVideo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TopicToVideo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_NotesToTopic" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NotesToTopic_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TestQuestionToTopic" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TestQuestionToTopic_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- CreateIndex
CREATE INDEX "Class_subjectId_idx" ON "Class"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Class_subjectId_name_key" ON "Class"("subjectId", "name");

-- CreateIndex
CREATE INDEX "Chapter_classId_idx" ON "Chapter"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_classId_name_key" ON "Chapter"("classId", "name");

-- CreateIndex
CREATE INDEX "Topic_chapterId_idx" ON "Topic"("chapterId");

-- CreateIndex
CREATE INDEX "CourseSubject_courseId_idx" ON "CourseSubject"("courseId");

-- CreateIndex
CREATE INDEX "CourseSubject_subjectId_idx" ON "CourseSubject"("subjectId");

-- CreateIndex
CREATE INDEX "CourseSubject_classId_idx" ON "CourseSubject"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseSubject_courseId_subjectId_classId_key" ON "CourseSubject"("courseId", "subjectId", "classId");

-- CreateIndex
CREATE INDEX "CourseTopic_courseId_idx" ON "CourseTopic"("courseId");

-- CreateIndex
CREATE INDEX "CourseTopic_topicId_idx" ON "CourseTopic"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseTopic_courseId_topicId_key" ON "CourseTopic"("courseId", "topicId");

-- CreateIndex
CREATE INDEX "CourseVideo_courseId_idx" ON "CourseVideo"("courseId");

-- CreateIndex
CREATE INDEX "CourseVideo_videoId_idx" ON "CourseVideo"("videoId");

-- CreateIndex
CREATE INDEX "CourseVideo_classId_idx" ON "CourseVideo"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseVideo_courseId_videoId_classId_key" ON "CourseVideo"("courseId", "videoId", "classId");

-- CreateIndex
CREATE INDEX "CourseNotes_courseId_idx" ON "CourseNotes"("courseId");

-- CreateIndex
CREATE INDEX "CourseNotes_notesId_idx" ON "CourseNotes"("notesId");

-- CreateIndex
CREATE INDEX "CourseNotes_classId_idx" ON "CourseNotes"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseNotes_courseId_notesId_classId_key" ON "CourseNotes"("courseId", "notesId", "classId");

-- CreateIndex
CREATE INDEX "CourseMcqTest_courseId_idx" ON "CourseMcqTest"("courseId");

-- CreateIndex
CREATE INDEX "CourseMcqTest_testId_idx" ON "CourseMcqTest"("testId");

-- CreateIndex
CREATE INDEX "CourseMcqTest_classId_idx" ON "CourseMcqTest"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseMcqTest_courseId_testId_classId_key" ON "CourseMcqTest"("courseId", "testId", "classId");

-- CreateIndex
CREATE INDEX "Enquiry_createdAt_idx" ON "Enquiry"("createdAt");

-- CreateIndex
CREATE INDEX "Enquiry_email_idx" ON "Enquiry"("email");

-- CreateIndex
CREATE INDEX "UserNotesAccess_userId_idx" ON "UserNotesAccess"("userId");

-- CreateIndex
CREATE INDEX "UserNotesAccess_courseId_idx" ON "UserNotesAccess"("courseId");

-- CreateIndex
CREATE INDEX "UserNotesAccess_notesId_idx" ON "UserNotesAccess"("notesId");

-- CreateIndex
CREATE UNIQUE INDEX "UserNotesAccess_userId_courseId_notesId_key" ON "UserNotesAccess"("userId", "courseId", "notesId");

-- CreateIndex
CREATE INDEX "UserMcqTestAccess_userId_idx" ON "UserMcqTestAccess"("userId");

-- CreateIndex
CREATE INDEX "UserMcqTestAccess_courseId_idx" ON "UserMcqTestAccess"("courseId");

-- CreateIndex
CREATE INDEX "UserMcqTestAccess_testId_idx" ON "UserMcqTestAccess"("testId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMcqTestAccess_userId_courseId_testId_key" ON "UserMcqTestAccess"("userId", "courseId", "testId");

-- CreateIndex
CREATE INDEX "_TopicToVideo_B_index" ON "_TopicToVideo"("B");

-- CreateIndex
CREATE INDEX "_NotesToTopic_B_index" ON "_NotesToTopic"("B");

-- CreateIndex
CREATE INDEX "_TestQuestionToTopic_B_index" ON "_TestQuestionToTopic"("B");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccess_userId_courseId_videoId_key" ON "UserAccess"("userId", "courseId", "videoId");

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSubject" ADD CONSTRAINT "CourseSubject_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSubject" ADD CONSTRAINT "CourseSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseSubject" ADD CONSTRAINT "CourseSubject_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseTopic" ADD CONSTRAINT "CourseTopic_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseTopic" ADD CONSTRAINT "CourseTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseVideo" ADD CONSTRAINT "CourseVideo_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseVideo" ADD CONSTRAINT "CourseVideo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseVideo" ADD CONSTRAINT "CourseVideo_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseNotes" ADD CONSTRAINT "CourseNotes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseNotes" ADD CONSTRAINT "CourseNotes_notesId_fkey" FOREIGN KEY ("notesId") REFERENCES "Notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseNotes" ADD CONSTRAINT "CourseNotes_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMcqTest" ADD CONSTRAINT "CourseMcqTest_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMcqTest" ADD CONSTRAINT "CourseMcqTest_testId_fkey" FOREIGN KEY ("testId") REFERENCES "TestQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseMcqTest" ADD CONSTRAINT "CourseMcqTest_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotesAccess" ADD CONSTRAINT "UserNotesAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotesAccess" ADD CONSTRAINT "UserNotesAccess_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotesAccess" ADD CONSTRAINT "UserNotesAccess_notesId_fkey" FOREIGN KEY ("notesId") REFERENCES "Notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMcqTestAccess" ADD CONSTRAINT "UserMcqTestAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMcqTestAccess" ADD CONSTRAINT "UserMcqTestAccess_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMcqTestAccess" ADD CONSTRAINT "UserMcqTestAccess_testId_fkey" FOREIGN KEY ("testId") REFERENCES "TestQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttempt" ADD CONSTRAINT "StudentAttempt_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TopicToVideo" ADD CONSTRAINT "_TopicToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TopicToVideo" ADD CONSTRAINT "_TopicToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotesToTopic" ADD CONSTRAINT "_NotesToTopic_A_fkey" FOREIGN KEY ("A") REFERENCES "Notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotesToTopic" ADD CONSTRAINT "_NotesToTopic_B_fkey" FOREIGN KEY ("B") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestQuestionToTopic" ADD CONSTRAINT "_TestQuestionToTopic_A_fkey" FOREIGN KEY ("A") REFERENCES "TestQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestQuestionToTopic" ADD CONSTRAINT "_TestQuestionToTopic_B_fkey" FOREIGN KEY ("B") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
