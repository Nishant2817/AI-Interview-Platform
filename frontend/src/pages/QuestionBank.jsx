import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function QuestionBank() {

  // ── State ───────────────────────────────────────────────────
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");

  // ── Fetch on mount ──────────────────────────────────────────
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await api.get("/companies");
      setCompanies(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ── Filter companies by search ──────────────────────────────
  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── Group by category ───────────────────────────────────────
  const globalCompanies  = filtered.filter((c) => c.category === "Global Product");
  const indianCompanies  = filtered.filter((c) => c.category === "Indian Product");
  const serviceCompanies = filtered.filter((c) => c.category === "Service");

  // ── Stats for hero ──────────────────────────────────────────
  const totalQuestions = companies.reduce((sum, c) => sum + (c.question_count || 0), 0);

  // ────────────────────────────────────────────────────────────
  // Reusable company card
  // ────────────────────────────────────────────────────────────
  function CompanyCard({ company, accent }) {
    const styles = {
      violet: {
        border:  "hover:border-violet-500/50 hover:shadow-[0_0_28px_rgba(139,92,246,0.2)]",
        badge:   "bg-violet-500/15 text-violet-300",
        btn:     "from-violet-600 to-blue-600",
        avatar:  "bg-violet-500/20 text-violet-400",
        dot:     "bg-violet-400",
      },
      emerald: {
        border:  "hover:border-emerald-500/50 hover:shadow-[0_0_28px_rgba(16,185,129,0.2)]",
        badge:   "bg-emerald-500/15 text-emerald-300",
        btn:     "from-emerald-600 to-teal-600",
        avatar:  "bg-emerald-500/20 text-emerald-400",
        dot:     "bg-emerald-400",
      },
      sky: {
        border:  "hover:border-sky-500/50 hover:shadow-[0_0_28px_rgba(56,189,248,0.2)]",
        badge:   "bg-sky-500/15 text-sky-300",
        btn:     "from-sky-600 to-blue-600",
        avatar:  "bg-sky-500/20 text-sky-400",
        dot:     "bg-sky-400",
      },
    };
    const s = styles[accent];

    return (
      <div
        className={`group flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${s.border}`}
      >
        {/* Top row: logo + name */}
        <div className="flex items-center gap-4">
          {company.logo ? (
            <div className="flex h-12 w-[72px] shrink-0 items-center justify-center rounded-xl bg-white p-2 transition-transform duration-300 group-hover:scale-110 overflow-hidden">
              <img
                src={`/logos/${company.logo}`}
                alt={company.name}
                className="max-h-full max-w-full object-contain"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          ) : (
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${s.avatar}`}>
              {company.name.charAt(0)}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate font-bold text-white">{company.name}</h3>
            <p className="text-xs text-gray-400">{company.company_type || "—"}</p>
          </div>
        </div>

        {/* Bottom row: questions badge + button */}
        <div className="mt-5 flex items-center justify-between gap-2">
          <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${s.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {company.question_count ?? 0} Questions
          </span>

          <Link
            to={`/company/${company.id}`}
            className={`shrink-0 rounded-lg bg-gradient-to-r ${s.btn} px-4 py-1.5 text-xs font-semibold text-white transition-all hover:scale-105`}
          >
            Let's Start →
          </Link>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────
  // Reusable section block
  // ────────────────────────────────────────────────────────────
  function CompanySection({ emoji, title, subtitle, list, accent, emptyMsg }) {
    return (
      <div className="mt-14">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white">
            {emoji} {title}
          </h2>
          <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
        </div>

        {list.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-gray-500">
            {emptyMsg}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((company) => (
              <CompanyCard key={company.id} company={company} accent={accent} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────
  return (
    <div className="pb-20 pt-6">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f1f2e] via-[#0b1120] to-[#07040f] p-10">

        {/* Glow blobs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-emerald-600/15 blur-3xl" />

        {/* Badge */}
        <span className="relative inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Company-wise Interview Practice
        </span>

        {/* Heading */}
        <h1 className="relative mt-5 text-5xl font-black leading-tight tracking-tight text-white">
          Interview{" "}
          <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
            Question Bank
          </span>
        </h1>

        <p className="relative mt-4 max-w-2xl text-lg leading-7 text-gray-400">
          Practice real interview questions from top product companies, Indian startups, and IT service firms — all in one place.
        </p>

        {/* Stats row */}
        <div className="relative mt-8 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3">
            <span className="text-2xl font-bold text-white">{companies.length}</span>
            <span className="text-sm text-gray-400">Companies</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3">
            <span className="text-2xl font-bold text-white">{totalQuestions}+</span>
            <span className="text-sm text-gray-400">Questions</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3">
            <span className="text-2xl font-bold text-white">4</span>
            <span className="text-sm text-gray-400">Categories</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mt-8">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <input
            type="text"
            placeholder="Search company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-5 text-white outline-none transition-all placeholder:text-gray-500 focus:border-violet-500 focus:bg-white/[0.07]"
          />
        </div>
      </div>

      {/* ── Company Sections ── */}

      {companies.length === 0 ? (
        <div className="mt-14 text-center text-gray-500">Loading companies...</div>
      ) : (
        <>
          <CompanySection
            emoji="🌍"
            title="Top Product Companies"
            subtitle="Practice questions from leading global tech companies."
            list={globalCompanies}
            accent="violet"
            emptyMsg="No global companies match your search."
          />

          <CompanySection
            emoji="🚀"
            title="Indian Startups & Tech Companies"
            subtitle="Practice interview questions from India's top startups and technology companies."
            list={indianCompanies}
            accent="emerald"
            emptyMsg="No Indian companies match your search."
          />

          <CompanySection
            emoji="🏢"
            title="Service-Based Companies"
            subtitle="Prepare for interviews at leading IT service and consulting firms."
            list={serviceCompanies}
            accent="sky"
            emptyMsg="No service companies match your search."
          />
        </>
      )}

    </div>
  );
}
