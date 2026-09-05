import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'CONTRACTOR') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { worker_id, title, salary, location, description } = await req.json();

    if (!worker_id || !title || !salary || !location) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Find the worker's user_id
    const worker = await prisma.worker.findUnique({
      where: { worker_id }
    });

    if (!worker) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    const metadata = JSON.stringify({
      salary,
      location,
      contractorEmail: session.user.email,
      description
    });

    const notification = await prisma.notification.create({
      data: {
        user_id: worker.user_id,
        title: `Job Offer: ${title}`,
        message: `You have received a job offer for ${title} at ${location}. Salary: ₹${salary}/day.`,
        type: 'JOB_OFFER',
        metadata: metadata
      }
    });

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error("Contractor Offer Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
