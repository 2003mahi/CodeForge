import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET() {
  const dataPath = path.join(process.cwd(), 'data', 'roadmaps.json');
  try {
    const file = await fs.promises.readFile(dataPath, 'utf-8');
    const json = JSON.parse(file);
    return NextResponse.json(json);
  } catch (err) {
    console.error('Failed to read roadmaps.json', err);
    return NextResponse.json([]);
  }
}
