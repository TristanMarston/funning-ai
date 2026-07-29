-- CreateEnum
CREATE TYPE "StrengthExercises" AS ENUM ('calisthenics', 'free_weights', 'weight_machines', 'core_exercises');

-- AlterTable
ALTER TABLE "StrengthPlanData" ADD COLUMN     "strengthExercises" "StrengthExercises"[];
