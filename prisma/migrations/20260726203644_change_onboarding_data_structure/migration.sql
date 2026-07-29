/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `OnboardingData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OnboardingData_userId_key" ON "OnboardingData"("userId");
