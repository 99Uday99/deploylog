import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deployment = await prisma.deployment.findUnique({
      where: { id },
    });
    if (!deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(deployment);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch deployment' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, logs } = body;

    const deployment = await prisma.deployment.update({
      where: { id },
      data: {
        status,
        logs,
        endedAt:
          status === 'success' || status === 'failed' ? new Date() : undefined,
      },
    });

    return NextResponse.json(deployment);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update deployment' },
      { status: 500 }
    );
  }
}
