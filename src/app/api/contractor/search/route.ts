import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get('district');
  const industry = searchParams.get('industry');
  const skill = searchParams.get('skill');

  try {
    const whereClause: any = {};
    if (district) {
      whereClause.current_district = { contains: district };
    }
    if (industry) {
      whereClause.industry = { contains: industry };
    }
    
    // We want to fetch workers with their skills to display.
    let workers = await prisma.worker.findMany({
      where: whereClause,
      include: {
        skills: true,
      },
    });

    if (skill) {
      workers = workers.filter(worker => 
        worker.skills.some(s => s.skill_name.toLowerCase().includes(skill.toLowerCase()))
      );
    }

    // Map to only return necessary data
    const safeWorkers = workers.map(worker => ({
      worker_id: worker.worker_id,
      first_name: worker.name ? worker.name.split(' ')[0] : 'Unknown',
      current_district: worker.current_district,
      industry: worker.industry,
      experience_months: worker.experience_months,
      skills: worker.skills.map(s => s.skill_name)
    }));

    return NextResponse.json(safeWorkers);
  } catch (error) {
    console.error('Error fetching workers:', error);
    return NextResponse.json({ error: 'Failed to search workers' }, { status: 500 });
  }
}
