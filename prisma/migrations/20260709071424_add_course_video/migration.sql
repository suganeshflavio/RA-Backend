-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "accessType" TEXT NOT NULL DEFAULT 'paid',
    "price" INTEGER,
    "strikePrice" INTEGER,
    "validityMonths" INTEGER,
    "enableEmi" BOOLEAN NOT NULL DEFAULT false,
    "installments" JSONB,
    "subjects" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "subject" TEXT,
    "chapter" TEXT,
    "videoName" TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "description" TEXT,
    "duration" TEXT,
    "order" INTEGER,
    "isPreview" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
