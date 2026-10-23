-- AlterTable
ALTER TABLE "StudentAttempt" ADD COLUMN     "negativeMarksPerQuestion" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "obtainedMarks" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "TestQuestion" ADD COLUMN     "negativeMarksPerQuestion" DOUBLE PRECISION NOT NULL DEFAULT 0;
