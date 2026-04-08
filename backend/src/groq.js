import Groq from "groq-sdk";
import { aiReportSchema } from "./validators.js";

const systemPrompt =
  "You are an expert startup consultant. Return only valid JSON with exactly these keys: problem, customer, market, competitor, tech_stack, risk_level, profitability_score, justification. Keep responses concise and realistic. competitor must contain exactly 3 one-line entries. tech_stack must contain 4 to 6 practical MVP technologies. risk_level must be one of Low, Medium, High. profitability_score must be an integer between 0 and 100.";

export async function generateIdeaReport({ title, description }) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY");
  }
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.3,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: JSON.stringify({ title, description }),
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI returned an empty response.");
  }

  const parsed = JSON.parse(content);
  const validationResult = aiReportSchema.safeParse(parsed);
  if (!validationResult.success) {
    throw new Error("AI response shape invalid.");
  }

  return { report: validationResult.data, raw: content };
}
