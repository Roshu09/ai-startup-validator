import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export function Layout({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("theme-light", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link to="/" className="text-base font-semibold tracking-wide sm:text-lg">
            Startup Idea Validator
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-white ${isActive ? "text-white" : "text-slate-200"}`
              }
            >
              Submit
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `hover:text-white ${isActive ? "text-white" : "text-slate-200"}`
              }
            >
              Dashboard
            </NavLink>
            <button
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-100 hover:bg-slate-700"
            >
              {theme === "dark" ? "Light" : "Dark"} mode
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
