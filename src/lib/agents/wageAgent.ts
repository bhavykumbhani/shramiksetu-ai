export interface WageSchedule {
  industry: string;
  category: string; // Skilled, Semi-Skilled, Unskilled
  zone: string; // Zone I (Major Cities), Zone II (Others)
  daily_minimum_inr: number;
}

// Mock Official Gujarat Minimum Wage Schedule 2024-25 (Simplified)
export const WAGE_SCHEDULE: WageSchedule[] = [
  { industry: "Construction", category: "Skilled", zone: "Zone I", daily_minimum_inr: 580 },
  { industry: "Construction", category: "Semi-Skilled", zone: "Zone I", daily_minimum_inr: 495 },
  { industry: "Construction", category: "Unskilled", zone: "Zone I", daily_minimum_inr: 483 },
  { industry: "Textiles", category: "Skilled", zone: "Zone I", daily_minimum_inr: 590 },
  { industry: "Textiles", category: "Semi-Skilled", zone: "Zone I", daily_minimum_inr: 500 },
  { industry: "Textiles", category: "Unskilled", zone: "Zone I", daily_minimum_inr: 485 },
  { industry: "Diamond", category: "Skilled", zone: "Zone I", daily_minimum_inr: 650 },
  { industry: "Diamond", category: "Semi-Skilled", zone: "Zone I", daily_minimum_inr: 550 },
  { industry: "Diamond", category: "Unskilled", zone: "Zone I", daily_minimum_inr: 500 },
  { industry: "Agriculture", category: "Skilled", zone: "Zone I", daily_minimum_inr: 450 },
  { industry: "Agriculture", category: "Semi-Skilled", zone: "Zone I", daily_minimum_inr: 400 },
  { industry: "Agriculture", category: "Unskilled", zone: "Zone I", daily_minimum_inr: 380 },
  { industry: "Manufacturing", category: "Skilled", zone: "Zone I", daily_minimum_inr: 600 },
  { industry: "Manufacturing", category: "Semi-Skilled", zone: "Zone I", daily_minimum_inr: 520 },
  { industry: "Manufacturing", category: "Unskilled", zone: "Zone I", daily_minimum_inr: 490 },
  { industry: "Hospitality", category: "Skilled", zone: "Zone I", daily_minimum_inr: 550 },
  { industry: "Hospitality", category: "Semi-Skilled", zone: "Zone I", daily_minimum_inr: 480 },
  { industry: "Hospitality", category: "Unskilled", zone: "Zone I", daily_minimum_inr: 450 },
];

export function calculateWageFairness(
  industry: string,
  category: string, // SKILLED, SEMI-SKILLED, UNSKILLED
  zone: string,
  declaredPayAmount: number,
  payFrequency: string, // DAILY, MONTHLY
  daysPerMonth: number = 26
) {
  // Find matching schedule
  const match = WAGE_SCHEDULE.find(
    w => w.industry.toLowerCase() === industry.toLowerCase() && 
         w.category.toLowerCase() === category.toLowerCase()
  );

  // If no match found, use a generic fallback average
  const officialDailyMinimum = match ? match.daily_minimum_inr : 490;

  // Normalize worker's pay to daily
  let workerDailyPay = declaredPayAmount;
  if (payFrequency.toUpperCase() === 'MONTHLY') {
    workerDailyPay = declaredPayAmount / daysPerMonth;
  }

  const discrepancy = officialDailyMinimum - workerDailyPay;
  const percentage = (workerDailyPay / officialDailyMinimum) * 100;

  let verdict = "FAIR";
  let statusColor = "green";
  
  if (percentage < 100 && percentage >= 85) {
    verdict = "UNDERPAID";
    statusColor = "orange";
  } else if (percentage < 85) {
    verdict = "SEVERE";
    statusColor = "red";
  }

  return {
    officialDailyMinimum,
    workerDailyPay: Math.round(workerDailyPay),
    discrepancy: Math.round(discrepancy),
    percentage: Math.round(percentage),
    verdict,
    statusColor,
    isFair: verdict === "FAIR"
  };
}
