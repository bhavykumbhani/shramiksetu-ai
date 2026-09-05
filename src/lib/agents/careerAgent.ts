import { getAIProvider } from '@/lib/ai/provider';

export interface CareerUpgradeOption {
  targetRole: string;
  currentWage: number;
  projectedWage: number;
  wageIncreasePercent: number;
  recommendedCourse: string;
  trainingProvider: string;
  durationWeeks: number;
  keySkillsTaught: string[];
  districtAvailability: string;
}

export async function getCareerUpgradePathways(worker: {
  industry?: string | null;
  occupation?: string | null;
  experience_months?: number | null;
  current_district?: string | null;
  skills?: { skill_name: string }[];
}): Promise<CareerUpgradeOption[]> {
  const provider = getAIProvider();
  
  const industry = worker.industry || 'Construction';
  const district = worker.current_district || 'Surat';
  const skillsList = worker.skills?.map(s => s.skill_name).join(', ') || 'Basic Labor';

  // Rule-based fallback pathways mapped to Gujarat Govt ITI / Skill University programs
  const fallbackPathways: CareerUpgradeOption[] = [
    {
      targetRole: "Advanced RCC & Prefab Supervisor",
      currentWage: 550,
      projectedWage: 950,
      wageIncreasePercent: 72,
      recommendedCourse: "Certified RCC Structuring & Blueprint Reading",
      trainingProvider: `Govt ITI ${district} & Kaushalya Skill University`,
      durationWeeks: 4,
      keySkillsTaught: ["Blueprint Reading", "Laser Leveling", "Site Supervision"],
      districtAvailability: district
    },
    {
      targetRole: "Industrial Solar & Electrical Technician",
      currentWage: 500,
      projectedWage: 1100,
      wageIncreasePercent: 120,
      recommendedCourse: "Solar PV Rooftop Installer Certification",
      trainingProvider: `PMKVY Center, ${district} Green Energy Hub`,
      durationWeeks: 6,
      keySkillsTaught: ["Solar Inverter Setup", "Safety Wiring", "Grid Testing"],
      districtAvailability: district
    }
  ];

  try {
    const prompt = `
Worker Profile:
Industry: ${industry}
District: ${district}
Current Skills: ${skillsList}

Suggest 2 realistic career upgrade pathways for an informal worker in Gujarat to increase their daily wage. Format as JSON with fields: targetRole, currentWage, projectedWage, wageIncreasePercent, recommendedCourse, trainingProvider, durationWeeks, keySkillsTaught (array of strings).
Return ONLY JSON array.
`;
    const responseText = await provider.generate(prompt);
    // Parse JSON if valid, else return fallback
    const parsed = JSON.parse(responseText.substring(responseText.indexOf('['), responseText.lastIndexOf(']') + 1));
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    // Return structured deterministic pathways
  }

  return fallbackPathways;
}
