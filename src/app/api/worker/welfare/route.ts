import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { welfareAgent } from '@/lib/agents/welfareAgent';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const worker = await prisma.worker.findUnique({
      where: { user_id: session.user.id },
      include: {
        skills: true,
        employment: true,
      }
    });

    if (!worker) {
      return NextResponse.json({ error: 'Worker profile not found' }, { status: 404 });
    }

    const schemes = await prisma.scheme.findMany({
      where: { is_demo: true } // or specific criteria
    });

    const matchedSchemes = welfareAgent.evaluateEligibility(worker, schemes);

    return NextResponse.json({ data: matchedSchemes });

  } catch (error) {
    console.error('Welfare API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
