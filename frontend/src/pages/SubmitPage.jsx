import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";

export function SubmitPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/ideas", form);
      toast.success("Idea analyzed successfully.");
      navigate(`/ideas/${data.id}`);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to analyze idea";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-xl sm:p-6">
      <h1 className="text-xl font-semibold sm:text-2xl">Validate your startup idea</h1>
      <p className="mt-2 text-sm text-slate-400">
        Enter your idea and get a structured AI-backed report.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-sm text-slate-300">Title</span>
          <input
            required
            minLength={5}
            maxLength={120}
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none ring-indigo-400 focus:ring"
            placeholder="AI-powered resume analyzer for hiring teams"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-slate-300">Description</span>
          <textarea
            required
            minLength={20}
            maxLength={5000}
            rows={7}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 outline-none ring-indigo-400 focus:ring"
            placeholder="Explain the user problem, target users, and your solution."
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {submitting ? "Analyzing..." : "Generate report"}
        </button>
      </form>
    </section>
  );
}
