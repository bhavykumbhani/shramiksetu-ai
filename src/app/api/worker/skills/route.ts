import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { worker: { include: { skills: true } } }
    });

    if (!user || !user.worker) {
      return NextResponse.json({ error: "Worker profile not found" }, { status: 404 });
    }

    return NextResponse.json({ skills: user.worker.skills });
  } catch (error) {
    console.error("Skills GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { skill_name, experience_months, proficiency } = await req.json();

    if (!skill_name || !proficiency) {
      return NextResponse.json({ error: "Skill name and proficiency are required" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { worker: true }
    });

    if (!user || !user.worker) {
      return NextResponse.json({ error: "Worker profile not found" }, { status: 404 });
    }

    const newSkill = await db.workerSkill.create({
      data: {
        worker_id: user.worker.worker_id,
        skill_name,
        experience_months: parseInt(experience_months) || 0,
        proficiency,
        verification_status: "SELF_DECLARED"
      }
    });

    return NextResponse.json({ skill: newSkill }, { status: 201 });
  } catch (error) {
    console.error("Skills POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
