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

    const workers = await prisma.worker.findMany({
      include: {
        user: { select: { name: true, email: true } },
        skills: true,
        employment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(workers);
  } catch (error) {
    console.error("Fetch Workers Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
