-- CreateEnum
CREATE TYPE "Section" AS ENUM ('GOVERNANCE', 'RISK', 'SECURITY', 'CRISIS', 'BCP', 'PEOPLE', 'OPERATIONS', 'ASSURANCE');

-- CreateEnum
CREATE TYPE "Answer" AS ENUM ('NONE', 'AD_HOC', 'PARTIAL', 'FORMAL', 'EMBEDDED', 'NA');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MODERATE', 'ELEVATED', 'SEVERE');

-- CreateEnum
CREATE TYPE "OperationalFootprint" AS ENUM ('SINGLE_SITE', 'MULTIPLE_SITES', 'MULTI_COUNTRY');

-- CreateEnum
CREATE TYPE "OrganisationStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED');

-- CreateTable
CREATE TABLE "Organisation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "status" "OrganisationStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "consultantName" TEXT,
    "consultantEmail" TEXT,
    "consultantNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "section" "Section" NOT NULL,
    "order" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" "Answer" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "riskLevel" "RiskLevel",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityExposure" (
    "organisationId" TEXT NOT NULL,
    "highRiskActivity" BOOLEAN,
    "operationalFootprint" "OperationalFootprint",
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityExposure_pkey" PRIMARY KEY ("organisationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organisation_accessToken_key" ON "Organisation"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "Question_order_key" ON "Question"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Response_organisationId_questionId_key" ON "Response"("organisationId", "questionId");

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Country" ADD CONSTRAINT "Country_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityExposure" ADD CONSTRAINT "ActivityExposure_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
