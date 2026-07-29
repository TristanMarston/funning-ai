-- AlterTable
ALTER TABLE "PlanData" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "RunningPlanData" ALTER COLUMN "justStarting" DROP NOT NULL;
