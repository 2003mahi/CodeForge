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
    
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey || apiKey.includes('placeholder') || !apiKey.startsWith('AIzaSy')) {
      return NextResponse.json(
        { reply: "⚠️ Google Gemini requires an API key from Google AI Studio (starting with 'AIzaSy...'). Please configure a valid GEMINI_API_KEY in .env.local to enable live AI responses." },
        { status: 200 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are the CodeBridge AI Mentor. Your job is to help users learn algorithms, data structures, and software engineering. Be encouraging, precise, and format your code blocks correctly. Keep responses concise unless asked for a deep dive. Current context: ${JSON.stringify(context || {})}`;

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
    console.error('Mentor API error:', error);
    return NextResponse.json(
      { reply: `⚠️ AI Mentor error: ${error.message || 'Unable to contact AI service'}. Please check your API key.` },
      { status: 200 }
    );
  }
}
