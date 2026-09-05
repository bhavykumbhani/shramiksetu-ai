import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobPostId, notificationId } = await req.json();

    if (!jobPostId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const worker = await prisma.worker.findUnique({ where: { user_id: session.user.id } });
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

    // Check if already applied
    const existing = await prisma.jobApplication.findFirst({
      where: { jobPostId, workerId: worker.worker_id }
    });

    if (!existing) {
      await prisma.jobApplication.create({
        data: {
          jobPostId,
          workerId: worker.worker_id
        }
      });
    }

    // Mark notification as read
    if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Apply Job Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
