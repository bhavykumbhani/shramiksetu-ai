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

    // 1. Worker counts by district
    const workers = await prisma.worker.groupBy({
      by: ['current_district'],
      _count: { worker_id: true }
    });

    // 2. Grievance breakdown by category
    const grievanceStats = await prisma.grievance.groupBy({
      by: ['category'],
      _count: { grievance_id: true }
    });
    
    // 3. Risky Districts (Grievances by district)
    const riskyDistrictsRaw = await prisma.grievance.groupBy({
      by: ['district', 'severity'],
      _count: { grievance_id: true }
    });

    // 4. Wage averages by Industry (from Job Posts)
    const wagesByIndustry = await prisma.jobPost.groupBy({
      by: ['industry'],
      _avg: { salary: true },
      _count: { id: true }
    });

    const openGrievances = await prisma.grievance.count({
      where: { status: 'OPEN' }
    });

    return NextResponse.json({
      workers,
      grievanceStats,
      riskyDistricts: riskyDistrictsRaw,
      wagesByIndustry,
      totalOpenGrievances: openGrievances,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
