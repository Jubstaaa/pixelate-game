-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "feedback" TEXT,
    "rating" TEXT,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);
