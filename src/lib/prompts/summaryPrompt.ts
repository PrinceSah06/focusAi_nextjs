import { Schedule, Task,DailyLog } from "@prisma/client";

export const buildSummaryPrompt = (
  tasks: Task[],
  dailyLog: DailyLog | null,
  schedule: Schedule | null
) => {
  return `
You are a productivity coach.

Analyze the user's day and generate a short summary.

Tasks:
${JSON.stringify(tasks)}

Daily Log:
${JSON.stringify(dailyLog)}

Schedule:
${JSON.stringify(schedule)}

Rules:
- Keep summary under 150 words.
- Mention completed tasks.
- Mention missed tasks.
- Mention productivity level.
- Give one improvement suggestion.
- Return plain text only.


return a json object like this
{
  "summary": "You completed 5 tasks today.",
  "productivityLevel": "HIGH",
  "suggestion": "Focus on completing high-priority tasks earlier."
}`;
};