import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./db.js";
import { createIdeaSchema } from "./validators.js";
import { generateIdeaReport } from "./groq.js";
import { mapIdeaToApi } from "./idea.mapper.js";

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: false,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch {
    res.status(503).json({ ok: false, message: "Database unavailable" });
  }
});

app.post("/api/ideas", async (req, res) => {
  try {
    const parsed = createIdeaSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsed.error.flatten(),
      });
    }

    const { title, description } = parsed.data;

    const draft = await prisma.idea.create({
      data: { title, description, status: "PENDING" },
    });

    try {
      const { report, raw } = await generateIdeaReport({ title, description });
      const saved = await prisma.idea.update({
        where: { id: draft.id },
        data: {
          status: "COMPLETED",
          problem: report.problem,
          customer: report.customer,
          market: report.market,
          competitors: report.competitor,
          techStack: report.tech_stack,
          riskLevel: report.risk_level.toUpperCase(),
          profitabilityScore: report.profitability_score,
          justification: report.justification,
          rawAiResponse: raw,
        },
      });

      return res.status(201).json(mapIdeaToApi(saved));
    } catch (aiError) {
      await prisma.idea.update({
        where: { id: draft.id },
        data: { status: "FAILED", rawAiResponse: String(aiError.message || aiError) },
      });
      return res.status(502).json({ message: "AI generation failed" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/ideas", async (_req, res) => {
  const ideas = await prisma.idea.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(ideas.map(mapIdeaToApi));
});

app.get("/api/ideas/:id", async (req, res) => {
  const idea = await prisma.idea.findUnique({
    where: { id: req.params.id },
  });

  if (!idea) {
    return res.status(404).json({ message: "Idea not found" });
  }

  return res.json(mapIdeaToApi(idea));
});

app.post("/api/ideas/:id/regenerate", async (req, res) => {
  const idea = await prisma.idea.findUnique({ where: { id: req.params.id } });
  if (!idea) {
    return res.status(404).json({ message: "Idea not found" });
  }

  await prisma.idea.update({
    where: { id: idea.id },
    data: { status: "PENDING" },
  });

  try {
    const { report, raw } = await generateIdeaReport({
      title: idea.title,
      description: idea.description,
    });

    const updated = await prisma.idea.update({
      where: { id: idea.id },
      data: {
        status: "COMPLETED",
        problem: report.problem,
        customer: report.customer,
        market: report.market,
        competitors: report.competitor,
        techStack: report.tech_stack,
        riskLevel: report.risk_level.toUpperCase(),
        profitabilityScore: report.profitability_score,
        justification: report.justification,
        rawAiResponse: raw,
      },
    });

    return res.json(mapIdeaToApi(updated));
  } catch (aiError) {
    await prisma.idea.update({
      where: { id: idea.id },
      data: { status: "FAILED", rawAiResponse: String(aiError.message || aiError) },
    });
    return res.status(502).json({ message: "AI regeneration failed" });
  }
});

app.delete("/api/ideas/:id", async (req, res) => {
  try {
    await prisma.idea.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch {
    return res.status(404).json({ message: "Idea not found" });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API running at http://localhost:${PORT}`);
});
