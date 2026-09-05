import { Worker, Scheme, WorkerSkill, EmploymentSnapshot } from '@prisma/client';

export type EligibilityStatus = 'Eligible' | 'Likely' | 'Not Eligible';

export interface MatchedScheme extends Scheme {
  eligibility_status: EligibilityStatus;
  reason: string;
}

export type FullWorkerProfile = Worker & {
  skills: WorkerSkill[];
  employment: EmploymentSnapshot | null;
};

export const welfareAgent = {
  evaluateEligibility(worker: FullWorkerProfile, schemes: Scheme[]): MatchedScheme[] {
    return schemes.map((scheme) => {
      let status: EligibilityStatus = 'Not Eligible';
      let reason = '';

      switch (scheme.name) {
        case 'Shramik Basera Yojana':
          if (worker.industry === 'Construction' && worker.origin_state && worker.origin_state !== 'Gujarat') {
            status = 'Eligible';
            reason = 'You are a migrant construction worker from outside Gujarat, making you eligible for housing assistance.';
          } else if (worker.industry === 'Construction') {
            status = 'Likely';
            reason = 'You are a construction worker; eligibility depends on specific migrant criteria.';
          } else {
            status = 'Not Eligible';
            reason = 'This scheme is specifically designated for construction workers.';
          }
          break;

        case 'Manav Kalyan Yojana':
          if (['Artisan', 'Vendor', 'Self-Employed'].includes(worker.occupation || '') || worker.industry === 'Cottage') {
            status = 'Eligible';
            reason = 'Your occupation matches the small-scale/artisan criteria for toolkit assistance.';
          } else {
            status = 'Likely';
            reason = 'General marginalized workers may apply if income criteria are met.';
          }
          break;

        case 'BOCW Welfare Scheme':
          if (worker.industry === 'Construction') {
            status = 'Eligible';
            reason = 'Your profile as a construction worker makes you eligible under the BOCW act.';
          } else {
            status = 'Not Eligible';
            reason = 'This welfare board is strictly for Building and Other Construction Workers.';
          }
          break;

        case 'Dhanvantari Rath Yojana':
          if (worker.industry === 'Construction') {
            status = 'Eligible';
            reason = 'As a construction worker, you can avail free mobile medical services at your site.';
          } else {
            status = 'Not Eligible';
            reason = 'These mobile medical vans operate specifically at construction sites.';
          }
          break;

        case 'Shramik Annapurna Yojana':
          const isDailyWager = worker.employment?.pay_frequency === 'DAILY';
          if (worker.industry === 'Construction' || isDailyWager) {
            status = 'Eligible';
            reason = 'Your profile suggests you work as a daily wager or construction laborer, qualifying for subsidized meals at Kadiya Nakas.';
          } else {
            status = 'Likely';
            reason = 'You might be eligible if you seek daily work at local Kadiya Nakas.';
          }
          break;

        default:
          status = 'Likely';
          reason = 'Further verification required based on detailed guidelines.';
      }

      return {
        ...scheme,
        eligibility_status: status,
        reason,
      };
    });
  }
};
