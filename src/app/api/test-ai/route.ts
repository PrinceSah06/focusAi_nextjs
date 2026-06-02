import { NextResponse } from 'next/server';

// import generateContent from '@/src/lib/gemini';
import generateContent from '@/src/lib/groqAI';
import { AiResponseValidation } from "@/src/schema/task.schema";
import type { Task } from '@/src/types';


export async function GET() {
  try {
    const demoTasks: Task[] = [
      {
        id: "demo-task-1",
        userId: "demo-user",
        title: "Ram testing",
        description: "Demo task for AI schedule testing",
        priority: "HIGH",
        status: "IN_PROGRESS",
        energyRequired: 4,
        estimatedMinutes: 60,
        deadline: null,
        updatedAt: new Date().toISOString(),
      },
    ];

    const response = await generateContent(demoTasks);
    console.log('AI response --------------------------------------------', response);
    const check = AiResponseValidation.safeParse(response);

    if (!check.success) {
      throw new Error(`Failed AI validation: ${check.error.message}`);
    }


    return NextResponse.json({
      message: check.data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate content';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
