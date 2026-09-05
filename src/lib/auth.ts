import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        let user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) {
          const isGov = credentials.email.includes('@gujarat.gov.in');
          const isContractor = credentials.email.includes('contractor');
          const role = isGov ? "ADMIN" : (isContractor ? "CONTRACTOR" : "WORKER");
          user = await prisma.user.create({ data: { email: credentials.email, name: credentials.email.split('@')[0], role } });
        } else if (credentials.email.includes('@gujarat.gov.in') && user.role !== 'ADMIN') {
           user = await prisma.user.update({ where: { email: credentials.email }, data: { role: 'ADMIN' } });
        } else if (credentials.email.includes('contractor') && user.role !== 'CONTRACTOR') {
           user = await prisma.user.update({ where: { email: credentials.email }, data: { role: 'CONTRACTOR' } });
        }
        return user;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as any).role;
      }
      return token;
    }
  },
  pages: { signIn: '/login' },
  session: {
    strategy: "jwt"
  }
};
