-- CreateEnum
CREATE TYPE "IdeaStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "IdeaStatus" NOT NULL DEFAULT 'PENDING',
    "problem" TEXT,
    "customer" TEXT,
    "market" TEXT,
    "competitors" JSONB,
    "techStack" JSONB,
    "riskLevel" "RiskLevel",
    "profitabilityScore" INTEGER,
    "justification" TEXT,
    "rawAiResponse" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);
