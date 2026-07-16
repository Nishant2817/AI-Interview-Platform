import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBrain, FaFlag, FaPause, FaPlay } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AIInterviewConfig from "../components/aiInterview/AIInterviewConfig";
import AIQuestionCard from "../components/aiInterview/AIQuestionCard";
import InterviewNavigation from "../components/aiInterview/InterviewNavigation";
import InterviewTimer from "../components/aiInterview/InterviewTimer";
import ProgressBar from "../components/aiInterview/ProgressBar";
import api from "../services/api";

// Phases: "config" | "loading" | "interview" | "submitting" | "submitted"

export default function AIInterview() {
  const navigate = useNavigate();
  
  const [phase, setPhase] = useState("config");
  const [interviewMeta, setInterviewMeta] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mirror answers into a ref so handleSubmit never needs answers in its dep array
  // (prevents handleSubmit → handleTimeUp → InterviewTimer re-render on every keystroke)
  const answersRef = useRef({});
  answersRef.current = answers;

  // ─── Handlers ─────────────────────────────────────────────────────────────────

  const handleStart = async (config) => {
    setPhase("loading");
    try {
      const res = await api.post("/ai-interview/generate", {
        company: config.company,
        interview_type: config.interviewType,
        role: config.role,
        experience_level: config.experienceLevel,
        difficulty: config.difficulty,
        duration: config.duration,
        question_count: config.questionCount,
      });
      setInterviewMeta(res.data);
      setQuestions(res.data.questions);
      setAnswers({});
      setCurrentIndex(0);
      setIsPaused(false);
      setPhase("interview");
    } catch (err) {
      console.error("Failed to generate interview:", err);
      setPhase("config");
      alert("Failed to generate interview. Please check your connection and try again.");
    }
  };

  const handleAnswerChange = useCallback((questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!interviewMeta || !questions.length) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const currentAnswers = answersRef.current;

    const payload = {
      company: interviewMeta.company,
      role: interviewMeta.role,
      interview_type: interviewMeta.interview_type,
      experience_level: interviewMeta.experience_level,
      difficulty: interviewMeta.difficulty,
      duration: interviewMeta.duration,
      question_count: interviewMeta.question_count,
      answers: questions.map((q) => ({
        question_id: q.id,
        question: q.question,
        type: q.type,
        topic: q.topic || null,
        difficulty: q.difficulty,
        answer: currentAnswers[q.id] || "",
        correct_answer: q.type === "mcq" ? q.correct_answer : undefined,
      })),
    };

    try {
      const res = await api.post("/ai-interview/submit", payload);
      const { session_id, task_id } = res.data;
      navigate(`/ai-interview-processing/${session_id}`, {
        state: { task_id },
      });
    } catch (err) {
      console.error("Submit failed:", err);
      // Do NOT change phase — that would unmount the timer and reset it.
      // Just show an inline error banner so the user can retry.
      setSubmitError(
        err?.response?.data?.detail ||
          "Failed to submit. Check your connection and try again."
      );
      setIsSubmitting(false);
    }

  }, [interviewMeta, questions, navigate]);

  const handleTimeUp = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  const handleReset = () => {
    setPhase("config");
    setInterviewMeta(null);
    setQuestions([]);
    setAnswers({});
    setCurrentIndex(0);
    setIsPaused(false);
  };

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const currentQuestion = questions[currentIndex];

  // ─── Loading Screen ───────────────────────────────────────────────────────────
  if (phase === "loading") {
    return (
    <div className="flex min-h-screen bg-[#050816] text-white">
    <Sidebar/>
    <div className="ml-64 flex flex-1 items-center justify-center p-8 transition-all duration-300">
    <div className="text-center">
    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-emerald-500/30 bg-emerald-500/15">
    <FaBrain className="animate-pulse text-4xl text-emerald-400" />
    </div>
    <h2 className="mb-2 text-2xl font-bold">Generating Your Interview</h2>
    <p className="mb-8 text-gray-400">
    AI is crafting personalized questions for you…
    </p>
    <div className="flex items-center justify-center gap-2">
    {[0, 1, 2].map((i) => (
    <span
    key={i}
    className="inline-block h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500"
    style={{ animationDelay: `${i * 0.15}s` }}
    />
    ))}
    </div>
    </div>
    </div>
    </div>
    );
  }

  // ─── Submitting Screen ────────────────────────────────────────────────────────
  if (phase === "submitting") {
  return (
      <div className="flex min-h-screen bg-[#050816] text-white">
        <Sidebar  />
        <div className="ml-64 flex flex-1 items-center justify-center p-8 transition-all duration-300">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-emerald-500/30 bg-emerald-500/15">
              <svg className="h-10 w-10 animate-spin text-emerald-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold">Submitting Interview…</h2>
            <p className="text-gray-400">Saving your answers and queuing AI evaluation.</p>
          </div>
        </div>
      </div>
    );
  }


  // ─── Submitted Screen ─────────────────────────────────────────────────────────
  if (phase === "submitted") {
    const skippedCount = questions.length - answeredCount;
    return (
      <div className="flex min-h-screen bg-[#050816] text-white">
        <Sidebar  />
        <div className="ml-64 flex flex-1 items-center justify-center p-8 transition-all duration-300">
          <div className="w-full max-w-md text-center">
            {/* Trophy */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-emerald-500/30 bg-emerald-500/15 text-5xl">
              🎉
            </div>
            <h2 className="mb-2 text-3xl font-bold">Interview Submitted!</h2>
            <p className="mb-1 text-gray-400">
              You answered{" "}
              <span className="font-bold text-emerald-400">{answeredCount}</span> out
              of <span className="font-bold text-white">{questions.length}</span>{" "}
              questions.
            </p>
            {skippedCount > 0 && (
              <p className="mb-1 text-sm text-yellow-400">
                {skippedCount} question{skippedCount > 1 ? "s" : ""} skipped
              </p>
            )}
            <p className="mb-8 text-xs text-gray-600">
              Results will be available once the evaluation endpoint is connected.
            </p>

            {/* Summary card */}
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Session Details
              </p>
              <div className="space-y-2 text-sm">
                {[
                  ["Company", interviewMeta?.company],
                  ["Role", interviewMeta?.role],
                  ["Type", interviewMeta?.interview_type?.replace("_", " ").toUpperCase()],
                  ["Experience", interviewMeta?.experience_level],
                  ["Difficulty", interviewMeta?.difficulty],
                  ["Duration", `${interviewMeta?.duration} minutes`],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-200">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-xl border border-emerald-400/50 bg-black/60 py-3.5 font-semibold tracking-widest uppercase
                text-white transition-all duration-300
                hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] hover:-translate-y-0.5"
            >
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Config Screen ────────────────────────────────────────────────────────────
  if (phase === "config") {
    return (
      <div className="flex min-h-screen bg-[#050816] text-white">
        <Sidebar  />
        <div className="ml-64 flex-1 overflow-y-auto p-8">
          <AIInterviewConfig onStart={handleStart} loading={false} />
        </div>
      </div>
    );
  }

  // ─── Interview Screen ─────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-[#050816] text-white">
      <Sidebar  />

      <div className="ml-64 flex flex-1 flex-col transition-all duration-300">
        {/* ── Sticky Interview Header ─────────────────────────────────────────── */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050816]/95 px-6 py-3 backdrop-blur-md md:px-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Company / Role meta */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15">
                <FaBrain className="text-sm text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">
                  {interviewMeta?.company} — {interviewMeta?.role}
                </p>
                <p className="text-xs text-gray-400">
                  {interviewMeta?.interview_type?.replace("_", " ").toUpperCase()}{" "}
                  · {interviewMeta?.experience_level}
                </p>
              </div>
            </div>

            {/* Progress — hidden on small screens */}
            <div className="hidden w-56 md:block">
              <ProgressBar
                current={currentIndex}
                total={questions.length}
                answeredCount={answeredCount}
              />
            </div>

            {/* Timer + Controls */}
            <div className="flex items-center gap-2">
              <InterviewTimer
                totalSeconds={interviewMeta.duration * 60}
                isPaused={isPaused}
                onTimeUp={handleTimeUp}
              />

              <button
                id="pause-resume-btn"
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsPaused((p) => !p)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 disabled:opacity-40
                  ${
                    isPaused
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
              >
                {isPaused ? (
                  <FaPlay className="text-[10px]" />
                ) : (
                  <FaPause className="text-[10px]" />
                )}
                {isPaused ? "Resume" : "Pause"}
              </button>

              <button
                id="end-interview-btn"
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10
                  px-3 py-2 text-xs font-semibold text-red-400 transition-all duration-200
                  hover:border-red-500/50 hover:bg-red-500/20 disabled:opacity-40"
              >
                {isSubmitting ? (
                  <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <FaFlag className="text-[10px]" />
                )}
                {isSubmitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </div>

          {/* Mobile Progress */}
          <div className="mt-3 md:hidden">
            <ProgressBar
              current={currentIndex}
              total={questions.length}
              answeredCount={answeredCount}
            />
          </div>
        </header>

        {/* ── Submit Error Banner ──────────────────────────────────────────────── */}
        {submitError && (
          <div className="flex items-center justify-between gap-3 border-b border-red-500/20 bg-red-500/10 px-6 py-2.5">
            <p className="text-sm text-red-400">⚠️ {submitError}</p>
            <button
              type="button"
              onClick={() => setSubmitError(null)}
              className="shrink-0 text-xs text-red-400 hover:text-red-300"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ── Paused Overlay ──────────────────────────────────────────────────── */}
        {isPaused && (
          <div className="fixed inset-0 z-20 ml-64 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0b1120] p-10 text-center shadow-2xl">
              <div className="mb-4 text-6xl">⏸️</div>
              <h3 className="mb-2 text-2xl font-bold">Interview Paused</h3>
              <p className="mb-7 text-sm text-gray-400">
                Your timer is paused. Resume whenever you're ready.
              </p>
              <button
                type="button"
                onClick={() => setIsPaused(false)}
                className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white
                  transition-all duration-200 hover:bg-emerald-500"
              >
                Resume Interview
              </button>
            </div>
          </div>
        )}

        {/* ── Main Content ────────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Question Card — takes 2/3 of the grid */}
              <div className="lg:col-span-2">
                {currentQuestion && (
                  <AIQuestionCard
                    key={currentQuestion.id}
                    question={currentQuestion}
                    currentIndex={currentIndex}
                    total={questions.length}
                    answer={answers[currentQuestion.id]}
                    onAnswerChange={handleAnswerChange}
                  />
                )}
              </div>

              {/* Navigation Panel — takes 1/3 */}
              <div className="lg:col-span-1">
                <InterviewNavigation
                  currentIndex={currentIndex}
                  total={questions.length}
                  answers={answers}
                  questions={questions}
                  onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  onNext={() =>
                    setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
                  }
                  onJump={(idx) => setCurrentIndex(idx)}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
