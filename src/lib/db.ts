import { PrismaClient } from '@prisma/client'

const getDatabaseUrl = () => {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_URL,
    process.env.SUPABASE_DATABASE_URL
  ];
  for (const cand of candidates) {
    if (cand && (cand.startsWith('postgresql://') || cand.startsWith('postgres://'))) {
      return cand;
    }
  }
  return undefined;
};

const prismaClientSingleton = () => {
  const url = getDatabaseUrl();
  return new PrismaClient(
    url ? { datasources: { db: { url } } } : undefined
  );
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
