import { getAIProvider } from "../ai/provider";

export interface GrievanceAnalysisResult {
  category: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  district: string | null;
  employer_alias: string | null;
  risk_indicators: {
    indicator_type: string;
    points: number;
    evidence_excerpt: string;
  }[];
}

export async function analyzeGrievance(text: string): Promise<GrievanceAnalysisResult> {
  const provider = getAIProvider();
  
  const prompt = `
You are an expert AI system for the ShramikSetu project, analyzing migrant worker grievances.
Analyze the following grievance text and extract structured information.

Return EXACTLY a JSON object with the following schema, and no markdown wrapping or additional text:
{
  "category": "string (e.g. WAGE_THEFT, SAFETY_VIOLATION, HARASSMENT, OTHER)",
  "severity": "LOW" | "MEDIUM" | "HIGH",
  "district": "string | null (Extract the district mentioned, else null)",
  "employer_alias": "string | null (Extract the employer/company/contractor name mentioned, else null)",
  "risk_indicators": [
    {
      "indicator_type": "string (e.g. UNPAID_WAGES, LACK_OF_SAFETY_GEAR, PHYSICAL_ABUSE)",
      "points": number (assign severity points between 10 to 50 based on severity, e.g. unpaid wages +50, no safety gear +30),
      "evidence_excerpt": "string (Quote from the text)"
    }
  ]
}

Grievance Text: "${text}"
`;

  try {
    const rawResult = await provider.generate(prompt);
    
    const jsonMatch = rawResult.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        category: parsed.category || "OTHER",
        severity: parsed.severity || "MEDIUM",
        district: parsed.district || null,
        employer_alias: parsed.employer_alias || null,
        risk_indicators: parsed.risk_indicators || [],
      };
    }
  } catch (error) {
    console.error("Failed to parse grievance analysis:", error);
  }

  // Fallback if parsing fails or provider returns empty/mock
  return {
    category: "OTHER",
    severity: "MEDIUM",
    district: null,
    employer_alias: null,
    risk_indicators: [],
  };
}
