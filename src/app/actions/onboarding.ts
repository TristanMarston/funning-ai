'use server';

import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { Activity, DayOfWeek, OnboardingStep } from '@prisma/client';
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
    if (onboardingData.notes !== undefined) planData.notes = onboardingData.notes;
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

    // Hydrated client state can carry DB-managed columns (id, planDataId, createdAt, updatedAt) picked up from
    // the Prisma `include` on load — those must never be forwarded into a nested create/update payload.
    const stripDbManagedFields = (data: Record<string, any>) => {
        const { id, planDataId: _planDataId, createdAt, updatedAt, ...rest } = data;
        return rest;
    };

    if (onboardingData.runningData !== null && planData.activitiesSelected?.includes('running')) {
        const { trainingDays, ...rest } = onboardingData.runningData;
        const data = stripDbManagedFields(rest);
        planData.runningData = { upsert: { where: { planDataId }, create: data, update: data } };
    }
    if (onboardingData.cyclingData !== null && planData.activitiesSelected?.includes('cycling')) {
        const { trainingDays, ...rest } = onboardingData.cyclingData;
        const data = stripDbManagedFields(rest);
        planData.cyclingData = { upsert: { where: { planDataId }, create: data, update: data } };
    }
    if (onboardingData.strengthData !== null && planData.activitiesSelected?.includes('strength')) {
        const { trainingDays, ...rest } = onboardingData.strengthData;
        const data = stripDbManagedFields(rest);
        planData.strengthData = { upsert: { where: { planDataId }, create: data, update: data } };
    }
    if (
        onboardingData.sportsData !== null &&
        planData.activitiesSelected?.some((activity: Activity) => ['tennis', 'pickleball', 'soccer', 'volleyball', 'basketball'].includes(activity))
    ) {
        const { tennisTrainingDays, basketballTrainingDays, pickleballTrainingDays, soccerTrainingDays, volleyballTrainingDays, ...rest } = onboardingData.sportsData;
        const data = stripDbManagedFields(rest);
        planData.sportsData = { upsert: { where: { planDataId }, create: data, update: data } };
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

    const trainingDayUpdates: { where: { id: string }; data: any }[] = [];

    for (const day of daysOfWeek) {
        const dayEntries = allTrainingDays.filter((t) => t.dayOfWeek === day);
        const existingId = dbUser?.planData?.availableTrainingDays.find((d) => d.dayOfWeek === day)?.id;

        if (dayEntries.length === 0 && !existingId) continue;

        const newTrainingDay: any = { activitiesDeclared: [] as Activity[] };
        for (const activity of activities) newTrainingDay[`${activity}Minutes`] = null;
        for (const trainingDay of dayEntries) {
            newTrainingDay.activitiesDeclared.push(trainingDay.activity);
            newTrainingDay[`${trainingDay.activity}Minutes`] = trainingDay.trainingMinutes;
        }

        if (existingId) {
            trainingDayUpdates.push({ where: { id: existingId }, data: newTrainingDay });
        } else {
            await prisma.availableTrainingDay.create({ data: { planDataId, dayOfWeek: day, ...newTrainingDay } });
        }
    }

    if (trainingDayUpdates.length > 0) planData.availableTrainingDays = { update: trainingDayUpdates };

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
