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

    const { notification_id } = await req.json();

    if (!notification_id) {
       // Mark all as read
       await prisma.notification.updateMany({
         where: { user_id: session.user.id, isRead: false },
         data: { isRead: true }
       });
       return NextResponse.json({ success: true });
    }

    const notification = await prisma.notification.update({
      where: { id: notification_id, user_id: session.user.id },
      data: { isRead: true }
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Notifications POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
