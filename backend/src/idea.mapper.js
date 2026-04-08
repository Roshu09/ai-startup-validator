function toApiRiskLevel(value) {
  if (!value) return null;
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export function mapIdeaToApi(idea) {
  return {
    id: idea.id,
    title: idea.title,
    description: idea.description,
    status: idea.status.toLowerCase(),
    problem: idea.problem,
    customer: idea.customer,
    market: idea.market,
    competitor: idea.competitors ?? [],
    tech_stack: idea.techStack ?? [],
    risk_level: toApiRiskLevel(idea.riskLevel),
    profitability_score: idea.profitabilityScore,
    justification: idea.justification,
    created_at: idea.createdAt,
    updated_at: idea.updatedAt,
  };
}
