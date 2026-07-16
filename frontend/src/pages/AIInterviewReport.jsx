import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { jsPDF } from "jspdf";

// ── Helpers ────────────────────────────────────────────────────────────────

function ChevronIcon({ open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      style={{
        width: "18px",
        height: "18px",
        transition: "transform 0.3s ease",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        flexShrink: 0,
      }}
    >
      <path
        fillRule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function scoreColor(score) {
  if (score >= 8) return "#10b981";
  if (score >= 5) return "#f59e0b";
  return "#ef4444";
}

const DIFFICULTY_STYLES = {
  Easy: "border-green-500/30 bg-green-500/10 text-green-400",
  Medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  Hard: "border-red-500/30 bg-red-500/10 text-red-400",
};

const TYPE_STYLES = {
  mcq: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  text: "border-blue-500/30 bg-blue-500/10 text-blue-400",
};

// ── Component ──────────────────────────────────────────────────────────────

export default function AIInterviewReport() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);
  const [openAnswer, setOpenAnswer] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/ai-interview/report/${sessionId}`);
      setReport(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to load the interview report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (index) => {
    setOpenQuestion((prev) => (prev === index ? null : index));
    setOpenAnswer(null);
  };

  const downloadPDF = () => {
    if (!report) return;
    setPdfLoading(true);

    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 18;
      const contentW = pageW - margin * 2;
      let y = 0;

      const addPageIfNeeded = (needed = 10) => {
        if (y + needed > pageH - 15) {
          doc.addPage();
          y = 20;
        }
      };

      const wrapText = (text, maxW, fontSize = 10) => {
        doc.setFontSize(fontSize);
        return doc.splitTextToSize(String(text || ""), maxW);
      };

      // ── Header band
      doc.setFillColor(5, 46, 22); // dark emerald
      doc.rect(0, 0, pageW, 38, "F");

      doc.setTextColor(52, 211, 153); // emerald-400
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("PrepForge", margin, 15);

      doc.setTextColor(209, 250, 229); // emerald-100
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("AI Interview Report", margin, 24);

      // Score circle (right side)
      const scoreColor = report.overall_score >= 8 ? [16, 185, 129] : report.overall_score >= 5 ? [245, 158, 11] : [239, 68, 68];
      doc.setFillColor(...scoreColor);
      doc.circle(pageW - margin - 14, 19, 14, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      const scoreText = String(report.overall_score);
      const tw = doc.getTextWidth(scoreText);
      doc.text(scoreText, pageW - margin - 14 - tw / 2, 20);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("/10", pageW - margin - 14 - doc.getTextWidth("/10") / 2, 25);

      y = 48;

      // ── Meta info
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text(`${report.company} — ${report.role}`, margin, y);
      y += 7;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      const metaLine = [
        report.interview_type?.replace("_", " ").toUpperCase(),
        report.experience_level,
        report.difficulty,
        `${report.duration} min`,
        `${report.answers?.length ?? 0} Questions`,
        `Status: ${report.status}`,
      ].join("  ·  ");
      doc.text(metaLine, margin, y);
      y += 3;

      // thin divider
      doc.setDrawColor(209, 250, 229);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageW - margin, y);
      y += 8;

      // ── Strengths
      addPageIfNeeded(20);
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(margin, y, contentW, 7, 2, 2, "F");
      doc.setTextColor(5, 150, 105);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("✅  Strengths", margin + 3, y + 5);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(9);
      const strengthLines = wrapText(report.strengths || "—", contentW - 4, 9);
      strengthLines.forEach((line) => {
        addPageIfNeeded(6);
        doc.text(line, margin + 2, y);
        y += 5;
      });
      y += 4;

      // ── Improvements
      addPageIfNeeded(20);
      doc.setFillColor(255, 247, 237);
      doc.roundedRect(margin, y, contentW, 7, 2, 2, "F");
      doc.setTextColor(234, 88, 12);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("⚡  Areas for Improvement", margin + 3, y + 5);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(9);
      const improvLines = wrapText(report.improvements || "—", contentW - 4, 9);
      improvLines.forEach((line) => {
        addPageIfNeeded(6);
        doc.text(line, margin + 2, y);
        y += 5;
      });
      y += 6;

      // ── Question Review heading
      addPageIfNeeded(12);
      doc.setDrawColor(209, 250, 229);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageW - margin, y);
      y += 6;
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`📝  Question Review  (${report.answers?.length})`, margin, y);
      y += 8;

      // ── Each question
      (report.answers || []).forEach((ans, idx) => {
        addPageIfNeeded(30);

        const qColor = ans.score >= 8 ? [16, 185, 129] : ans.score >= 5 ? [245, 158, 11] : [239, 68, 68];

        // Question header bar
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, y, contentW, 8, 2, 2, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(30, 30, 30);
        doc.text(`Q${idx + 1}.`, margin + 2, y + 5.5);

        const qLines = doc.splitTextToSize(ans.question, contentW - 30);
        doc.text(qLines[0], margin + 9, y + 5.5);

        // Score badge
        doc.setFillColor(...qColor);
        doc.roundedRect(pageW - margin - 18, y + 1, 18, 6, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        const scoreLabel = `${ans.score ?? "—"}/10`;
        doc.text(scoreLabel, pageW - margin - 9 - doc.getTextWidth(scoreLabel) / 2, y + 5.5);
        y += 10;

        // Rest of question if wrapped
        if (qLines.length > 1) {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);
          doc.setFontSize(9);
          qLines.slice(1).forEach((l) => {
            addPageIfNeeded(6);
            doc.text(l, margin + 9, y);
            y += 5;
          });
        }

        // Your answer
        addPageIfNeeded(8);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text("YOUR ANSWER:", margin + 2, y);
        y += 4;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(40, 40, 40);
        const ansLines = wrapText(ans.your_answer || "No answer provided.", contentW - 6, 9);
        ansLines.forEach((l) => {
          addPageIfNeeded(6);
          doc.text(l, margin + 2, y);
          y += 5;
        });

        // Ideal answer
        if (ans.ideal_answer) {
          addPageIfNeeded(8);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(124, 58, 237);
          doc.text("💡 AI RECOMMENDED ANSWER:", margin + 2, y);
          y += 4;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);
          const idealLines = wrapText(ans.ideal_answer, contentW - 6, 9);
          idealLines.forEach((l) => {
            addPageIfNeeded(6);
            doc.text(l, margin + 2, y);
            y += 5;
          });
        }

        y += 5;
        // separator
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageW - margin, y);
        y += 6;
      });

      // ── Footer on every page
      const totalPages = doc.internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `PrepForge AI Interview Report  |  Page ${p} of ${totalPages}`,
          margin,
          pageH - 8
        );
        doc.text(
          new Date().toLocaleDateString(),
          pageW - margin - doc.getTextWidth(new Date().toLocaleDateString()),
          pageH - 8
        );
      }

      doc.save(`PrepForge_Report_${report.company}_${report.role}.pdf`.replace(/\s+/g, "_"));
    } finally {
      setPdfLoading(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-white text-xl">
        Loading AI Interview Report...
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816]">
        <div className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-10 text-center">
          <p className="mb-4 text-5xl">⚠️</p>
          <h2 className="mb-2 text-2xl font-bold text-red-400">
            Report Unavailable
          </h2>
          <p className="mb-6 text-gray-400">{error}</p>
          <button
            onClick={fetchReport}
            className="rounded-xl border border-red-500/40 bg-red-500/20 px-6 py-2 text-red-300 transition-colors hover:bg-red-500/30"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const ringColor = scoreColor(report.overall_score);

  return (
    <div className="flex min-h-screen bg-[#050816] text-white">
      <Sidebar  />

      <div className="ml-64 flex-1 flex flex-col min-w-0 transition-all duration-300">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Navbar title="AI Interview Report"  />

          <div className="mt-6 space-y-6 pb-16">
            {/* ── Score Hero Card ───────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5">
              {/* Score ring */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  border: `6px solid ${ringColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: `0 0 18px ${ringColor}55`,
                }}
              >
                <div className="text-center leading-tight">
                  <p
                    className="text-2xl font-black"
                    style={{ color: ringColor }}
                  >
                    {report.overall_score}
                  </p>
                  <p className="text-[10px] text-gray-500">/10</p>
                </div>
              </div>

              {/* Title + meta */}
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-bold text-white">
                  {report.company} — {report.role}
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  {report.interview_type?.replace("_", " ").toUpperCase()} ·{" "}
                  {report.experience_level} · {report.difficulty}
                </p>
              </div>

              {/* Stat chips */}
              <div className="flex flex-wrap gap-3">
                {[
                  ["Status", report.status],
                  ["Questions", report.answers?.length ?? 0],
                  ["Duration", `${report.duration}m`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-gray-500">
                      {label}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-emerald-400">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Strengths & Improvements ──────────────────────────────── */}
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-emerald-500/20 bg-white/[0.04] p-6">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-400">
                  ✅ Strengths
                </h2>
                <div className="max-h-56 overflow-y-auto whitespace-pre-line pr-2 text-sm leading-7 text-gray-300">
                  {report.strengths || "—"}
                </div>
              </div>

              <div className="rounded-2xl border border-orange-500/20 bg-white/[0.04] p-6">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-orange-400">
                  ⚡ Areas for Improvement
                </h2>
                <div className="max-h-56 overflow-y-auto whitespace-pre-line pr-2 text-sm leading-7 text-gray-300">
                  {report.improvements || "—"}
                </div>
              </div>
            </div>

            {/* ── Question Review ────────────────────────────────────────── */}
            <div>
              <h2 className="mb-4 text-lg font-bold text-white">
                📝 Question Review
                <span className="ml-2 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-normal text-gray-400">
                  {report.answers?.length}
                </span>
              </h2>

              <div className="space-y-3">
                {report.answers.map((answer, index) => {
                  const isOpen = openQuestion === index;
                  const qScore = answer.score ?? 0;
                  const qColor = scoreColor(qScore);
                  const diffClass =
                    DIFFICULTY_STYLES[answer.difficulty] ||
                    DIFFICULTY_STYLES.Medium;
                  const typeClass =
                    TYPE_STYLES[answer.type] || TYPE_STYLES.text;

                  return (
                    <div
                      key={index}
                      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                        isOpen
                          ? "border-violet-500/30 bg-violet-500/[0.04] shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >
                      {/* ── Collapsed header ── */}
                      <button
                        onClick={() => toggleQuestion(index)}
                        className="flex w-full items-center gap-4 px-5 py-4 text-left"
                      >
                        {/* Number badge */}
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/10 text-xs font-bold text-gray-400">
                          {index + 1}
                        </span>

                        {/* Question text */}
                        <span className="flex-1 truncate text-sm font-semibold text-white">
                          {answer.question}
                        </span>

                        {/* Type + Difficulty badges */}
                        <span
                          className={`hidden shrink-0 rounded-lg border px-2 py-0.5 text-xs font-semibold sm:inline ${typeClass}`}
                        >
                          {answer.type === "mcq" ? "MCQ" : "Text"}
                        </span>
                        <span
                          className={`hidden shrink-0 rounded-lg border px-2 py-0.5 text-xs font-semibold sm:inline ${diffClass}`}
                        >
                          {answer.difficulty}
                        </span>

                        {/* Score pill */}
                        <span
                          className="shrink-0 rounded-full px-3 py-0.5 text-xs font-bold"
                          style={{
                            color: qColor,
                            background: `${qColor}22`,
                            border: `1px solid ${qColor}44`,
                          }}
                        >
                          {qScore}/10
                        </span>

                        {/* Chevron */}
                        <span style={{ color: isOpen ? "#a78bfa" : "#6b7280" }}>
                          <ChevronIcon open={isOpen} />
                        </span>
                      </button>

                      {/* ── Expanded body ── */}
                      {isOpen && (
                        <div className="animate-fadeIn space-y-5 border-t border-white/10 px-5 pb-6 pt-5">
                          {/* Question text */}
                          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                              Question
                            </p>
                            <p className="text-sm font-semibold leading-6 text-white">
                              {answer.question}
                            </p>
                            {answer.topic && (
                              <p className="mt-1 text-xs text-gray-500">
                                Topic: {answer.topic}
                              </p>
                            )}
                          </div>

                          {/* Your Answer */}
                          <div>
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                              Your Answer
                            </p>
                            <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-gray-300 whitespace-pre-line">
                              {answer.your_answer || "No answer provided."}
                            </div>
                          </div>

                          {/* MCQ correct answer */}
                          {answer.type === "mcq" && answer.correct_answer && (
                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
                              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
                                Correct Answer
                              </p>
                              <p className="text-sm font-medium text-emerald-300">
                                {answer.correct_answer}
                              </p>
                            </div>
                          )}

                          {/* Score */}
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div
                              className="rounded-xl border bg-white/[0.03] p-4"
                              style={{ borderColor: `${qColor}33` }}
                            >
                              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                                AI Score
                              </p>
                              <p
                                className="text-2xl font-bold"
                                style={{ color: qColor }}
                              >
                                {answer.score}
                                <span className="text-sm font-normal text-gray-500">
                                  /10
                                </span>
                              </p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                                Type
                              </p>
                              <p className="text-lg font-semibold capitalize text-white">
                                {answer.type === "mcq"
                                  ? "Multiple Choice"
                                  : "Written Answer"}
                              </p>
                            </div>
                          </div>

                          {/* Per-answer Strengths */}
                          {answer.strengths && (
                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                              <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                                ✅ Strengths
                              </h4>
                              <div className="whitespace-pre-line text-sm leading-7 text-gray-300">
                                {answer.strengths}
                              </div>
                            </div>
                          )}

                          {/* Per-answer Improvements */}
                          {answer.improvements && (
                            <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                              <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-orange-400">
                                ⚡ Areas for Improvement
                              </h4>
                              <div className="whitespace-pre-line text-sm leading-7 text-gray-300">
                                {answer.improvements}
                              </div>
                            </div>
                          )}

                          {/* Ideal Answer accordion */}
                          {answer.ideal_answer && (
                            <div>
                              <button
                                onClick={() =>
                                  setOpenAnswer(
                                    openAnswer === index ? null : index,
                                  )
                                }
                                className="flex w-full items-center justify-between rounded-xl border border-violet-500/20 bg-white/5 px-5 py-3 transition-all hover:border-violet-400 hover:bg-white/10"
                              >
                                <div className="text-left">
                                  <p className="text-sm font-semibold text-violet-400">
                                    💡 AI Recommended Answer
                                  </p>
                                  <p className="mt-0.5 text-xs text-gray-500">
                                    Click to{" "}
                                    {openAnswer === index ? "hide" : "view"} the
                                    model answer
                                  </p>
                                </div>
                                <span style={{ color: "#a78bfa" }}>
                                  <ChevronIcon open={openAnswer === index} />
                                </span>
                              </button>

                              {openAnswer === index && (
                                <div className="animate-fadeIn mt-2 rounded-xl border border-violet-500/20 bg-black/20 p-4">
                                  <div className="max-h-72 overflow-y-auto whitespace-pre-line pr-2 text-sm leading-7 text-gray-300">
                                    {answer.ideal_answer}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── CTA ───────────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-3 pt-4">
              <button
                onClick={() => navigate("/ai-interview")}
                className="rounded-xl border border-emerald-400/50 bg-black/60 px-6 py-3 font-semibold tracking-widest uppercase text-white
                transition-all duration-300
                hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] hover:-translate-y-0.5"
              >
                🚀 Start New AI Interview
              </button>

              {/* Download PDF */}
              <button
                onClick={downloadPDF}
                disabled={pdfLoading}
                className="flex items-center gap-2 rounded-xl border border-violet-400/50 bg-black/60 px-6 py-3 font-semibold tracking-widest uppercase text-white
                transition-all duration-300
                hover:border-violet-400 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:-translate-y-0.5
                disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {pdfLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating PDF…
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    Download PDF Report
                  </>
                )}
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-xl border border-emerald-400/50 bg-black/60 px-6 py-3 font-semibold tracking-widest uppercase text-white
                transition-all duration-300
                hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] hover:-translate-y-0.5"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
