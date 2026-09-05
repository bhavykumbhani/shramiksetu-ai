import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const schemes = [
  {
    name: 'Shramik Basera Yojana',
    jurisdiction: 'Gujarat',
    description: 'Provides temporary accommodation/housing facilities for construction workers and migrant laborers at ₹5/day.',
    source: 'Government of Gujarat',
    is_demo: true,
  },
  {
    name: 'Manav Kalyan Yojana',
    jurisdiction: 'Gujarat',
    description: 'Provides financial assistance and toolkits to small-scale artisans, vendors, and marginalized workers to start their own business.',
    source: 'Cottage and Rural Industries, Gujarat',
    is_demo: true,
  },
  {
    name: 'BOCW Welfare Scheme',
    jurisdiction: 'Gujarat',
    description: 'Provides financial, educational, and medical assistance to Building and Other Construction Workers registered with the board.',
    source: 'Gujarat BOCW Board',
    is_demo: true,
  },
  {
    name: 'Dhanvantari Rath Yojana',
    jurisdiction: 'Gujarat',
    description: 'Provides free mobile medical van services directly at construction sites to ensure health check-ups and basic treatments for workers.',
    source: 'Health Department, Gujarat',
    is_demo: true,
  },
  {
    name: 'Shramik Annapurna Yojana',
    jurisdiction: 'Gujarat',
    description: 'Provides nutritious meals to construction laborers at highly subsidized rates at Kadiya Nakas (labor mandis).',
    source: 'Government of Gujarat',
    is_demo: true,
  },
];

async function main() {
  console.log('Seeding database with schemes, demo workers, grievances, and job posts...');

  // Clear existing demo schemes
  await prisma.scheme.deleteMany({
    where: { is_demo: true }
  });

  for (const scheme of schemes) {
    await prisma.scheme.create({
      data: scheme
    });
  }

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
