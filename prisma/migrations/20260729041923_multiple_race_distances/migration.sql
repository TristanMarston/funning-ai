/*
  Warnings:

  - Changed the column `raceDistance` on the `RunningPlanData` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterTable
ALTER TABLE "RunningPlanData" ALTER COLUMN "raceDistance" TYPE "RaceDistance"[] USING array["raceDistance"];
