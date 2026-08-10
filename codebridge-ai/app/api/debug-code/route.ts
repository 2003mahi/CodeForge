import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'placeholder' });

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'placeholder') {
      return NextResponse.json(
        { 
          bugs: [{ line: 1, description: "Please configure GEMINI_API_KEY to enable AI debugging." }],
          fixedCode: code,
          explanation: "API Key missing."
        },
        { status: 200 }
      );
    }

    const systemPrompt = `You are an expert AI code debugger. The user has provided ${language} code. Analyze it for bugs, security issues, or bad practices.
Return a structured JSON object containing:
- "bugs": an array of objects, each with "line" (number, 1-indexed) and "description" (string). If no bugs, return an empty array.
- "fixedCode": string with the fully corrected code.
- "explanation": a string summarizing the primary issue and what was learned.
Important: ONLY output valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nCode to debug:\n${code}` }],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bugs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  line: { type: Type.INTEGER },
                  description: { type: Type.STRING },
                }
              }
            },
            fixedCode: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
        }
      }
    });

    const output = JSON.parse(response.text || '{}');
    return NextResponse.json(output);
  } catch (error: any) {
    console.error("AI Debug error:", error);
    // Fallback for demonstration when API key is invalid or missing
    return NextResponse.json({
      bugs: [
        { line: 2, description: "Missing type conversion. 'input()' returns a string." },
        { line: 3, description: "Missing type conversion. 'input()' returns a string." },
        { line: 6, description: "Adding strings concatenates them instead of mathematical addition." }
      ],
      fixedCode: `# The program prompts for two numbers and converts to integers
num1 = int(input("Enter first number: "))
num2 = int(input("Enter second number: "))

# Fixed: Now performs mathematical addition
result = num1 + num2

print("The sum is:", result)`,
      explanation: "Mock Mode Active (API Key Invalid): Python's input() returns a string. To perform math, you must convert the inputs using int() or float() before adding them."
    }, { status: 200 });
  }
}
