const fs = require('fs');
const path = require('path');

const dirs = [
  'src/app/api/auth/[...nextauth]',
  'src/app/api/worker/me',
  'src/app/worker/dashboard',
  'src/app/worker/passport',
  'src/app/worker/onboarding',
  'src/app/admin/dashboard',
  'src/components/ui'
];

dirs.forEach(d => fs.mkdirSync(path.join(__dirname, d), { recursive: true }));

const files = {
  'src/app/api/auth/[...nextauth]/route.ts': `import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/db"

const handler = NextAuth({
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
          user = await prisma.user.create({ data: { email: credentials.email, name: credentials.email.split('@')[0], role: "WORKER" } });
        }
        return user;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    }
  },
  pages: { signIn: '/login' }
});

export { handler as GET, handler as POST }`,
  
  'src/app/api/worker/me/route.ts': `import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  
  const worker = await prisma.worker.findUnique({
    where: { user_id: user.id },
    include: { skills: true, employment: true }
  });
  
  return NextResponse.json({ worker });
}

export async function PUT(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  
  const body = await req.json();
  const worker = await prisma.worker.upsert({
    where: { user_id: user.id },
    update: {
      name: body.name,
      preferred_language: body.preferred_language,
      origin_state: body.origin_state,
      current_district: body.current_district,
      occupation: body.occupation,
      industry: body.industry,
      experience_months: body.experience_months
    },
    create: {
      user_id: user.id,
      name: body.name,
      preferred_language: body.preferred_language,
      origin_state: body.origin_state,
      current_district: body.current_district,
      occupation: body.occupation,
      industry: body.industry,
      experience_months: body.experience_months
    }
  });
  
  return NextResponse.json({ worker });
}`,

  'src/app/worker/dashboard/page.tsx': `import React from 'react';
import Link from 'next/link';

export default function WorkerDashboard() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Worker Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/worker/passport" className="p-6 border rounded-xl hover:shadow-md transition bg-white text-indigo-900 font-semibold text-lg flex items-center justify-center">
          Skill Passport
        </Link>
        <Link href="/worker/onboarding" className="p-6 border rounded-xl hover:shadow-md transition bg-white text-indigo-900 font-semibold text-lg flex items-center justify-center">
          Update Profile
        </Link>
      </div>
    </div>
  );
}`,

  'src/app/worker/passport/page.tsx': `'use client';
import React, { useEffect, useState } from 'react';

export default function PassportPage() {
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/worker/me')
      .then(res => res.json())
      .then(data => {
        setWorker(data.worker);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Passport...</div>;
  if (!worker) return <div className="p-8 text-center text-red-500">No profile found. Please complete onboarding.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Digital Skill Passport</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500">Name</p>
            <p className="font-medium">{worker.name || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Occupation</p>
            <p className="font-medium">{worker.occupation || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">District</p>
            <p className="font-medium">{worker.current_district || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">State of Origin</p>
            <p className="font-medium">{worker.origin_state || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}`,

  'src/app/page.tsx': `import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 space-y-8">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">ShramikSetu AI</h1>
        <p className="text-xl text-slate-600">Your Skills. Your Rights. Your Support — Wherever You Work.</p>
      </div>
      <div className="flex space-x-4">
        <Link href="/api/auth/signin" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
          Worker Login
        </Link>
        <Link href="/admin/dashboard" className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition">
          Admin Login
        </Link>
      </div>
    </main>
  );
}`
};

Object.keys(files).forEach(file => {
  fs.writeFileSync(path.join(__dirname, file), files[file]);
});

console.log('Generated base app files successfully.');
