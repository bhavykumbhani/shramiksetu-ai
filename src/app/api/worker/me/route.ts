import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  
  const worker = await prisma.worker.findUnique({
    where: { user_id: user.id },
    include: { skills: true, employment: true }
  });
  
  return NextResponse.json({ worker });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  
  const body = await req.json();
  const worker = await prisma.worker.upsert({
    where: { user_id: user.id },
    update: {
      name: body.name,
      preferred_language: body.preferred_language,
      origin_state: body.origin_state,
      current_district: body.current_district,
      occupation: body.occupation,
      industry: body.industry,
      experience_months: body.experience_months ? parseInt(body.experience_months) : null
    },
    create: {
      user_id: user.id,
      name: body.name,
      preferred_language: body.preferred_language,
      origin_state: body.origin_state,
      current_district: body.current_district,
      occupation: body.occupation,
      industry: body.industry,
      experience_months: body.experience_months ? parseInt(body.experience_months) : null
    }
  });
  
  return NextResponse.json({ worker });
}