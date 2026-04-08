import { z } from "zod";

export const createIdeaSchema = z.object({
  title: z.string().trim().min(5).max(120),
  description: z.string().trim().min(20).max(5000),
});

export const aiReportSchema = z.object({
  problem: z.string().min(10),
  customer: z.string().min(10),
  market: z.string().min(10),
  competitor: z.array(z.string().min(5)).length(3),
  tech_stack: z.array(z.string().min(2)).min(4).max(6),
  risk_level: z.enum(["Low", "Medium", "High"]),
  profitability_score: z.number().int().min(0).max(100),
  justification: z.string().min(10),
});
