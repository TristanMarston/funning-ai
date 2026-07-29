ALTER TABLE "User" ADD COLUMN     "onboardingStep" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "onboardingData" JSONB;
