import { NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai/provider';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const provider = getAIProvider();
    const reply = await provider.generate(message);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}
