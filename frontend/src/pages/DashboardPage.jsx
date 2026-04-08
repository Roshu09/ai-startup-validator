import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export function DashboardPage() {
  const [ideas, setIdeas] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await api.get("/ideas");
      if (active) {
        setIdeas(data);
        setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const filteredIdeas = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ideas.filter((idea) => {
      const matchesQuery =
        !q ||
        idea.title.toLowerCase().includes(q) ||
        idea.description.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || idea.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [ideas, query, statusFilter]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold sm:text-2xl">Ideas dashboard</h1>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-indigo-400 focus:ring sm:w-72"
            placeholder="Search by title or description"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm sm:w-auto"
          >
            <option value="all">All statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-16 animate-pulse rounded-lg bg-slate-800" />
          <div className="h-16 animate-pulse rounded-lg bg-slate-800" />
          <div className="h-16 animate-pulse rounded-lg bg-slate-800" />
        </div>
      ) : filteredIdeas.length === 0 ? (
        <p className="text-slate-400">No ideas found yet.</p>
      ) : (
        <div className="grid gap-3">
          {filteredIdeas.map((idea) => (
            <Link
              key={idea.id}
              to={`/ideas/${idea.id}`}
              className="rounded-lg border border-slate-800 bg-slate-900 p-4 transition hover:border-slate-600"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-medium">{idea.title}</h2>
                <span className="rounded bg-slate-800 px-2 py-1 text-xs uppercase text-slate-300">
                  {idea.status}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-400">{idea.description}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
