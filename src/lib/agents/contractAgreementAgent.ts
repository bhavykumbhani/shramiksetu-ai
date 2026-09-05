import { getAIProvider } from '@/lib/ai/provider';

export interface DigitalAgreementData {
  agreementId: string;
  issueDate: string;
  workerName: string;
  contractorName: string;
  jobTitle: string;
  district: string;
  agreedDailySalary: number;
  workingHoursPerDay: number;
  overtimeRateMultiplier: number;
  safetyProvisions: string[];
  statutoryClauses: string[];
  verificationCode: string;
  legalStatus: string;
}

export async function generateDigitalAgreement(params: {
  jobTitle: string;
  contractorName: string;
  workerName: string;
  salary: number;
  district: string;
  description?: string;
}): Promise<DigitalAgreementData> {
  const randomHash = Math.floor(100000 + Math.random() * 900000);
  const agreementId = `HAKKOSH/2026/GJ/${randomHash}`;
  const verificationCode = `VERIFIED-GJ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const safetyProvisions = [
    "Mandatory Personal Protective Equipment (Helmet, Safety Boots, Gloves)",
    "Clean Drinking Water & Sanitation Facilities at Work Site",
    "Emergency First Aid & Medical Coverage On-Site"
  ];

  if (params.description?.toLowerCase().includes("accommodation") || params.description?.toLowerCase().includes("stay")) {
    safetyProvisions.push("Safe Residential Accommodation / Lodging Provided");
  }

  const statutoryClauses = [
    `Daily Wage Lock: Mandatory payment of minimum ₹${params.salary}/day as per Section 12 of Minimum Wages Act, 1948.`,
    "Standard Working Shift: 8 Hours per day maximum. Overtime payable at 2.0x normal hourly rate.",
    "Wage Disbursement Period: Weekly on every Saturday or before the 7th of each calendar month.",
    "Protection against Retaliation: Guaranteed under Gujarat Labor Welfare Protection Code."
  ];

  return {
    agreementId,
    issueDate,
    workerName: params.workerName || "Registered Migrant Worker",
    contractorName: params.contractorName || "Verified Labor Contractor",
    jobTitle: params.jobTitle,
    district: params.district,
    agreedDailySalary: params.salary,
    workingHoursPerDay: 8,
    overtimeRateMultiplier: 2.0,
    safetyProvisions,
    statutoryClauses,
    verificationCode,
    legalStatus: "BINDING DIGITAL EMPLOYMENT AGREEMENT"
  };
}
