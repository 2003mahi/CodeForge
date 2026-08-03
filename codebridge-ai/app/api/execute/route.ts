import { NextResponse } from 'next/server';

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

const languageVersions: Record<string, string> = {
  python: '3.10.0',
  javascript: '18.15.0',
  java: '15.0.2',
  'c++': '10.2.0',
  cpp: '10.2.0' // alias
};

export async function POST(req: Request) {
  try {
    const { language, code } = await req.json();

    if (!language || !code) {
      return NextResponse.json({ error: 'Language and code are required' }, { status: 400 });
    }

    const version = languageVersions[language.toLowerCase()];
    if (!version) {
      return NextResponse.json({ error: `Language ${language} not supported` }, { status: 400 });
    }

    const payload = {
      language: language.toLowerCase() === 'c++' ? 'cpp' : language.toLowerCase(),
      version,
      files: [
        {
          name: `main.${language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'java' ? 'java' : 'cpp'}`,
          content: code,
        },
      ],
    };

    const response = await fetch(PISTON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (data.run) {
      return NextResponse.json({
        output: data.run.output,
        stderr: data.run.stderr,
        stdout: data.run.stdout,
        code: data.run.code,
      });
    } else {
      return NextResponse.json({ error: data.message || 'Execution failed' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
