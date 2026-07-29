import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const email = body.email?.trim().toLowerCase();
    const { password, name } = body;

    if (!email) return NextResponse.json({ error: 'email_required' }, { status: 400 });
    if (!email.includes('@')) return NextResponse.json({ error: 'email_invalid' }, { status: 400 });
    if (!password) return NextResponse.json({ error: 'password_required' }, { status: 400 });
    if (!name) return NextResponse.json({ error: 'name_required' }, { status: 400 });

    const existingUsers = await prisma.user.findMany({ where: { email }, select: { id: true }, take: 1 });
    if (existingUsers.length > 0) {
        return NextResponse.json({ error: 'existing_user' }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
        data: { email, password: hashedPassword, name, hasOnboarded: false },
    });

    await prisma.planData.create({
        data: {
            user: {
                connect: { id: user.id },
            },
        },
    });

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, hasOnboarded: false } });
}
