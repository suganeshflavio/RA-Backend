-- CreateEnum
CREATE TYPE "OptionChoice" AS ENUM ('A', 'B', 'C', 'D');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "TestQuestion" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    "marksPerQuestion" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestQuestionItem" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "correctOption" "OptionChoice" NOT NULL,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestQuestionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAttempt" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "status" "AttemptStatus" NOT NULL DEFAULT 'COMPLETED',
    "totalQuestions" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL,
    "wrongAnswers" INTEGER NOT NULL,
    "marksPerQuestion" INTEGER NOT NULL,
    "totalMarks" INTEGER NOT NULL,
    "obtainedMarks" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAttemptAnswer" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedOption" "OptionChoice" NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentAttemptAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TestQuestion_videoId_idx" ON "TestQuestion"("videoId");

-- CreateIndex
CREATE INDEX "TestQuestionItem_testId_idx" ON "TestQuestionItem"("testId");

-- CreateIndex
CREATE INDEX "StudentAttempt_studentId_idx" ON "StudentAttempt"("studentId");

-- CreateIndex
CREATE INDEX "StudentAttempt_videoId_idx" ON "StudentAttempt"("videoId");

-- CreateIndex
CREATE INDEX "StudentAttempt_testId_idx" ON "StudentAttempt"("testId");

-- CreateIndex
CREATE INDEX "StudentAttempt_status_idx" ON "StudentAttempt"("status");

-- CreateIndex
CREATE INDEX "StudentAttemptAnswer_attemptId_idx" ON "StudentAttemptAnswer"("attemptId");

-- CreateIndex
CREATE INDEX "StudentAttemptAnswer_questionId_idx" ON "StudentAttemptAnswer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAttemptAnswer_attemptId_questionId_key" ON "StudentAttemptAnswer"("attemptId", "questionId");

-- AddForeignKey
ALTER TABLE "TestQuestion" ADD CONSTRAINT "TestQuestion_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestQuestionItem" ADD CONSTRAINT "TestQuestionItem_testId_fkey" FOREIGN KEY ("testId") REFERENCES "TestQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttempt" ADD CONSTRAINT "StudentAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttempt" ADD CONSTRAINT "StudentAttempt_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttempt" ADD CONSTRAINT "StudentAttempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES "TestQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttemptAnswer" ADD CONSTRAINT "StudentAttemptAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "StudentAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttemptAnswer" ADD CONSTRAINT "StudentAttemptAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "TestQuestionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
