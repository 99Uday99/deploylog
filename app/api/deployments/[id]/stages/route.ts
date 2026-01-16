import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { name, status } = body;

  try {
    // Check if the stage already exists for this deployment
    const existingStage = await prisma.stage.findFirst({
      where: {
        deploymentId: id,
        name: name,
      },
    });

    let stage;

    if (existingStage) {
      // Update existing stage
      stage = await prisma.stage.update({
        where: { id: existingStage.id },
        data: {
          status: status,
          endedAt: ['success', 'failed'].includes(status)
            ? new Date()
            : undefined,
        },
      });
    } else {
      // Create new stage
      stage = await prisma.stage.create({
        data: {
          deploymentId: id,
          name: name,
          status: status,
          startedAt: new Date(),
          endedAt: ['success', 'failed'].includes(status)
            ? new Date()
            : undefined,
        },
      });
    }

    return NextResponse.json(stage);
  } catch (error) {
    console.error('Error updating stage:', error);
    return NextResponse.json(
      { error: 'Failed to update stage' },
      { status: 500 }
    );
  }
}
