import { getAIProvider } from '@/lib/ai/provider';

export interface LegalNoticeData {
  noticeNumber: string;
  issueDate: string;
  category: string;
  district: string;
  employer: string;
  severity: string;
  applicableLaws: {
    actName: string;
    section: string;
    description: string;
  }[];
  subject: string;
  noticeContent: string;
  recommendedAction: string;
  timelineDays: number;
}

export async function generateLegalNotice(grievance: {
  grievance_id: string;
  category: string;
  description: string;
  district?: string | null;
  employer_alias?: string | null;
  severity?: string | null;
  createdAt?: string | Date;
}): Promise<LegalNoticeData> {
  const provider = getAIProvider();
  
  const categoryUpper = (grievance.category || 'WAGE').toUpperCase();
  const districtStr = grievance.district || 'Gujarat State';
  const employerStr = grievance.employer_alias || 'Employer / Contractor Alias';
  
  // Deterministic Statutes Selection based on Indian Labor Law
  const applicableLaws = [];

  if (categoryUpper.includes('WAGE') || categoryUpper.includes('PAY') || categoryUpper.includes('SALARY')) {
    applicableLaws.push({
      actName: "Minimum Wages Act, 1948",
      section: "Section 12 & Section 20",
      description: "Mandates strict payment of prescribed minimum daily rates without unauthorized deductions."
    });
    applicableLaws.push({
      actName: "Payment of Wages Act, 1936",
      section: "Section 15",
      description: "Guarantees timely wage disbursement on or before the designated wage period end."
    });
  }

  if (categoryUpper.includes('SAFETY') || categoryUpper.includes('HAZARD') || categoryUpper.includes('ACCIDENT')) {
    applicableLaws.push({
      actName: "Building & Other Construction Workers (BOCW) Act, 1996",
      section: "Section 44 & 45",
      description: "Requires mandatory protective gear, safety equipment, and safe workplace environments."
    });
    applicableLaws.push({
      actName: "Factories Act, 1948",
      section: "Section 7A",
      description: "Obligates occupier to ensure safety, health, and welfare of all workers at work."
    });
  }

  if (categoryUpper.includes('MIGRANT') || categoryUpper.includes('CONTRACT')) {
    applicableLaws.push({
      actName: "Inter-State Migrant Workmen Act, 1979",
      section: "Section 13",
      description: "Guarantees displacement allowance, journey allowance, and suitable residential accommodation."
    });
  }

  // Fallback default law
  if (applicableLaws.length === 0) {
    applicableLaws.push({
      actName: "Industrial Disputes Act, 1947",
      section: "Section 2A",
      description: "Provides protection against illegal termination, unfair labor practices, and coercion."
    });
  }

  const prompt = `
Generate a formal e-Nyay Legal Notice statement for a migrant worker in Gujarat.
Grievance Category: ${grievance.category}
District: ${districtStr}
Employer: ${employerStr}
Worker Complaint Excerpt: "${grievance.description}"

Return a brief 3-sentence formal legal demand statement in Hindi & English addressing the employer regarding their statutory obligations under Gujarat Labor Laws.
`;

  let noticeText = "";
  try {
    noticeText = await provider.generate(prompt);
  } catch (e) {
    noticeText = `FORMAL NOTICE: Demand for immediate compliance regarding ${grievance.category} in ${districtStr}. The employer ${employerStr} is hereby notified to rectify all reported non-compliances within 7 working days. (अधिसूचना: ${districtStr} में न्यूनतम मजदूरी और श्रम अधिकारों का अनुपालन तुरंत सुनिश्चित करें।)`;
  }

  const randomHash = Math.floor(10000 + Math.random() * 90000);
  const noticeNumber = `ENYAY/2026/GJ/${randomHash}`;
  const issueDate = new Date(grievance.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return {
    noticeNumber,
    issueDate,
    category: grievance.category,
    district: districtStr,
    employer: employerStr,
    severity: grievance.severity || 'MEDIUM',
    applicableLaws,
    subject: `LEGAL NOTICE: Demand for Compliance under Statutory Labor Laws (${grievance.category})`,
    noticeContent: noticeText,
    recommendedAction: "Present this official e-Nyay slip to your employer or submit it to the District Labor Officer during conciliation.",
    timelineDays: 7
  };
}
