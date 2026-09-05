import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { analyzeGrievance } from "@/lib/agents/grievanceAgent";
import { processSOSDetection } from "@/lib/agents/sosAgent";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { description, anonymous } = body;

    if (!description) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    let worker_id = null;
    if (!anonymous && session?.user?.id) {
      const worker = await prisma.worker.findUnique({
        where: { user_id: (session.user as any).id },
      });
      if (worker) {
        worker_id = worker.worker_id;
      }
    }

    // Agent Analysis
    const analysis = await analyzeGrievance(description);

    // Agent 10 Emergency SOS Detection
    const sosResult = await processSOSDetection(description, analysis.district || undefined, worker_id || undefined);
    const finalSeverity = sosResult.isEmergency ? 'HIGH' : analysis.severity;

    // Save to DB
    const grievance = await prisma.grievance.create({
      data: {
        worker_id: worker_id,
        anonymous: !!anonymous,
        description,
        category: analysis.category,
        severity: finalSeverity,
        district: analysis.district,
        employer_alias: analysis.employer_alias,
        status: "OPEN",
        indicators: {
          create: analysis.risk_indicators.map((ind) => ({
            worker_id: worker_id,
            indicator_type: ind.indicator_type,
            points: ind.points,
            evidence_excerpt: ind.evidence_excerpt,
          })),
        },
      },
      include: {
        indicators: true,
      },
    });

    return NextResponse.json({ success: true, data: grievance, sosResult }, { status: 201 });
  } catch (error: any) {
    console.error("Grievance POST Error:", error);
    return NextResponse.json({ error: "Failed to submit grievance" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const worker = await prisma.worker.findUnique({
      where: { user_id: (session.user as any).id },
    });

    if (!worker) {
      return NextResponse.json({ data: [] });
    }

    const grievances = await prisma.grievance.findMany({
      where: { worker_id: worker.worker_id },
      include: {
        indicators: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: grievances });
  } catch (error: any) {
    console.error("Grievance GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch grievances" }, { status: 500 });
  }
}
