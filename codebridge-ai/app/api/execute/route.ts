import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
    
    // Write code to temp file
    fs.writeFileSync(path.join(tmpDir, filename), code);
    
    // Compile if needed
    if (compileCmd) {
      try {
        await execAsync(compileCmd);
      } catch (compileError: any) {
        return {
          output: compileError.stderr || compileError.stdout || 'Compilation failed',
          stderr: compileError.stderr || 'Compilation failed',
          stdout: compileError.stdout || '',
          code: compileError.code || 1
        };
      }
    }
    
    // Run code
    try {
      if (lang === 'python' || lang === 'py') {
        try {
          const { stdout, stderr } = await execAsync(runCmd);
          return { output: stdout + stderr, stdout, stderr, code: 0 };
        } catch (runErr: any) {
          // If 'python' command is not found, try 'python3'
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
          code: 0
        };
      }
    } catch (runError: any) {
      return {
        output: (runError.stdout || '') + (runError.stderr || runError.message || ''),
        stderr: runError.stderr || runError.message || 'Execution error',
        stdout: runError.stdout || '',
        code: runError.code || 1
      };
    }
  } finally {
    // Clean up tmpDir
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {
      // ignore cleanup errors
    }
  }
}

export async function POST(req: Request) {
  try {
    const { language, code } = await req.json();

    if (!language || !code) {
      return NextResponse.json({ error: 'Language and code are required' }, { status: 400 });
    }

    const result = await runLocalCode(language, code);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
