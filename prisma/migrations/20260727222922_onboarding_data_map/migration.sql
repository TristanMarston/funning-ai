/*
  Warnings:

  - The values [goal,race,mileage,availability] on the enum `OnboardingStep` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `OnboardingData` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('male', 'female', 'prefer_not');

-- CreateEnum
CREATE TYPE "Activity" AS ENUM ('running', 'cycling', 'strength', 'basketball', 'tennis', 'pickleball', 'soccer', 'volleyball');

-- CreateEnum
CREATE TYPE "PrimaryRunningGoal" AS ENUM ('race', 'fitness');

-- CreateEnum
CREATE TYPE "PrimaryCyclingGoal" AS ENUM ('event', 'fitness', 'complement');

-- CreateEnum
CREATE TYPE "RideType" AS ENUM ('road', 'mountain', 'indoor');

-- CreateEnum
CREATE TYPE "PrimaryStrengthGoal" AS ENUM ('muscle', 'athletic', 'general', 'weightloss', 'rehab');

-- CreateEnum
CREATE TYPE "StrengthExperienceLevel" AS ENUM ('beginner', 'novice', 'intermediate', 'advanced', 'expert');

-- CreateEnum
CREATE TYPE "GymAccessLevel" AS ENUM ('full', 'limited', 'unwanted');

-- CreateEnum
CREATE TYPE "SportExperienceLevel" AS ENUM ('casual', 'recreational', 'competitive', 'professional');

-- AlterEnum
BEGIN;
CREATE TYPE "OnboardingStep_new" AS ENUM ('activity_selection', 'user_info', 'running_goal', 'running_race', 'running_experience', 'running_availability', 'cycling_goal', 'cycling_experience', 'cycling_availability', 'strength_goal', 'strength_experience', 'strength_availability', 'sports_level', 'sports_frequency', 'sports_availability', 'notes_and_finalize');
ALTER TABLE "public"."User" ALTER COLUMN "onboardingStep" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "onboardingStep" TYPE "OnboardingStep_new" USING ("onboardingStep"::text::"OnboardingStep_new");
ALTER TYPE "OnboardingStep" RENAME TO "OnboardingStep_old";
ALTER TYPE "OnboardingStep_new" RENAME TO "OnboardingStep";
DROP TYPE "public"."OnboardingStep_old";
ALTER TABLE "User" ALTER COLUMN "onboardingStep" SET DEFAULT 'activity_selection';
COMMIT;

-- DropForeignKey
ALTER TABLE "OnboardingData" DROP CONSTRAINT "OnboardingData_userId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "onboardingStep" SET DEFAULT 'activity_selection';

-- DropTable
DROP TABLE "OnboardingData";

-- DropEnum
DROP TYPE "PrimaryGoal";

-- CreateTable
CREATE TABLE "PlanData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "age" INTEGER,
    "sex" "Sex",
    "weightLbs" INTEGER,
    "injuries" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunningPlanData" (
    "id" TEXT NOT NULL,
    "planDataId" TEXT NOT NULL,
    "primaryGoal" "PrimaryRunningGoal",
    "raceDistance" "RaceDistance",
    "raceDate" TIMESTAMP(3),
    "weeklyMileageMin" INTEGER,
    "weeklyMileageMax" INTEGER,
    "justStarting" BOOLEAN NOT NULL,
    "longestRunPastMonth" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RunningPlanData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CyclingPlanData" (
    "id" TEXT NOT NULL,
    "planDataId" TEXT NOT NULL,
    "primaryGoal" "PrimaryCyclingGoal",
    "rideType" "RideType",
    "weeklyMileageMin" INTEGER,
    "weeklyMileageMax" INTEGER,
    "justStarting" BOOLEAN,
    "powerMeter" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CyclingPlanData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrengthPlanData" (
    "id" TEXT NOT NULL,
    "planDataId" TEXT NOT NULL,
    "primaryGoal" "PrimaryStrengthGoal",
    "gymAccessLevel" "GymAccessLevel",
    "experienceLevel" "StrengthExperienceLevel",
    "sessionLengthMinutes" INTEGER,
    "gymAccess" "GymAccessLevel",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StrengthPlanData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportsPlanData" (
    "id" TEXT NOT NULL,
    "planDataId" TEXT NOT NULL,
    "tennisDaysMin" INTEGER,
    "tennisDaysMax" INTEGER,
    "tennisLevel" "SportExperienceLevel",
    "basketballDaysMin" INTEGER,
    "basketballDaysMax" INTEGER,
    "basketballLevel" "SportExperienceLevel",
    "pickleballDaysMin" INTEGER,
    "pickleballDaysMax" INTEGER,
    "pickleballLevel" "SportExperienceLevel",
    "soccerDaysMin" INTEGER,
    "soccerDaysMax" INTEGER,
    "soccerLevel" "SportExperienceLevel",
    "volleyballDaysMin" INTEGER,
    "volleyballDaysMax" INTEGER,
    "volleyballLevel" "SportExperienceLevel",

    CONSTRAINT "SportsPlanData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailableTrainingDay" (
    "id" TEXT NOT NULL,
    "planDataId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "activitiesDeclared" "Activity"[],
    "runningMinutes" INTEGER,
    "cyclingMinutes" INTEGER,
    "strengthMinutes" INTEGER,
    "basketballMinutes" INTEGER,
    "tennisMinutes" INTEGER,
    "pickleballMinutes" INTEGER,
    "soccerMinutes" INTEGER,
    "volleyballMinutes" INTEGER,

    CONSTRAINT "AvailableTrainingDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlanData_userId_key" ON "PlanData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RunningPlanData_planDataId_key" ON "RunningPlanData"("planDataId");

-- CreateIndex
CREATE UNIQUE INDEX "CyclingPlanData_planDataId_key" ON "CyclingPlanData"("planDataId");

-- CreateIndex
CREATE UNIQUE INDEX "StrengthPlanData_planDataId_key" ON "StrengthPlanData"("planDataId");

-- CreateIndex
CREATE UNIQUE INDEX "SportsPlanData_planDataId_key" ON "SportsPlanData"("planDataId");

-- CreateIndex
CREATE UNIQUE INDEX "AvailableTrainingDay_planDataId_key" ON "AvailableTrainingDay"("planDataId");

-- AddForeignKey
ALTER TABLE "PlanData" ADD CONSTRAINT "PlanData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunningPlanData" ADD CONSTRAINT "RunningPlanData_planDataId_fkey" FOREIGN KEY ("planDataId") REFERENCES "PlanData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CyclingPlanData" ADD CONSTRAINT "CyclingPlanData_planDataId_fkey" FOREIGN KEY ("planDataId") REFERENCES "PlanData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrengthPlanData" ADD CONSTRAINT "StrengthPlanData_planDataId_fkey" FOREIGN KEY ("planDataId") REFERENCES "PlanData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportsPlanData" ADD CONSTRAINT "SportsPlanData_planDataId_fkey" FOREIGN KEY ("planDataId") REFERENCES "PlanData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailableTrainingDay" ADD CONSTRAINT "AvailableTrainingDay_planDataId_fkey" FOREIGN KEY ("planDataId") REFERENCES "PlanData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
