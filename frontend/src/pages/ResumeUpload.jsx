import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaCloudUploadAlt, FaTimes, FaFilePdf, FaExternalLinkAlt } from "react-icons/fa";
import { jsPDF } from "jspdf";

export default function ResumeUpload() {
  
  const [resumeFile,    setResumeFile]    = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [uploadedResume,setUploadedResume]= useState(null);
  const [analysis,      setAnalysis]      = useState(null);
  const [analyzing,     setAnalyzing]     = useState(false);
  const [dragOver,      setDragOver]      = useState(false);
  const [pdfLoading,    setPdfLoading]    = useState(false);

  useEffect(() => { fetchResume(); }, []);

  const fetchResume = async () => {
    try {
      const res = await api.get("/upload/my-resume");
      if (!res.data.message) setUploadedResume(res.data);
    } catch (e) { console.error(e); }
  };

  const uploadResume = async () => {
    if (!resumeFile) { toast.error("Please select a resume"); return; }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", resumeFile);
      await api.post("/upload/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Resume uploaded successfully!");
      setResumeFile(null);
      fetchResume();
    } catch (e) {
      console.error(e);
      toast.error("Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  const analyzeResume = async () => {
    try {
      setAnalyzing(true);
      const res = await api.post("/resume/analyze");
      setAnalysis(res.data.analysis);
      toast.success("Resume analyzed successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Resume analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const downloadPDF = () => {
    if (!analysis) return;
    setPdfLoading(true);
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 18;
      const contentW = pageW - margin * 2;
      let y = 0;

      const addPageIfNeeded = (needed = 10) => {
        if (y + needed > pageH - 15) { doc.addPage(); y = 20; }
      };

      const writeSection = (label, color, content) => {
        addPageIfNeeded(20);
        doc.setFillColor(...color);
        doc.roundedRect(margin, y, contentW, 7, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(label, margin + 3, y + 5);
        y += 10;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(40, 40, 40);
        const lines = doc.splitTextToSize(String(content || "—"), contentW - 4);
        lines.forEach((line) => {
          addPageIfNeeded(6);
          doc.text(line, margin + 2, y);
          y += 5;
        });
        y += 5;
      };

      // ── Header band
      const atsScore = analysis.ats_score ?? 0;
      const ringRgb  = atsScore >= 75 ? [16, 185, 129] : atsScore >= 50 ? [245, 158, 11] : [239, 68, 68];
      const atsLabel = atsScore >= 75 ? "Excellent" : atsScore >= 50 ? "Good" : "Needs Work";

      doc.setFillColor(5, 46, 22);
      doc.rect(0, 0, pageW, 38, "F");

      doc.setTextColor(52, 211, 153);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("PrepForge", margin, 15);

      doc.setTextColor(209, 250, 229);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Resume Analysis Report", margin, 24);

      // ATS score circle
      doc.setFillColor(...ringRgb);
      doc.circle(pageW - margin - 16, 19, 16, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      const scoreStr = String(atsScore);
      doc.text(scoreStr, pageW - margin - 16 - doc.getTextWidth(scoreStr) / 2, 20);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("/100", pageW - margin - 16 - doc.getTextWidth("/100") / 2, 26);

      y = 48;

      // ── ATS label + filename
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Resume Analysis", margin, y);
      y += 7;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      const fileName = uploadedResume?.file_name ?? "Your Resume";
      doc.text(`File: ${fileName}  ·  ATS Score: ${atsScore}/100  ·  Rating: ${atsLabel}`, margin, y);
      y += 3;

      doc.setDrawColor(...ringRgb);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageW - margin, y);
      y += 8;

      // ── ATS Score bar
      addPageIfNeeded(20);
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("ATS Compatibility", margin, y);
      doc.text(`${atsScore}%`, pageW - margin - doc.getTextWidth(`${atsScore}%`), y);
      y += 4;
      doc.setFillColor(230, 230, 230);
      doc.roundedRect(margin, y, contentW, 5, 2, 2, "F");
      doc.setFillColor(...ringRgb);
      doc.roundedRect(margin, y, (atsScore / 100) * contentW, 5, 2, 2, "F");
      y += 10;

      // ── Sections
      writeSection("✅  Strengths",        [16, 120, 60],  analysis.strengths);
      writeSection("⚠️  Weaknesses",       [185, 28, 28],  analysis.weaknesses);
      writeSection("💻  Missing Skills",   [161, 98, 7],   analysis.missing_skills);
      writeSection("💼  Suggested Roles",  [2, 132, 199],  analysis.suggested_roles);
      writeSection("🤖  AI Feedback",      [109, 40, 217], analysis.overall_feedback);

      // ── Footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `PrepForge Resume Analysis Report  |  Page ${p} of ${totalPages}`,
          margin, pageH - 8
        );
        doc.text(
          new Date().toLocaleDateString(),
          pageW - margin - doc.getTextWidth(new Date().toLocaleDateString()),
          pageH - 8
        );
      }

      doc.save(`PrepForge_Resume_Analysis.pdf`);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") setResumeFile(file);
    else toast.error("Only PDF files are accepted");
  };

  // ── ATS score colour ─────────────────────────────────────────────────
  const atsColor = (score) => {
    if (score >= 75) return { ring: "#10b981", glow: "#10b98133", label: "Excellent" };
    if (score >= 50) return { ring: "#f59e0b", glow: "#f59e0b33", label: "Good" };
    return              { ring: "#ef4444", glow: "#ef444433", label: "Needs Work" };
  };

  const atsCfg = analysis ? atsColor(analysis.ats_score) : null;

  return (
    <div className="flex min-h-screen bg-[#050816] text-white">
      <Sidebar  />

      <div className="ml-64 flex-1 p-8">
        <Navbar title="Resume Analysis"  />

        <div className="mt-6 pb-16">

          {/* ── Page header ── */}
          <div className="mb-8">
            
            <p className="mt-1.5 text-sm text-gray-400">
              Upload your latest resume and let PrepForge AI analyze it to improve your shortlisting chances.
            </p>
          </div>

          {/* ── Main grid ── */}
          <div className="grid gap-6 lg:grid-cols-3">

            {/* ══ LEFT PANEL ══════════════════════════════════════════ */}
            <div className="space-y-5">

              {/* Upload card */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                {/* Card header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
                    <FaCloudUploadAlt className="text-xl text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Upload Resume</h2>
                    <p className="text-xs text-gray-500">PDF files only · max 5 MB</p>
                  </div>
                </div>

                {/* Drag-and-drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                    dragOver
                      ? "border-emerald-400 bg-emerald-500/10"
                      : "border-white/15 hover:border-emerald-500/40 hover:bg-white/[0.03]"
                  }`}
                >
                  <FaCloudUploadAlt className="mx-auto text-4xl text-emerald-400 mb-3" />
                  <p className="text-sm font-semibold text-white">Drag &amp; Drop your resume</p>
                  <p className="mt-1 text-xs text-gray-500">or choose a PDF below</p>
                </div>

                {/* File input */}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="mt-4 w-full cursor-pointer rounded-xl border border-white/10 bg-white/5 p-2.5 text-sm text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-500/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-emerald-300"
                />

                {/* Selected file preview */}
                {resumeFile && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                    <FaFilePdf className="shrink-0 text-emerald-400" />
                    <span className="flex-1 truncate text-sm text-gray-300">{resumeFile.name}</span>
                    <button
                      onClick={() => setResumeFile(null)}
                      className="shrink-0 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}

                {/* Upload button */}
                <button
                  onClick={uploadResume}
                  disabled={loading || !resumeFile}
                  className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Uploading…
                    </span>
                  ) : "Upload Resume"}
                </button>
              </div>

              {/* Uploaded resume card */}
              {uploadedResume && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">
                    Current Resume
                  </h3>

                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                    <FaFilePdf className="shrink-0 text-emerald-400" />
                    <span className="flex-1 truncate text-sm text-gray-300">{uploadedResume.file_name}</span>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <a
                      href={`https://docs.google.com/viewer?url=${encodeURIComponent(uploadedResume.file_url)}&embedded=true`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/10"
                    >
                      <FaExternalLinkAlt className="text-xs" /> View
                    </a>

                    <button
                      onClick={analyzeResume}
                      disabled={analyzing}
                      className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-[0_0_16px_rgba(16,185,129,0.35)] disabled:opacity-40"
                    >
                      {analyzing ? "Analyzing…" : "Analyze"}
                    </button>
                  </div>

                  {/* Analyzing spinner */}
                  {analyzing && (
                    <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
                      <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-[3px] border-emerald-500 border-t-transparent" />
                      <p className="text-sm font-semibold text-emerald-400">AI is analyzing your resume…</p>
                      <p className="mt-1 text-xs text-gray-500">This usually takes a few seconds.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ══ RIGHT PANEL ═════════════════════════════════════════ */}
            <div className="lg:col-span-2 space-y-5">

              {!analysis ? (
                /* Empty state */
                <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center p-10">
                  <p className="text-5xl mb-4"></p>
                  <p className="text-lg font-semibold text-gray-300">No analysis yet</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload your resume and click <span className="text-emerald-400 font-medium">Analyze</span> to get AI feedback.
                  </p>
                </div>
              ) : (
                <div className="overflow-y-auto pr-2 space-y-5" style={{ maxHeight: "calc(100vh - 220px)" }}>
                  {/* ATS Score card */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                    <div className="flex flex-wrap items-center gap-6">

                      {/* Score ring */}
                      <div
                        style={{
                          width: 88, height: 88, borderRadius: "50%",
                          border: `7px solid ${atsCfg.ring}`,
                          boxShadow: `0 0 24px ${atsCfg.glow}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <div className="text-center leading-tight">
                          <p className="text-2xl font-black" style={{ color: atsCfg.ring }}>
                            {analysis.ats_score}
                          </p>
                          <p className="text-[10px] text-gray-500">/100</p>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                          ATS Score
                        </p>
                        <h2 className="text-2xl font-bold text-white">Resume Analysis</h2>
                        <p className="mt-1 text-sm text-gray-400">
                          AI evaluated your resume based on ATS standards.
                        </p>
                        <span
                          className="mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-bold"
                          style={{
                            color: atsCfg.ring,
                            background: `${atsCfg.ring}22`,
                            border: `1px solid ${atsCfg.ring}44`,
                          }}
                        >
                          {atsCfg.label}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full lg:w-auto lg:flex-1">
                        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                          <span>ATS Compatibility</span>
                          <span>{analysis.ats_score}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${analysis.ats_score}%`,
                              background: `linear-gradient(to right, ${atsCfg.ring}, ${atsCfg.ring}99)`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-500/20 bg-white/[0.04] p-5">
                      <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-400">
                        ✅ Strengths
                      </h3>
                      <div className="max-h-48 overflow-y-auto whitespace-pre-line text-sm leading-7 text-gray-300 pr-1">
                        {analysis.strengths}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-red-500/20 bg-white/[0.04] p-5">
                      <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-red-400">
                        ⚠️ Weaknesses
                      </h3>
                      <div className="max-h-48 overflow-y-auto whitespace-pre-line text-sm leading-7 text-gray-300 pr-1">
                        {analysis.weaknesses}
                      </div>
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="rounded-2xl border border-amber-500/20 bg-white/[0.04] p-5">
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-amber-400">
                      💻 Missing Skills
                    </h3>
                    <div className="max-h-40 overflow-y-auto whitespace-pre-line text-sm leading-7 text-gray-300 pr-1">
                      {analysis.missing_skills}
                    </div>
                  </div>

                  {/* Suggested Roles */}
                  <div className="rounded-2xl border border-sky-500/20 bg-white/[0.04] p-5">
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-sky-400">
                      💼 Suggested Roles
                    </h3>
                    <div className="max-h-40 overflow-y-auto whitespace-pre-line text-sm leading-7 text-gray-300 pr-1">
                      {analysis.suggested_roles}
                    </div>
                  </div>

                  {/* AI Feedback */}
                  <div className="rounded-2xl border border-violet-500/20 bg-white/[0.04] p-5">
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-violet-400">
                      🤖 AI Feedback
                    </h3>
                    <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-gray-300">
                      {analysis.overall_feedback}
                    </div>
                  </div>

                  {/* ── Download PDF button */}
                  <div className="flex justify-end pt-2 pb-4">
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}