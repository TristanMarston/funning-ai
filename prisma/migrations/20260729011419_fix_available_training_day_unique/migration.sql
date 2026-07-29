-- DropIndex
DROP INDEX "AvailableTrainingDay_planDataId_key";

-- CreateIndex
CREATE UNIQUE INDEX "AvailableTrainingDay_planDataId_dayOfWeek_key" ON "AvailableTrainingDay"("planDataId", "dayOfWeek");
