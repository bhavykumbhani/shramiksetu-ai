import { NextResponse } from 'next/server';
import { generateLegalNotice } from '@/lib/agents/legalNoticeAgent';

export async function POST(req: Request) {
  try {
    const grievance = await req.json();

    if (!grievance || !grievance.grievance_id) {
      return NextResponse.json({ error: "Invalid grievance data" }, { status: 400 });
    }

    const legalNotice = await generateLegalNotice(grievance);
    return NextResponse.json({ success: true, notice: legalNotice });
  } catch (error) {
    console.error("Legal Notice Generation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
