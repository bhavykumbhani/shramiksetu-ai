import prisma from '@/lib/db';

export interface SOSCheckResult {
  isEmergency: boolean;
  detectedKeywords: string[];
  riskLevel: 'CRITICAL' | 'HIGH' | 'NORMAL';
  suggestedAction: string;
}

const EMERGENCY_KEYWORDS = [
  "beating", "abuse", "mar pita", "maar", "forced labor", "trapped", 
  "bandhi", "bandh", "pisa nahi", "chhin liya", "passport", "harassment",
  "physical threat", "danger", "bachao", "threatened", "violence", "lock"
];

export async function processSOSDetection(description: string, district?: string, workerId?: string): Promise<SOSCheckResult> {
  const textLower = description.toLowerCase();
  const matchedKeywords: string[] = [];

  EMERGENCY_KEYWORDS.forEach(kw => {
    if (textLower.includes(kw)) {
      matchedKeywords.push(kw);
    }
  });

  const isEmergency = matchedKeywords.length > 0;
  const riskLevel = matchedKeywords.length >= 2 ? 'CRITICAL' : isEmergency ? 'HIGH' : 'NORMAL';

  const suggestedAction = isEmergency
    ? `IMMEDIATE DISPATCH: High-priority distress signal detected in ${district || 'Gujarat District'}. Alert District Inspector & Emergency Helpline.`
    : "Standard review process.";

  if (isEmergency) {
    // Auto-create high priority Admin notification
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true }
    });

    if (admins.length > 0) {
      const sosNotifs = admins.map(a => ({
        user_id: a.id,
        title: `🚨 EMERGENCY SOS ALERT (${riskLevel})`,
        message: `High risk distress report in ${district || 'Unknown District'}: "${description.substring(0, 100)}..."`,
        type: 'ADMIN_SOS_ALERT',
        metadata: JSON.stringify({
          workerId,
          district,
          matchedKeywords,
          riskLevel
        })
      }));

      await prisma.notification.createMany({ data: sosNotifs });
    }
  }

  return {
    isEmergency,
    detectedKeywords: matchedKeywords,
    riskLevel,
    suggestedAction
  };
}
