import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch grievances but strip PII if any. For demo, we just fetch recent ones with risk indicators.
    const grievances = await prisma.grievance.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        indicators: true
      }
    });

    return NextResponse.json({ grievances });
  } catch (error) {
    console.error("Grievances Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
