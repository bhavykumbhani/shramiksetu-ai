import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { calculateContractorTrustScore } from '@/lib/agents/trustScoreAgent';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'CONTRACTOR') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, industry, skill, district, salary, description } = await req.json();

    if (!title || !industry || !district || !salary) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const parsedSalary = parseFloat(salary);

    // Calculate Agent 9 TrustScore
    const trustResult = await calculateContractorTrustScore({
      contractorId: session.user.id,
      salary: parsedSalary,
      district,
      industry,
      description
    });

    // Create the Job Post
    const jobPost = await prisma.jobPost.create({
      data: {
        contractorId: session.user.id,
        title,
        industry,
        skill,
        district,
        salary: parsedSalary,
        description
      }
    });

    // Find Eligible Workers
    const matchingWorkers = await prisma.worker.findMany({
      where: {
        current_district: district,
        industry: industry,
        ...(skill ? { skills: { some: { skill_name: { contains: skill } } } } : {})
      },
      select: { user_id: true }
    });

    // Bulk Create Notifications for Eligible Workers
    if (matchingWorkers.length > 0) {
      const metadata = JSON.stringify({
        jobPostId: jobPost.id,
        salary: jobPost.salary,
        location: jobPost.district,
        contractorEmail: session.user.email,
        description: jobPost.description,
        trustScore: trustResult.score,
        trustTier: trustResult.tier,
        trustBadge: trustResult.badgeLabel
      });

      const notifications = matchingWorkers.map(w => ({
        user_id: w.user_id,
        title: `Hiring Match: ${title}`,
        message: `A contractor is hiring ${skill || industry} workers in ${district}. Salary: ₹${salary}/day. (AI TrustScore: ${trustResult.score}/100)`,
        type: 'JOB_POST_MATCH',
        metadata: metadata
      }));

      await prisma.notification.createMany({ data: notifications });
    }

    return NextResponse.json({ success: true, jobPost, matchedCount: matchingWorkers.length, trustResult });
  } catch (error) {
    console.error("Create Job Post Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'CONTRACTOR') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const jobPosts = await prisma.jobPost.findMany({
      where: { contractorId: session.user.id },
      include: { 
        applications: {
          include: { 
            worker: {
              include: { user: true }
            }
          }
        } 
      },
      orderBy: { createdAt: 'desc' }
    });

    const enrichedPosts = await Promise.all(jobPosts.map(async (job) => {
      const trust = await calculateContractorTrustScore({
        contractorId: job.contractorId,
        salary: job.salary,
        district: job.district,
        industry: job.industry,
        description: job.description
      });
      return {
        ...job,
        trustScore: trust.score,
        trustTier: trust.tier,
        trustBadge: trust.badgeLabel
      };
    }));

    return NextResponse.json(enrichedPosts);
  } catch (error) {
    console.error("Fetch Job Posts Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
