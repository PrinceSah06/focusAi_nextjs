import { z } from "zod";

export const dailySummarySchema = z.object({
  summary: z.string(),
  productivityLevel: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
  ]),
  suggestion: z.string(),
});