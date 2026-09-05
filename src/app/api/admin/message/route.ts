import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, title, message } = await req.json();

    if (!userId || !title || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const notification = await prisma.notification.create({
      data: {
        user_id: userId,
        title: `Admin: ${title}`,
        message,
        type: 'ADMIN_MESSAGE',
      }
    });

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error("Admin Message Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
