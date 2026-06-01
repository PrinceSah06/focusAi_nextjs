import { NextResponse } from 'next/server';

// import generateContent from '@/src/lib/gemini';
import generateContent from '@/src/lib/groqAI';



export async function GET() {
  try {
    const response = await generateContent('Say hello  in three differnt language.');

    return NextResponse.json({
      message: response,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate content';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
