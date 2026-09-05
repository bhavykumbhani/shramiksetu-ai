import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { calculateWageFairness } from '@/lib/agents/wageAgent';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pay_amount, pay_frequency, industry, category, days_per_month } = await req.json();

    if (!pay_amount || !pay_frequency || !industry || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = calculateWageFairness(
      industry,
      category,
      "Zone I", // Defaulting to major cities for demo
      parseFloat(pay_amount),
      pay_frequency,
      parseInt(days_per_month) || 26
    );

    // Get user to save snapshot
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { worker: true }
    });

    if (user && user.worker) {
      // Upsert employment snapshot
      await db.employmentSnapshot.upsert({
        where: { worker_id: user.worker.worker_id },
        update: {
          industry,
          pay_amount: parseFloat(pay_amount),
          pay_frequency,
          days_per_month: parseInt(days_per_month) || 26
        },
        create: {
          worker_id: user.worker.worker_id,
          industry,
          pay_amount: parseFloat(pay_amount),
          pay_frequency,
          days_per_month: parseInt(days_per_month) || 26
        }
      });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Wage Check Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
