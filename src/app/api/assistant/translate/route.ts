import { NextResponse } from 'next/server';
import { translateBhasha } from '@/lib/agents/bhashaAgent';

export async function POST(req: Request) {
  try {
    const { text, targetLang, sourceLang } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const result = await translateBhasha(text, targetLang || 'gu', sourceLang || 'hi');
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Bhasha Translate API Error:", error);
    return NextResponse.json({ error: "Translation Failed" }, { status: 500 });
  }
}
