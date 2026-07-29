'use server';

import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { Activity, AvailableTrainingDay, DayOfWeek, OnboardingStep } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { PlanData } from '../context';

const getUserId = async () => {
    const session = await getServerSession(authOptions);
    return session?.user?.id;
};

const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const activities: Activity[] = ['running', 'cycling', 'strength', 'basketball', 'tennis', 'pickleball', 'soccer', 'volleyball'];

export async function getOnboardingData() {
    const userId = await getUserId();

    if (!userId) return { error: 'Unauthorized' };

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                hasOnboarded: true,
                onboardingStep: true,
                planData: {
                    include: {
                        runningData: true,
                        cyclingData: true,
                        strengthData: true,
                        sportsData: true,
                        availableTrainingDays: true,
                    },
                },
            },
        });

        if (!user) return { error: 'User not found' };

        return { user };
    } catch (err) {
        console.error(err);
        return { error: 'Failed to get onboarding data' };
    }
}

export async function updateOnboardingData({ onboardingStep, onboardingData, hasOnboarded }: { onboardingStep: OnboardingStep; onboardingData: PlanData; hasOnboarded: boolean }) {
    const userId = await getUserId();

    if (!userId) return { error: 'Unauthorized' };

    const dbUser = await prisma.user.findUnique({ where: { id: userId }, select: { planData: { select: { id: true, availableTrainingDays: true } } } });
    let planDataId = dbUser?.planData?.id;

    if (!planDataId) {
        const newPlanData = await prisma.planData.create({ data: { userId } });
        planDataId = newPlanData.id;
    }

    const updateData: any = { onboardingStep };
    const planData: any = {};
    if (hasOnboarded) updateData.hasOnboarded = true;

    if (onboardingData.age !== undefined) planData.age = onboardingData.age;
    if (onboardingData.sex !== undefined) planData.sex = onboardingData.sex;
    if (onboardingData.weightLbs !== undefined) planData.weightLbs = onboardingData.weightLbs;
    if (onboardingData.injuries !== undefined) planData.injuries = onboardingData.injuries;
    if (onboardingData.activities && onboardingData.activities.length > 0) planData.activitiesSelected = onboardingData.activities;

    // can replace 3 if statements below
    // for (const activity of ['running', 'cycling', 'strength']) {
    //     // @ts-ignore
    //     if (onboardingData[`${activity}Data`] !== null && planData.activitesSelected.includes(activity)) {
    //         // @ts-ignore
    //         const { trainingDays, ...rest } = onboardingData[`${activity}Data`];
    //         planData[`${activity}Data`] = { update: { where: { planDataId }, data: rest } };
    //     }
    // }

    if (onboardingData.runningData !== null && planData.activitesSelected.includes('running')) {
        const { trainingDays, ...rest } = onboardingData.runningData;
        planData.runningData = { update: { where: { planDataId }, data: rest } };
    }
    if (onboardingData.cyclingData !== null && planData.activitesSelected.includes('cycling')) {
        const { trainingDays, ...rest } = onboardingData.cyclingData;
        planData.cyclingData = { update: { where: { planDataId }, data: rest } };
    }
    if (onboardingData.strengthData !== null && planData.activitesSelected.includes('strength')) {
        const { trainingDays, ...rest } = onboardingData.strengthData;
        planData.strengthData = { update: { where: { planDataId }, data: rest } };
    }
    if (
        onboardingData.sportsData !== null &&
        planData.activitesSelected.some((activity: Activity) => ['tennis', 'pickleball', 'soccer', 'volleyball', 'basketball'].includes(activity))
    ) {
        const { tennisTrainingDays, basketballTrainingDays, pickleballTrainingDays, soccerTrainingDays, volleyballTrainingDays, ...rest } = onboardingData.sportsData;
        planData.sportsData = { update: { where: { planDataId }, data: rest } };
    }

    const allTrainingDays = [
        ...(onboardingData.runningData?.trainingDays ?? []),
        ...(onboardingData.cyclingData?.trainingDays ?? []),
        ...(onboardingData.strengthData?.trainingDays ?? []),
        ...(onboardingData.sportsData?.tennisTrainingDays ?? []),
        ...(onboardingData.sportsData?.basketballTrainingDays ?? []),
        ...(onboardingData.sportsData?.pickleballTrainingDays ?? []),
        ...(onboardingData.sportsData?.soccerTrainingDays ?? []),
        ...(onboardingData.sportsData?.volleyballTrainingDays ?? []),
    ];

    for (const day of daysOfWeek) {
        if (!allTrainingDays.some((d) => d.dayOfWeek === day)) continue;

        let availableTrainingDayId = dbUser?.planData?.availableTrainingDays.find((d) => d.dayOfWeek === day)?.id;
        if (!availableTrainingDayId) {
            const newAvailableTrainingDay = await prisma.availableTrainingDay.create({ data: { planDataId, dayOfWeek: day } });
            availableTrainingDayId = newAvailableTrainingDay.id;
        }

        const newTrainingDay: Partial<AvailableTrainingDay> = { planDataId, dayOfWeek: day, activitiesDeclared: [] };
        for (const trainingDay of allTrainingDays.filter((t) => t.dayOfWeek === day)) {
            for (const activity of activities) {
                if (trainingDay.activity === activity) {
                    newTrainingDay.activitiesDeclared?.push(activity);
                    newTrainingDay[`${activity}Minutes`] = trainingDay.trainingMinutes;
                }
            }
        }
        planData.availableTrainingDays = { update: { where: { id: availableTrainingDayId }, data: newTrainingDay } };
    }

    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { ...updateData, planData: { update: { where: { userId }, data: planData } } },
        });

        if (!user) return { error: 'User not found' };

        return { user };
    } catch (err) {
        console.error(err);
        return { error: 'Failed to set onboarding data' };
    }
}
