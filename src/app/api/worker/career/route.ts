import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { getCareerUpgradePathways } from '@/lib/agents/careerAgent';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const worker = await prisma.worker.findUnique({
      where: { user_id: session.user.id },
      include: { skills: true }
    });

    const pathways = await getCareerUpgradePathways(worker || {});

    return NextResponse.json({ success: true, pathways, worker });
  } catch (error) {
    console.error("Career Pathways Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
