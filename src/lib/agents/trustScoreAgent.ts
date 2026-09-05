import prisma from '@/lib/db';

export interface ContractorTrustResult {
  score: number;
  tier: 'GOLD' | 'SILVER' | 'BRONZE' | 'RISK';
  badgeLabel: string;
  reasons: string[];
}

export async function calculateContractorTrustScore(jobPost: {
  contractorId?: string;
  salary: number;
  district: string;
  industry?: string;
  description?: string;
}): Promise<ContractorTrustResult> {
  let score = 85;
  const reasons: string[] = [];

  // Minimum Wage Check (Gujarat avg ~₹450-₹500/day)
  const minWageStandard = 450;
  if (jobPost.salary >= 600) {
    score += 10;
    reasons.push("Offers premium daily wage above Gujarat minimum standard (+10)");
  } else if (jobPost.salary >= minWageStandard) {
    score += 5;
    reasons.push("Complies with statutory minimum wage (+5)");
  } else {
    score -= 25;
    reasons.push("Salary below statutory minimum wage threshold (-25)");
  }

  // Safety & Benefits check in description
  const descLower = (jobPost.description || '').toLowerCase();
  if (descLower.includes("safety") || descLower.includes("gear") || descLower.includes("helmet")) {
    score += 5;
    reasons.push("Explicitly provides protective safety gear (+5)");
  }
  if (descLower.includes("accommodation") || descLower.includes("stay") || descLower.includes("khana") || descLower.includes("food")) {
    score += 5;
    reasons.push("Provides lodging/food allowance (+5)");
  }

  // Check for past grievances if contractor ID or email is available
  if (jobPost.contractorId) {
    const contractorUser = await prisma.user.findUnique({
      where: { id: jobPost.contractorId }
    });

    if (contractorUser && contractorUser.email) {
      const grievanceCount = await prisma.grievance.count({
        where: {
          employer_alias: {
            contains: contractorUser.name || contractorUser.email.split('@')[0]
          }
        }
      });

      if (grievanceCount > 0) {
        score -= (grievanceCount * 20);
        reasons.push(`Past reported wage/safety grievances: ${grievanceCount} (-${grievanceCount * 20})`);
      }
    }
  }

  // Clamp score between 10 and 100
  score = Math.max(10, Math.min(100, score));

  let tier: 'GOLD' | 'SILVER' | 'BRONZE' | 'RISK' = 'SILVER';
  let badgeLabel = "Verified Employer";

  if (score >= 90) {
    tier = 'GOLD';
    badgeLabel = "🌟 Gold Fair Employer (90+ Trust)";
  } else if (score >= 75) {
    tier = 'SILVER';
    badgeLabel = "Verified Fair Employer";
  } else if (score >= 60) {
    tier = 'BRONZE';
    badgeLabel = "Standard Employer";
  } else {
    tier = 'RISK';
    badgeLabel = "⚠️ Under Wage Compliance Review";
  }

  return {
    score,
    tier,
    badgeLabel,
    reasons
  };
}
