import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await req.json();

    const grievance = await prisma.grievance.update({
      where: { grievance_id: id },
      data: { status },
      include: { worker: true }
    });

    // Optionally notify the worker if they are not anonymous
    if (grievance.worker_id && grievance.worker?.user_id) {
      await prisma.notification.create({
        data: {
          user_id: grievance.worker.user_id,
          title: `Grievance Update`,
          message: `Your grievance regarding ${grievance.category} has been marked as ${status}.`,
          type: 'GRIEVANCE_UPDATE'
        }
      });
    }

    return NextResponse.json({ success: true, grievance });
  } catch (error) {
    console.error("Grievance Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
