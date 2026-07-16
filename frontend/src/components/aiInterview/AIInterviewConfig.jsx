import { useEffect, useState } from "react";
import {
  FaBrain,
  FaBuilding,
  FaChevronDown,
  FaClock,
  FaLayerGroup,
  FaListOl,
  FaUserTie,
} from "react-icons/fa";
import api from "../../services/api";

const EXPERIENCE_LEVELS = [
  "Intern",
  "Fresher",
  "1-3 Years",
  "3-5 Years",
  "5+ Years",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const DURATIONS = [15, 30, 45, 60];
const QUESTION_COUNTS = [5, 10, 15];

const DIFFICULTY_ACTIVE = {
  Easy: "border-green-500/50 bg-green-500/15 text-green-400",
  Medium: "border-yellow-500/50 bg-yellow-500/15 text-yellow-400",
  Hard: "border-red-500/50 bg-red-500/15 text-red-400",
};

const DIFFICULTY_SUMMARY = {
  Easy: "text-green-400",
  Medium: "text-yellow-400",
  Hard: "text-red-400",
};

const INACTIVE_BTN =
  "border-white/10 bg-white/[0.04] text-gray-400 hover:bg-white/[0.08] hover:text-gray-200";

export default function AIInterviewConfig({ onStart, loading }) {
  const [companies, setCompanies] = useState([]);
  const [interviewTypes, setInterviewTypes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  const [config, setConfig] = useState({
    company: "",
    interviewType: "",
    role: "",
    experienceLevel: "Fresher",
    difficulty: "Medium",
    duration: 30,
    questionCount: 5,
  });

  const [errors, setErrors] = useState({});

  // Fetch companies & types in parallel on mount
  useEffect(() => {
    const init = async () => {
      try {
        const [cRes, tRes] = await Promise.all([
          api.get("/companies"),
          api.get("/ai-interview/interview-types"),
        ]);
        setCompanies(cRes.data);
        setInterviewTypes(tRes.data);
      } catch (err) {
        console.error("Failed to load config data:", err);
      }
    };
    init();
  }, []);

  const fetchRoles = async (type) => {
    if (!type) return;
    setRolesLoading(true);
    setRoles([]);
    try {
      const res = await api.get(`/ai-interview/roles/${type}`);
      setRoles(res.data.roles || []);
    } catch (err) {
      console.error("Failed to load roles:", err);
    } finally {
      setRolesLoading(false);
    }
  };

  const setField = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleTypeChange = (type) => {
    setConfig((prev) => ({ ...prev, interviewType: type, role: "" }));
    setErrors((prev) => ({ ...prev, interviewType: "", role: "" }));
    setRoles([]);
    if (type) fetchRoles(type);
  };

  const validate = () => {
    const e = {};
    if (!config.company) e.company = "Please select a company";
    if (!config.interviewType)
      e.interviewType = "Please select an interview type";
    if (!config.role) e.role = "Please select a role";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!loading && validate()) onStart(config);
  };

  // ─── Reusable Select Wrapper ──────────────────────────────────────────────────
  const SelectWrapper = ({ id, label, icon, error, required, children }) => (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-sm font-medium text-gray-300"
      >
        <span className="text-emerald-400">{icon}</span>
        {label}
        {required && <span className="text-red-400 text-xs">*</span>}
      </label>
      <div className="relative">
        {children}
        <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-[10px]" />
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );

  const selectClass = (hasError) =>
    `w-full appearance-none rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-white
    focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all duration-200 cursor-pointer
    disabled:cursor-not-allowed disabled:opacity-50
    ${
      hasError
        ? "border-red-500/50 focus:border-red-500/50"
        : "border-white/10 hover:border-white/20 focus:border-emerald-500/50"
    }`;

  return (
    <div className="mx-auto max-w-3xl pb-12">
      {/* Hero */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/15">
          <FaBrain className="text-3xl text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">
          Configure AI Interview
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Set up a personalized AI-powered mock interview tailored to your
          target role
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-white/10 bg-white/3 p-8 shadow-2xl">
        <div className="space-y-7">
          {/* ── Company ── */}
          <SelectWrapper
            id="company"
            label="Company"
            icon={<FaBuilding />}
            error={errors.company}
            required
          >
            <select
              id="company"
              value={config.company}
              onChange={(e) => setField("company", e.target.value)}
              className={selectClass(!!errors.company)}
            >
              <option value="" className="bg-[#111827]">
                Select Company
              </option>
              {companies.map((c) => (
                <option key={c.id} value={c.name} className="bg-[#111827]">
                  {c.name}
                </option>
              ))}
            </select>
          </SelectWrapper>

          {/* ── Type + Role — 2 col ── */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SelectWrapper
              id="interviewType"
              label="Interview Type"
              icon={<FaBrain />}
              error={errors.interviewType}
              required
            >
              <select
                id="interviewType"
                value={config.interviewType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className={selectClass(!!errors.interviewType)}
              >
                <option value="" className="bg-[#111827]">
                  Select Type
                </option>
                {interviewTypes.map((t) => (
                  <option key={t} value={t} className="bg-[#111827]">
                    {t.replace("_", " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </SelectWrapper>

            <SelectWrapper
              id="role"
              label="Role"
              icon={<FaUserTie />}
              error={errors.role}
              required
            >
              <select
                id="role"
                value={config.role}
                onChange={(e) => setField("role", e.target.value)}
                disabled={!config.interviewType || rolesLoading}
                className={selectClass(!!errors.role)}
              >
                <option value="" className="bg-[#111827]">
                  {rolesLoading
                    ? "Loading roles…"
                    : config.interviewType
                      ? "Select Role"
                      : "Select type first"}
                </option>
                {roles.map((r) => (
                  <option key={r} value={r} className="bg-[#111827]">
                    {r}
                  </option>
                ))}
              </select>
            </SelectWrapper>
          </div>

          {/* ── Experience Level ── */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <FaLayerGroup className="text-emerald-400" />
              Experience Level
            </label>
            <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
              {EXPERIENCE_LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setField("experienceLevel", lvl)}
                  className={`rounded-xl border py-2.5 text-xs font-semibold transition-all duration-200
                    ${
                      config.experienceLevel === lvl
                        ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                        : INACTIVE_BTN
                    }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* ── Difficulty ── */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <span className="text-emerald-400">⚡</span>
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setField("difficulty", d)}
                  className={`rounded-xl border py-3 text-sm font-bold transition-all duration-200
                    ${
                      config.difficulty === d
                        ? DIFFICULTY_ACTIVE[d]
                        : INACTIVE_BTN
                    }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* ── Duration ── */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <FaClock className="text-emerald-400" />
              Duration
            </label>
            <div className="grid grid-cols-4 gap-3">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setField("duration", d)}
                  className={`rounded-xl border py-3 text-sm font-semibold transition-all duration-200
                    ${
                      config.duration === d
                        ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                        : INACTIVE_BTN
                    }`}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>

          {/* ── Question Count ── */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <FaListOl className="text-emerald-400" />
              Number of Questions
            </label>
            <div className="grid grid-cols-3 gap-3">
              {QUESTION_COUNTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setField("questionCount", q)}
                  className={`rounded-xl border py-3 text-sm font-semibold transition-all duration-200
                    ${
                      config.questionCount === q
                        ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400 shadow-md shadow-emerald-500/10"
                        : INACTIVE_BTN
                    }`}
                >
                  {q} Questions
                </button>
              ))}
            </div>
          </div>

          {/* ── Summary Strip ── */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Interview Summary
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="font-medium text-gray-200">
                {config.company || <span className="text-gray-600">—</span>}
              </span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-300">
                {config.role || <span className="text-gray-600">—</span>}
              </span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-400">{config.experienceLevel}</span>
              <span className="text-gray-600">·</span>
              <span className={DIFFICULTY_SUMMARY[config.difficulty]}>
                {config.difficulty}
              </span>
              <span className="text-gray-600">·</span>
              <span className="text-emerald-400">{config.duration} min</span>
              <span className="text-gray-600">·</span>
              <span className="text-emerald-400">
                {config.questionCount} Qs
              </span>
            </div>
          </div>

          {/* ── CTA ── */}
          <button
            type="button"
            id="start-ai-interview"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl border border-emerald-400/50 bg-black/60 py-4 text-base
              font-semibold tracking-widest uppercase text-white transition-all duration-300
              hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] hover:-translate-y-0.5
              active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating AI Interview…
              </span>
            ) : (
              "🚀 Start AI Interview"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
