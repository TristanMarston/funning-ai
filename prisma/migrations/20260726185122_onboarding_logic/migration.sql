/*
  Warnings:

  - You are about to drop the column `onboardingData` on the `User` table. All the data in the column will be lost.
  - The `onboardingStep` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OnboardingStep" AS ENUM ('goal', 'race', 'mileage', 'availability');

-- CreateEnum
CREATE TYPE "PrimaryGoal" AS ENUM ('race', 'start', 'fitness');

-- CreateEnum
CREATE TYPE "RaceDistance" AS ENUM ('dist_5k', 'dist_10k', 'dist_half', 'dist_marathon', 'dist_100m', 'dist_200m', 'dist_400m', 'dist_800m', 'dist_1600m', 'dist_3200m');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "onboardingData",
DROP COLUMN "onboardingStep",
ADD COLUMN     "onboardingStep" "OnboardingStep" NOT NULL DEFAULT 'goal';

-- CreateTable
CREATE TABLE "OnboardingData" (
    "id" TEXT NOT NULL,
    "primaryGoal" "PrimaryGoal",
    "raceDistance" "RaceDistance",
    "weeklyMileageMin" INTEGER NOT NULL DEFAULT 10,
    "weeklyMileageMax" INTEGER NOT NULL DEFAULT 15,
    "longestRun" DOUBLE PRECISION,
    "trainingDaysMin" INTEGER NOT NULL DEFAULT 3,
    "trainingDaysMax" INTEGER NOT NULL DEFAULT 5,
    "injuries" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "OnboardingData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OnboardingData" ADD CONSTRAINT "OnboardingData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
