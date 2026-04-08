import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import { api } from "../lib/api";

function Section({ title, content }) {
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-2 break-words text-sm text-slate-300">{content || "Not available"}</p>
    </article>
  );
}

export function IdeaDetailPage() {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { data } = await api.get(`/ideas/${id}`);
        if (active) {
          setIdea(data);
          setLoading(false);
        }
      } catch {
        if (active) {
          setIdea(null);
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="space-y-3">
        <div className="h-24 animate-pulse rounded-xl bg-slate-800" />
        <div className="h-28 animate-pulse rounded-xl bg-slate-800" />
        <div className="h-28 animate-pulse rounded-xl bg-slate-800" />
      </section>
    );
  }
  if (!idea) return <p className="text-slate-400">Idea not found.</p>;

  const riskClass =
    idea.risk_level === "Low"
      ? "bg-emerald-500/20 text-emerald-300"
      : idea.risk_level === "Medium"
        ? "bg-amber-500/20 text-amber-300"
        : "bg-rose-500/20 text-rose-300";

  const exportPdf = () => {
    const doc = new jsPDF();
    let y = 15;
    const write = (text, spacing = 8) => {
      const lines = doc.splitTextToSize(String(text || "N/A"), 180);
      doc.text(lines, 15, y);
      y += lines.length * 6 + spacing;
    };

    doc.setFontSize(16);
    write(`Startup Idea Report: ${idea.title}`, 10);
    doc.setFontSize(12);
    write(`Description: ${idea.description}`);
    write(`Problem: ${idea.problem}`);
    write(`Customer: ${idea.customer}`);
    write(`Market: ${idea.market}`);
    write(`Competitors: ${(idea.competitor || []).join(" | ")}`);
    write(`Tech Stack: ${(idea.tech_stack || []).join(", ")}`);
    write(`Risk Level: ${idea.risk_level}`);
    write(`Profitability Score: ${idea.profitability_score}/100`);
    write(`Justification: ${idea.justification}`);
    doc.save(`idea-report-${idea.id}.pdf`);
  };

  const regenerateReport = async () => {
    setRegenerating(true);
    try {
      const { data } = await api.post(`/ideas/${id}/regenerate`);
      setIdea(data);
      toast.success("Report regenerated.");
    } catch {
      toast.error("Failed to regenerate report.");
    } finally {
      setRegenerating(false);
    }
  };

  const copySummary = async () => {
    const payload = [
      `Title: ${idea.title}`,
      `Problem: ${idea.problem || "N/A"}`,
      `Customer: ${idea.customer || "N/A"}`,
      `Market: ${idea.market || "N/A"}`,
      `Risk: ${idea.risk_level || "N/A"}`,
      `Profitability: ${idea.profitability_score ?? "N/A"}/100`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(payload);
      toast.success("Summary copied.");
    } catch {
      toast.error("Unable to copy summary.");
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="break-words text-xl font-semibold sm:text-2xl">{idea.title}</h1>
          <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row sm:items-start">
            <button
              onClick={regenerateReport}
              disabled={regenerating}
              className="w-full max-w-[220px] rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60 sm:max-w-none sm:w-auto"
            >
              {regenerating ? "Regenerating..." : "Regenerate"}
            </button>
            <button
              onClick={exportPdf}
              className="w-full max-w-[220px] rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white hover:bg-slate-600 sm:max-w-none sm:w-auto"
            >
              Export PDF
            </button>
            <button
              onClick={copySummary}
              className="w-full max-w-[220px] rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white hover:bg-slate-600 sm:max-w-none sm:w-auto"
            >
              Copy summary
            </button>
          </div>
        </div>
        <p className="mt-2 break-words text-slate-300">{idea.description}</p>
        <p className="mt-3 text-xs text-slate-400">
          Last updated: {new Date(idea.updated_at).toLocaleString()}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Section title="Problem summary" content={idea.problem} />
        <Section title="Customer persona" content={idea.customer} />
        <Section title="Market overview" content={idea.market} />
        <Section title="Justification" content={idea.justification} />
      </div>

      <article className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <h3 className="font-medium">Competitors</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
          {(idea.competitor || []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>

      <article className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <h3 className="font-medium">Suggested tech stack</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {(idea.tech_stack || []).map((item) => (
            <span key={item} className="rounded bg-slate-800 px-3 py-1 text-sm text-slate-300">
              {item}
            </span>
          ))}
        </div>
      </article>

      <div className="grid gap-3 md:grid-cols-2">
        <article className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <h3 className="font-medium">Risk level</h3>
          <p className={`mt-2 inline-flex rounded px-2 py-1 text-sm ${riskClass}`}>
            {idea.risk_level || "N/A"}
          </p>
        </article>
        <article className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <h3 className="font-medium">Profitability score</h3>
          <p className="mt-2 text-sm text-slate-300">{idea.profitability_score ?? "N/A"} / 100</p>
          <div className="mt-3 h-2 rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-indigo-500 transition-all"
              style={{ width: `${idea.profitability_score ?? 0}%` }}
            />
          </div>
        </article>
      </div>
    </section>
  );
}
