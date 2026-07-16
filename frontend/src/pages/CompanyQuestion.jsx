import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

// ── Difficulty config ──────────────────────────────────────────────────────
const DIFFICULTY_CONFIG = {
  Easy:   { bg: "bg-emerald-500/15", text: "text-emerald-300", dot: "bg-emerald-400" },
  Medium: { bg: "bg-amber-500/15",   text: "text-amber-300",   dot: "bg-amber-400"   },
  Hard:   { bg: "bg-rose-500/15",    text: "text-rose-300",    dot: "bg-rose-400"     },
};

const DIFFICULTY_ORDER = ["All", "Easy", "Medium", "Hard"];

// ── Company logo map ──────────────────────────────────────────────────────
const COMPANY_LOGOS = {
  Google:    "/logos/google.svg",
  Microsoft: "/logos/microsoft.svg",
  Amazon:    "/logos/amazon.svg",
  Meta:      "/logos/meta.svg",
  Adobe:     "/logos/adobe.svg",
  Apple:     "/logos/apple.svg",
  Flipkart:  "/logos/flipkart.svg",
  Zomato:    "/logos/zomato.svg",
  Swiggy:    "/logos/swiggy.svg",
  Razorpay:  "/logos/razorpay.svg",
};

const QUESTION_TYPE_NAMES = {
  1: "Technical",
  2: "HR",
  3: "Behavioral",
  4: "Non Technical",
};

export default function CompanyQuestions() {
  const { companyId, questionTypeId } = useParams();

  const [questions,         setQuestions]         = useState([]);
  const [company,           setCompany]           = useState(null);
  
  const [search,            setSearch]            = useState("");
  const [difficultyFilter,  setDifficultyFilter]  = useState("All");
  const [topicFilter,       setTopicFilter]       = useState("All");
  const [bookmarked, setBookmarked] = useState(new Set());
  const [practiceId, setPracticeId] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [loadingQuestion, setLoadingQuestion] = useState(null);
  const [showOfficialAnswer, setShowOfficialAnswer] = useState({});

  useEffect(() => {
    fetchCompany();
    fetchQuestions();
  }, [companyId, questionTypeId]);

  const fetchCompany = async () => {
    try {
      const res = await api.get(`/companies/${companyId}`);
      setCompany(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await api.get(
        `/companies/${companyId}/questions?question_type_id=${questionTypeId}`
      );
      setQuestions(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBookmark = async (questionId) => {
    try {
      const token = localStorage.getItem("access_token");
      await api.post(
        `/bookmarks/${questionId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Check current state BEFORE updating, then show exactly one toast
      const isCurrentlyBookmarked = bookmarked.has(questionId);

      setBookmarked((prev) => {
        const next = new Set(prev);
        if (next.has(questionId)) {
          next.delete(questionId);
        } else {
          next.add(questionId);
        }
        return next;
      });

      if (isCurrentlyBookmarked) {
        toast("Bookmark removed", { icon: "🔖" });
      } else {
        toast.success("Question bookmarked!");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to bookmark. Please log in.");
    }
  };
  const startPractice = (questionId) => {
    setPracticeId(questionId);

    setShowOfficialAnswer((prev) => ({
      ...prev,
      [questionId]: false,
    }));
  };

  const practiceAgain = (questionId) => {
    setEvaluations((prev) => ({
      ...prev,
      [questionId]: null,
    }));

    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: "",
    }));

    setShowOfficialAnswer((prev) => ({
      ...prev,
      [questionId]: false,
    }));

    setPracticeId(questionId);
  };

  const evaluateAnswer = async (question) => {
    const answer = userAnswers[question.id];

    if (!answer?.trim()) {
      toast.error("Please write your answer first.");
      return;
    }

    try {
      setLoadingQuestion(question.id);

      const response = await api.post("/questions/evaluate", {
        question: question.title,
        answer,
      });

      setEvaluations((prev) => ({
        ...prev,
        [question.id]: response.data,
      }));

      setShowOfficialAnswer((prev) => ({
        ...prev,
        [question.id]: true,
      }));

      toast.success("AI Evaluation Completed!");
    } catch (error) {
      console.error(error);
      toast.error("Evaluation failed.");
    } finally {
      setLoadingQuestion(null);
    }
  };

  // ── Derived data ──────────────────────────────────────────────────────
  const allTopics = ["All", ...new Set(questions.map((q) => q.topic_name).filter(Boolean))];

  const filtered = questions.filter((q) => {
    const matchSearch  = q.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff    = difficultyFilter === "All" || q.difficulty_name === difficultyFilter;
    const matchTopic   = topicFilter === "All" || q.topic_name === topicFilter;
    return matchSearch && matchDiff && matchTopic;
  });

  // ── Toggle accordion ──────────────────────────────────────────────────
  const diffCfg = (name) => DIFFICULTY_CONFIG[name] || { bg: "bg-gray-500/15", text: "text-gray-300", dot: "bg-gray-400" };

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-[#050816] text-white">
      <Sidebar  />

      <div className="ml-64 flex-1 p-8">
        <Navbar title="Practice Questions"  />

        {/* ── Hero Header ── */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f1f2e] via-[#0b1120] to-[#07040f] p-8">
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-8 h-56 w-56 rounded-full bg-emerald-600/15 blur-3xl" />

          <div className="relative flex items-center gap-6">
            {/* Logo */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3">
              {COMPANY_LOGOS[company?.name] ? (
                <img
                  src={COMPANY_LOGOS[company?.name]}
                  alt={company?.name}
                  className="h-14 w-14 object-contain"
                />
              ) : (
                <span className="text-3xl font-black text-violet-400">
                  {company?.name?.charAt(0)}
                </span>
              )}
            </div>

            {/* Info */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
                {QUESTION_TYPE_NAMES[questionTypeId]} Questions
              </span>
              <h1 className="mt-2 text-4xl font-black text-white">{company?.name}</h1>
              <div className="mt-3 flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-4 py-1.5 text-sm text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {questions.length} Questions
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-blue-500/15 px-4 py-1.5 text-sm text-blue-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  {filtered.length} Showing
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Search + Filters ── */}
        <div className="mt-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-5 text-white outline-none transition-all placeholder:text-gray-500 focus:border-violet-500 focus:bg-white/[0.07]"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty:</span>
            {DIFFICULTY_ORDER.map((d) => {
              const cfg  = d === "All" ? null : diffCfg(d);
              const active = difficultyFilter === d;
              return (
                <button
                  key={d}
                  onClick={() => setDifficultyFilter(d)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    active
                      ? d === "All"
                        ? "bg-violet-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                        : `${cfg.bg} ${cfg.text} ring-1 ring-inset ring-current`
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {cfg && <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />}
                  {d}
                </button>
              );
            })}
          </div>

          {/* Topic Filter */}
          {allTopics.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Topic:</span>
              {allTopics.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopicFilter(t)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    topicFilter === t
                      ? "bg-sky-600 text-white shadow-[0_0_12px_rgba(14,165,233,0.4)]"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Question List ── */}
        <div className="mt-8 space-y-4">
          {questions.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-gray-400">
              <p className="text-4xl mb-3">📭</p>
              No questions available. Try another topic or company.
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-gray-400">
              <p className="text-4xl mb-3">🔎</p>
              No questions match your filters.
            </div>
          ) : (
            filtered.map((q, idx) => {
              const cfg      = diffCfg(q.difficulty_name);
              const isStarred = bookmarked.has(q.id);

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border transition-all duration-300 ${
                    practiceId === q.id
                      ? "border-violet-500/30 bg-violet-500/[0.04] shadow-[0_0_24px_rgba(139,92,246,0.12)]"
                      : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  {/* ── Card Header ── */}
                  <div className="p-6">
                    {/* Top row: chips + bookmark */}
                    <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Difficulty chip */}
                        {q.difficulty_name && (
                          <span
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`}
                            />
                            {q.difficulty_name}
                          </span>
                        )}
                        {/* Topic chip */}
                        {q.topic_name && (
                          <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-medium text-violet-300">
                            {q.topic_name}
                          </span>
                        )}
                        {/* Company chip */}
                        {company?.name && (
                          <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
                            {company.name}
                          </span>
                        )}
                      </div>

                      {/* Bookmark */}
                      <button
                        onClick={() => handleBookmark(q.id)}
                        title={
                          isStarred ? "Remove bookmark" : "Bookmark question"
                        }
                        className={`text-xl transition-all duration-200 hover:scale-110 ${
                          isStarred
                            ? "text-yellow-400"
                            : "text-gray-600 hover:text-yellow-400"
                        }`}
                      >
                        {isStarred ? "⭐" : "☆"}
                      </button>
                    </div>

                    {/* Question number + title */}
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-xs font-bold text-gray-400">
                        {idx + 1}
                      </span>
                      <h2 className="text-lg font-bold leading-snug text-white">
                        {q.title}
                      </h2>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-sm leading-7 text-gray-400 pl-9">
                      {q.description}
                    </p>

                    {/* Toggle accordion */}
                    <div className="mt-6 ml-9">
                      {practiceId !== q.id ? (
                        <button
                          onClick={() => startPractice(q.id)}
                          className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 font-semibold text-black transition hover:scale-105"
                        >
                          🚀 Start Practice
                        </button>
                      ) : (
                        <>
                          {/* Close / collapse button */}
                          <button
                            onClick={() => setPracticeId(null)}
                            className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Close Practice
                          </button>
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                          <h3 className="mb-4 text-lg font-bold text-emerald-400">
                            ✍️ Your Answer
                          </h3>

                          <textarea
                            rows={8}
                            value={userAnswers[q.id] || ""}
                            onChange={(e) =>
                              setUserAnswers((prev) => ({
                                ...prev,
                                [q.id]: e.target.value,
                              }))
                            }
                            placeholder="Write your answer here..."
                            className="w-full rounded-xl border border-white/10 bg-[#111827] p-4 text-white outline-none focus:border-emerald-500"
                          />

                          <button
                            onClick={() => evaluateAnswer(q)}
                            disabled={loadingQuestion === q.id}
                            className="mt-5 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-50"
                          >
                            {loadingQuestion === q.id
                              ? "🤖 AI Evaluating..."
                              : "Submit Answer"}
                          </button>
                          {/* AI Evaluation Result */}
                          {evaluations[q.id] && (
                            <div className="mt-8 space-y-5">
                              {/* Score */}
                              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="text-xl font-bold text-emerald-400">
                                      ⭐ AI Evaluation
                                    </h3>

                                    <p className="mt-1 text-gray-400">
                                      Your answer has been evaluated
                                      successfully.
                                    </p>
                                  </div>

                                  <div className="rounded-full bg-emerald-500 px-6 py-4 text-2xl font-bold text-black">
                                    {evaluations[q.id].score}/10
                                  </div>
                                </div>
                              </div>

                              {/* Strengths */}
                              <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6">
                                <h3 className="mb-3 text-lg font-bold text-green-400">
                                  ✅ Strengths
                                </h3>

                                <div className="whitespace-pre-wrap text-gray-300 leading-7">
                                  {evaluations[q.id].strengths}
                                </div>
                              </div>

                              {/* Improvements */}
                              <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6">
                                <h3 className="mb-3 text-lg font-bold text-yellow-400">
                                  ⚡ Improvements
                                </h3>

                                <div className="whitespace-pre-wrap text-gray-300 leading-7">
                                  {evaluations[q.id].improvements}
                                </div>
                              </div>

                              {/* AI Ideal Answer */}
                              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-6">
                                <h3 className="mb-3 text-lg font-bold text-violet-400">
                                  🤖 AI Ideal Answer
                                </h3>

                                <div className="whitespace-pre-wrap text-gray-300 leading-7">
                                  {evaluations[q.id].ideal_answer}
                                </div>
                              </div>

                              {/* Official Answer */}
                              {showOfficialAnswer[q.id] && (
                                <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-6">
                                  <h3 className="mb-3 text-lg font-bold text-sky-400">
                                    📘 Official Answer
                                  </h3>

                                  <div className="whitespace-pre-wrap text-gray-300 leading-7">
                                    {q.answer}
                                  </div>
                                </div>
                              )}

                              {/* Time & Space Complexity */}
                              {(q.time_complexity || q.space_complexity) && (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                  {q.time_complexity && (
                                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-5">
                                      <p className="text-sm font-semibold text-amber-400">
                                        ⏱ Time Complexity
                                      </p>

                                      <p className="mt-2 font-mono text-lg text-white">
                                        {q.time_complexity}
                                      </p>
                                    </div>
                                  )}

                                  {q.space_complexity && (
                                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-5">
                                      <p className="text-sm font-semibold text-blue-400">
                                        📦 Space Complexity
                                      </p>

                                      <p className="mt-2 font-mono text-lg text-white">
                                        {q.space_complexity}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Interview Tips */}
                              {q.interview_tips && (
                                <div className="rounded-2xl border border-pink-500/20 bg-pink-500/10 p-6">
                                  <h3 className="mb-3 text-lg font-bold text-pink-400">
                                    🎯 Interview Tips
                                  </h3>

                                  <div className="whitespace-pre-wrap text-gray-300 leading-7">
                                    {q.interview_tips}
                                  </div>
                                </div>
                              )}

                              {/* Practice Again */}
                              <div className="flex justify-end">
                                <button
                                  onClick={() => practiceAgain(q.id)}
                                  className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 font-semibold text-white transition hover:scale-105"
                                >
                                  🔄 Practice Again
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ── Accordion Body ── */}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
