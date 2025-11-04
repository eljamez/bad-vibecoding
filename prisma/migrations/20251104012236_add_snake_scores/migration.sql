-- CreateTable
CREATE TABLE "SnakeScore" (
    "id" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SnakeScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SnakeScore_score_idx" ON "SnakeScore"("score" DESC);
