import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { promisify } from 'util';

const execAsync = promisify(exec);

const LANGUAGE_MAP: Record<string, string> = {
  python: 'python',
  py: 'python',
  javascript: 'javascript',
  js: 'javascript',
  typescript: 'typescript',
  ts: 'typescript',
  java: 'java',
  'c++': 'c++',
  cpp: 'c++',
  c: 'c',
  go: 'go',
  rust: 'rust',
  rs: 'rust',
};

async function runWithPiston(language: string, code: string, stdin?: string) {
  const normalizedLang = LANGUAGE_MAP[language.toLowerCase()] || language.toLowerCase();
  
  const response = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: normalizedLang,
      version: '*',
      files: [{ content: code }],
      stdin: stdin || '',
    }),
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    throw new Error(`Piston API returned HTTP ${response.status}`);
  }

  const data = await response.json();
  const run = data.run || {};
  const compile = data.compile || {};

  const compileStderr = compile.stderr || '';
  const runStderr = run.stderr || '';
  const runStdout = run.stdout || '';
  const output = (compileStderr ? compileStderr + '\n' : '') + (run.output || runStdout || runStderr || '');

  return {
    output: output.trim(),
    stdout: runStdout,
    stderr: compileStderr || runStderr,
    code: compile.code !== undefined && compile.code !== 0 ? compile.code : (run.code ?? 0),
  };
}

async function runLocalCode(language: string, code: string) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codebridge-'));
  
  try {
    let filename = '';
    let compileCmd = '';
    let runCmd = '';
    const lang = language.toLowerCase();
    
    if (lang === 'python' || lang === 'py') {
      filename = 'main.py';
      runCmd = `python "${path.join(tmpDir, filename)}"`;
    } else if (lang === 'javascript' || lang === 'js') {
      filename = 'main.js';
      runCmd = `node "${path.join(tmpDir, filename)}"`;
    } else if (lang === 'java') {
      filename = 'Main.java';
      compileCmd = `javac "${path.join(tmpDir, filename)}"`;
      runCmd = `java -cp "${tmpDir}" Main`;
    } else if (lang === 'c++' || lang === 'cpp') {
      filename = 'main.cpp';
      const outputBinary = path.join(tmpDir, os.platform() === 'win32' ? 'main.exe' : 'main');
      compileCmd = `g++ "${path.join(tmpDir, filename)}" -o "${outputBinary}"`;
      runCmd = `"${outputBinary}"`;
    } else {
      throw new Error(`Language ${language} not supported locally`);
    }
    
    fs.writeFileSync(path.join(tmpDir, filename), code);
    
    if (compileCmd) {
      try {
        await execAsync(compileCmd);
      } catch (compileError: any) {
        return {
          output: compileError.stderr || compileError.stdout || 'Compilation failed',
          stderr: compileError.stderr || 'Compilation failed',
          stdout: compileError.stdout || '',
          code: compileError.code || 1,
        };
      }
    }
    
    try {
      if (lang === 'python' || lang === 'py') {
        try {
          const { stdout, stderr } = await execAsync(runCmd);
          return { output: stdout + stderr, stdout, stderr, code: 0 };
        } catch (runErr: any) {
          if (runErr.message && (runErr.message.includes('not found') || runErr.message.includes('not recognized') || runErr.code === 127)) {
            runCmd = `python3 "${path.join(tmpDir, filename)}"`;
            const { stdout, stderr } = await execAsync(runCmd);
            return { output: stdout + stderr, stdout, stderr, code: 0 };
          }
          throw runErr;
        }
      } else {
        const { stdout, stderr } = await execAsync(runCmd);
        return {
          output: stdout + stderr,
          stdout,
          stderr,
          code: 0,
        };
      }
    } catch (runError: any) {
      return {
        output: (runError.stdout || '') + (runError.stderr || runError.message || ''),
        stderr: runError.stderr || runError.message || 'Execution error',
        stdout: runError.stdout || '',
        code: runError.code || 1,
      };
    }
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {
      // ignore
    }
  }
}

export async function POST(req: Request) {
  try {
    const { language, code, stdin } = await req.json();

    if (!language || !code) {
      return NextResponse.json({ error: 'Language and code are required' }, { status: 400 });
    }

    // Attempt cloud execution via Piston first (works seamlessly on Vercel / serverless)
    try {
      const cloudResult = await runWithPiston(language, code, stdin);
      return NextResponse.json(cloudResult);
    } catch (pistonError) {
      console.warn('Piston cloud execution failed, trying local fallback:', pistonError);
      // Fallback to local execution if running on machine with installed compiler
      try {
        const localResult = await runLocalCode(language, code);
        return NextResponse.json(localResult);
      } catch (localError: any) {
        return NextResponse.json({
          error: `Execution failed: ${localError.message || 'Compiler/runtime unavailable'}`,
        }, { status: 500 });
      }
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

