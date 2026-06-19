import { Task } from "@prisma/client";
import {z} from 'zod'


export const reprioritizeSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string(),
      newPriority: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
      ]),
      reason: z.string(),
    }),
  ),
});

export const buildReprioritizePrompt = (tasks: Task[]) => {
return `
You are an expert productivity assistant.

Your job is to analyze unfinished tasks and suggest a better priority order.

Tasks:
${JSON.stringify(tasks)}

Rules:

1. Consider deadlines first.
2. Consider task priority.
3. Consider task status.
4. Tasks with closer deadlines should be prioritized higher.
5. Tasks already completed should be ignored.
6. Return only valid JSON.
7. Do not include markdown or explanations outside JSON.

Response format:

{
"tasks": [
{
"title": "Task Title",
"newPriority": "LOW | MEDIUM | HIGH",
"reason": "Short explanation"
}
]
}
`;
};
