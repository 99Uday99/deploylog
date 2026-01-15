import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const deployments = await prisma.deployment.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        return NextResponse.json(deployments);
    } catch (_error) {
        return NextResponse.json({ error: 'Failed to fetch deployments' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const deployment = await prisma.deployment.create({
            data: {
                projectName: body.projectName || 'DeployLog',
                status: body.status || 'queued',
                branch: body.branch || 'main',
                commitHash: body.commitHash || 'HEAD',
                commitMessage: body.commitMessage || 'Manual deployment',
            },
        });
        return NextResponse.json(deployment);
    } catch (_error) {
        return NextResponse.json({ error: 'Failed to create deployment' }, { status: 500 });
    }
}
