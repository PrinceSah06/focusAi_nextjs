import type {Task} from '@/src/types/index'





export const buildSchedulePrompt=(TASKS:Task[])=>{
 let stringTask = TASKS.map((task:Task)=>{
   return `
Title: ${task.title}
Priority: ${task.priority}
Energy Required: ${task.energyRequired}
Estimated Minutes: ${task.estimatedMinutes}
`
 }).join("\n\n")
    const MasterPrompt =`You are an expert productivity coach and daily planner.

Your task is to create an optimized daily schedule based on the user's tasks.

Rules:

1. Higher priority tasks should be scheduled first.
2. Tasks with earlier deadlines should be prioritized.
3. High-energy tasks should be placed earlier in the day.
4. Include short breaks between long tasks.
5. Do not overlap tasks.
6. Return ONLY valid JSON.
7. Do not include markdown, explanations, or code blocks.

Tasks:
${stringTask}

Return this exact JSON format:

[
{
"start": "09:00",
"end": "10:30",
"taskTitle": "Task Name",
"priority": "high",
"energy": "high",
"notes": "Reason for placement"
}
]
`

return MasterPrompt
}

