import { NextResponse } from 'next/server';
import { generateDigitalAgreement } from '@/lib/agents/contractAgreementAgent';

export async function POST(req: Request) {
  try {
    const { jobTitle, contractorName, workerName, salary, district, description } = await req.json();

    if (!jobTitle || !salary || !district) {
      return NextResponse.json({ error: "Missing agreement details" }, { status: 400 });
    }

    const agreement = await generateDigitalAgreement({
      jobTitle,
      contractorName,
      workerName,
      salary: parseFloat(salary),
      district,
      description
    });

    return NextResponse.json({ success: true, agreement });
  } catch (error) {
    console.error("Agreement API Error:", error);
    return NextResponse.json({ error: "Failed to generate agreement" }, { status: 500 });
  }
}
