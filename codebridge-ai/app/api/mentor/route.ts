import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Note: Ensure GEMINI_API_KEY is in your environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'placeholder' });

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'placeholder') {
      return NextResponse.json(
        { reply: "⚠️ Please configure your GEMINI_API_KEY in .env.local to enable the real AI Mentor." },
        { status: 200 }
      );
    }

    const systemPrompt = `You are the CodeBridge AI Mentor. Your job is to help users learn algorithms, data structures, and software engineering. Be encouraging, precise, and format your code blocks correctly. Keep responses concise unless asked for a deep dive. Current context: ${JSON.stringify(context || {})}`;

    // Note: If streaming is required, we can use generateContentStream, but for simplicity here we await the full response.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }],
        },
      ],
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate response' }, { status: 500 });
  }
}
