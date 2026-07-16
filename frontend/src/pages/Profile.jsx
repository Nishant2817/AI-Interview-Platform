import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "./../components/Sidebar";
import { FaBars } from "react-icons/fa";
import toast from "react-hot-toast";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// ── Company logo helpers ──────────────────────────────────────────────────────
const CompanyLogo = ({ company }) => {
  const logos = {
    Google: (
      <svg viewBox="0 0 48 48" width="28" height="28">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
    ),
    Microsoft: (
      <svg viewBox="0 0 23 23" width="28" height="28">
        <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
        <rect x="12" y="1" width="10" height="10" fill="#7FBA00"/>
        <rect x="1" y="12" width="10" height="10" fill="#00A4EF"/>
        <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
      </svg>
    ),
    Amazon: (
      <svg viewBox="0 0 48 48" width="28" height="28">
        <path fill="#FF9900" d="M13.9 34.3c-9.5-7 -11.8-20.4-4.8-29.9 7-9.5 20.4-11.8 29.9-4.8 5.7 4.2 8.9 10.6 8.9 17.4H44C44 10.1 39.7 3.2 32.9 0L31.5 2.8C22.9-1.7 12.2 1.9 7.7 10.5c-4.5 8.6-1.6 19 6.5 24.3"/>
        <path fill="#FF9900" d="M40.2 33.1c-3.5 2.4-7.4 3.9-11.5 4.4l0.3 2c4.5-0.5 8.8-2.1 12.7-4.8"/>
        <path fill="#FF9900" d="M12 39.5c3.9 2.7 8.4 4.2 13 4.5l0.1-2c-4.2-0.3-8.3-1.6-11.8-4.1"/>
        <path fill="#FF9900" d="M6 35.5l-1.5 1.4c1.2 1.3 2.5 2.5 3.9 3.6l1.3-1.6c-1.3-1-2.5-2.1-3.7-3.4"/>
        <text x="8" y="30" fill="#FF9900" fontSize="18" fontWeight="bold">a</text>
      </svg>
    ),
  };

  return logos[company] || (
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      background: "linear-gradient(135deg, #7c3aed, #2563eb)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "white", fontSize: 12, fontWeight: 700
    }}>
      {company.charAt(0)}
    </div>
  );
};

// ── Icon components ───────────────────────────────────────────────────────────
const PersonIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
  </svg>
);
const BriefcaseIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
);
const CodeIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
  </svg>
);
const DocumentIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);
const RocketIcon = () => (
  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
  </svg>
);

// ── Interview type tag icons ───────────────────────────────────────────────────
const TagIcon = ({ type }) => {
  const icons = {
    DSA: <CodeIcon />,
    "System Design": <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path strokeLinecap="round" d="M8 21h8M12 17v4"/></svg>,
    Behavioral: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
    "HR Round": <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
    DBMS: <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path strokeLinecap="round" d="M21 5v14c0 1.657-4.03 3-9 3S3 20.657 3 19V5"/><path strokeLinecap="round" d="M21 12c0 1.657-4.03 3-9 3s-9-1.343-9-3"/></svg>,
  };
  return icons[type] || <CodeIcon />;
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
    background: "#0d0f1e",
    color: "#fff",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  main: {
    flex: 1,
    overflowY: "auto",
    padding: "32px 36px",
    background: "#0d0f1e",
  },
  // ── Header
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  pageTitle: { fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" },
  pageSubtitle: { fontSize: 13, color: "#9ca3af", marginTop: 4 },
  editProfileBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 18px",
    border: "1px solid rgba(139,92,246,0.5)",
    borderRadius: 10,
    background: "transparent",
    color: "#a78bfa",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  // ── Hero card
  heroCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#13152a",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "28px 32px",
    marginBottom: 28,
  },
  heroLeft: { display: "flex", alignItems: "center", gap: 20 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    fontWeight: 700,
    color: "#fff",
    flexShrink: 0,
  },
  heroName: { fontSize: 22, fontWeight: 700, margin: 0, marginBottom: 4 },
  heroEmail: { fontSize: 13, color: "#9ca3af", margin: 0, marginBottom: 8 },
  heroJoined: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9ca3af" },
  heroRight: { display: "flex", alignItems: "center", gap: 32 },
  progressSection: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  progressLabel: { fontSize: 13, color: "#9ca3af", marginBottom: 12 },
  completionText: { fontSize: 13, color: "#9ca3af", maxWidth: 180, textAlign: "center", lineHeight: 1.5 },
  completionEmoji: { fontSize: 13, fontWeight: 600, color: "#c4b5fd", marginBottom: 4 },
  // ── Section title
  sectionTitle: { fontSize: 15, fontWeight: 700, color: "#f3f4f6", margin: "0 0 16px 0" },
  // ── Overview cards
  overviewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
    marginBottom: 24,
  },
  overviewCard: {
    background: "#13152a",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "16px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  overviewCardLeft: { display: "flex", alignItems: "center", gap: 12 },
  overviewIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "rgba(99,102,241,0.15)",
    color: "#818cf8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  overviewCardName: { fontSize: 13, fontWeight: 600, color: "#e5e7eb", marginBottom: 2 },
  overviewCardStatus: { fontSize: 12, color: "#22c55e", fontWeight: 500 },
  // ── Info section card
  infoCard: {
    background: "#13152a",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "24px 28px",
    marginBottom: 20,
  },
  infoCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  infoCardTitle: {
    display: "flex", alignItems: "center", gap: 10,
    fontSize: 15, fontWeight: 700, color: "#f3f4f6", margin: 0,
  },
  infoCardTitleIcon: { color: "#818cf8" },
  smallEditBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 14px",
    border: "1px solid rgba(139,92,246,0.4)",
    borderRadius: 8,
    background: "transparent",
    color: "#a78bfa",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  infoRow: {
    display: "grid",
    gridTemplateColumns: "160px 1fr",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  infoLabel: { fontSize: 13, color: "#6b7280" },
  infoValue: { fontSize: 13, color: "#f3f4f6", fontWeight: 500 },
  // ── Two column grid
  twoColGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginBottom: 24,
  },
  // ── Company logos row
  companyRow: { display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" },
  companyItem: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#e5e7eb" },
  moreBadge: { fontSize: 12, color: "#9ca3af", fontWeight: 500 },
  // ── Interview type tags
  tagRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  tag: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 8,
    background: "rgba(99,102,241,0.12)",
    border: "1px solid rgba(99,102,241,0.25)",
    fontSize: 12,
    fontWeight: 500,
    color: "#c7d2fe",
  },
  // ── CTA banner
  ctaBanner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(135deg, rgba(109,40,217,0.25), rgba(37,99,235,0.2))",
    border: "1px solid rgba(109,40,217,0.3)",
    borderRadius: 16,
    padding: "20px 28px",
  },
  ctaLeft: { display: "flex", alignItems: "center", gap: 16 },
  ctaIconWrap: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  ctaTitle: { fontSize: 15, fontWeight: 700, margin: 0, marginBottom: 4 },
  ctaSubtitle: { fontSize: 12, color: "#9ca3af", margin: 0 },
  ctaBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 24px",
    borderRadius: 10,
    background: "white",
    color: "#111",
    fontSize: 13,
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.2s",
  },
  // ── Edit modal overlay
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(6px)",
    zIndex: 50,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  modal: {
    background: "#13152a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 32,
    width: "100%",
    maxWidth: 560,
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalTitle: { fontSize: 18, fontWeight: 700, marginBottom: 24 },
  label: { fontSize: 12, color: "#9ca3af", marginBottom: 6, display: "block" },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "#fff",
    fontSize: 14,
    padding: "10px 14px",
    marginBottom: 20,
    outline: "none",
    boxSizing: "border-box",
  },
  chipGrid: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  chip: (active) => ({
    padding: "6px 14px",
    borderRadius: 20,
    border: active ? "1px solid #7c3aed" : "1px solid rgba(255,255,255,0.1)",
    background: active ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.04)",
    color: active ? "#c4b5fd" : "#9ca3af",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  }),
  saveBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: 10,
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    marginTop: 8,
  },
  cancelBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: 10,
    background: "transparent",
    color: "#9ca3af",
    fontSize: 14,
    fontWeight: 600,
    border: "1px solid rgba(255,255,255,0.1)",
    cursor: "pointer",
    marginTop: 8,
  },
};

// ── Main component ─────────────────────────────────────────────────────────────
export default function Profile() {
  
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState(["Google", "Microsoft", "Amazon"]);
  const [interviewTypes, setInterviewTypes] = useState(["DSA", "System Design", "Behavioral", "HR Round", "DBMS"]);
  const navigate = useNavigate();

  const companies = ["Google", "Amazon", "Microsoft", "Meta", "Apple", "Tesla", "Salesforce", "Oracle", "IBM", "Accenture", "Netflix", "Uber"];
  const availableInterviewTypes = ["DSA", "System Design", "Behavioral", "HR Round", "DBMS", "Technical", "Coding Interview"];

  const profileCompletion =
    (name ? 25 : 0) +
    (selectedCompanies.length > 0 ? 25 : 0) +
    (interviewTypes.length > 0 ? 25 : 0) +
    25; // resume always counts as complete visually

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        const u = response.data.user;
        setUser(u);
        setName(u.name || "");
        setSelectedCompanies(u.target_companies ? u.target_companies.split(",").map(s => s.trim()) : ["Google", "Microsoft", "Amazon"]);
        setInterviewTypes(u.interview_types ? u.interview_types.split(",").map(s => s.trim()) : ["DSA", "System Design", "Behavioral", "HR Round", "DBMS"]);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("access_token");
          navigate("/login");
        } else {
          setError("Failed to load profile. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const response = await api.put("/auth/profile/update", {
        name,
        target_companies: selectedCompanies,
        interview_types: interviewTypes,
      });
      setUser(response.data.user);
      setIsEditing(false);
      toast.success("Profile Updated Successfully 🚀");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const toggleCompany = (c) =>
    setSelectedCompanies(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const toggleType = (t) =>
    setInterviewTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "May 2025";

  const overviewCards = [
    { label: "Personal Information", icon: <PersonIcon /> },
    { label: "Target Companies",     icon: <BriefcaseIcon /> },
    { label: "Interview Types",      icon: <CodeIcon /> },
    { label: "Resume",               icon: <DocumentIcon /> },
  ];

  const visibleCompanies = selectedCompanies.slice(0, 3);
  const extraCount = selectedCompanies.length - 3;

  return (
    <div className="flex min-h-screen">
      <Sidebar  />

      <div className="ml-64 flex-1 p-8" style={{ background: "#0d0f1e" }}>
        {/* ── Loading ── */}
        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60vh",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "3px solid transparent",
                borderTopColor: "#7c3aed",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <p style={{ color: "#9ca3af", fontSize: 14 }}>
              Loading your profile...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60vh",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 40 }}>⚠️</div>
            <p style={{ color: "#f87171" }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{ ...styles.smallEditBtn, padding: "8px 20px" }}
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Profile Content ── */}
        {!loading && !error && user && (
          <>
            {/* Header */}
            <div style={styles.headerRow}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Hamburger — mobile/tablet only */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition shrink-0"
                  aria-label="Open sidebar"
                >
                  <FaBars className="text-white text-base" />
                </button>
                <div>
                  <h1 style={styles.pageTitle}>Profile</h1>
                  <p style={styles.pageSubtitle}>
                    Manage your profile and preferences
                  </p>
                </div>
              </div>
              <button
                style={styles.editProfileBtn}
                onClick={() => setIsEditing(true)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139,92,246,0.1)";
                  e.currentTarget.style.borderColor = "#7c3aed";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)";
                }}
              >
                <EditIcon /> Edit Profile
              </button>
            </div>

            {/* Hero Card */}
            <div style={styles.heroCard}>
              <div style={styles.heroLeft}>
                <div style={styles.avatar}>
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h2 style={styles.heroName}>{user.name}</h2>
                  <p style={styles.heroEmail}>{user.email}</p>
                  <span style={styles.heroJoined}>
                    <CalendarIcon /> Joined {joinedDate}
                  </span>
                </div>
              </div>

              <div style={styles.heroRight}>
                <div style={styles.progressSection}>
                  <p style={styles.progressLabel}>Profile Completion</p>
                  <div style={{ width: 100, height: 100 }}>
                    <CircularProgressbar
                      value={profileCompletion}
                      text={`${profileCompletion}%`}
                      styles={buildStyles({
                        pathColor: "#7c3aed",
                        textColor: "#ffffff",
                        textSize: "22px",
                        trailColor: "rgba(255,255,255,0.07)",
                        pathTransitionDuration: 1,
                      })}
                    />
                  </div>
                </div>
                <div style={{ maxWidth: 180 }}>
                  <p style={styles.completionEmoji}>
                    🎉 Your profile is fully optimized
                  </p>
                  <p style={styles.completionText}>
                    Great job! You're all set to practice and ace your
                    interviews.
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Overview */}
            <p style={styles.sectionTitle}>Profile Overview</p>
            <div style={styles.overviewGrid}>
              {overviewCards.map(({ label, icon }) => (
                <div key={label} style={styles.overviewCard}>
                  <div style={styles.overviewCardLeft}>
                    <div style={styles.overviewIcon}>{icon}</div>
                    <div>
                      <p style={styles.overviewCardName}>{label}</p>
                      <p style={styles.overviewCardStatus}>Complete</p>
                    </div>
                  </div>
                  <CheckCircleIcon />
                </div>
              ))}
            </div>

            {/* Personal Information */}
            <div style={styles.infoCard}>
              <div style={styles.infoCardHeader}>
                <h3 style={styles.infoCardTitle}>
                  <span style={styles.infoCardTitleIcon}>
                    <PersonIcon />
                  </span>
                  Personal Information
                </h3>
                <button
                  style={styles.smallEditBtn}
                  onClick={() => setIsEditing(true)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(139,92,246,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <EditIcon /> Edit
                </button>
              </div>
              <div
                style={{
                  ...styles.infoRow,
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <span style={styles.infoLabel}>Name</span>
                <span style={styles.infoValue}>{user.name}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Email</span>
                <span style={styles.infoValue}>{user.email}</span>
              </div>
              <div style={{ ...styles.infoRow, borderBottom: "none" }}>
                <span style={styles.infoLabel}>Member Since</span>
                <span style={styles.infoValue}>{joinedDate}</span>
              </div>
            </div>

            {/* Two-column: Target Companies + Interview Types */}
            <div style={styles.twoColGrid}>
              {/* Target Companies */}
              <div style={styles.infoCard}>
                <div style={styles.infoCardHeader}>
                  <h3 style={styles.infoCardTitle}>
                    <span style={styles.infoCardTitleIcon}>
                      <BriefcaseIcon />
                    </span>
                    Target Companies
                  </h3>
                  <button
                    style={styles.smallEditBtn}
                    onClick={() => setIsEditing(true)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(139,92,246,0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <EditIcon /> Edit
                  </button>
                </div>
                <div style={styles.companyRow}>
                  {visibleCompanies.map((company) => (
                    <div key={company} style={styles.companyItem}>
                      <CompanyLogo company={company} />
                      <span>{company}</span>
                    </div>
                  ))}
                  {extraCount > 0 && (
                    <span style={styles.moreBadge}>+{extraCount} More</span>
                  )}
                </div>
              </div>

              {/* Interview Types */}
              <div style={styles.infoCard}>
                <div style={styles.infoCardHeader}>
                  <h3 style={styles.infoCardTitle}>
                    <span style={styles.infoCardTitleIcon}>
                      <CodeIcon />
                    </span>
                    Interview Types
                  </h3>
                  <button
                    style={styles.smallEditBtn}
                    onClick={() => setIsEditing(true)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(139,92,246,0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <EditIcon /> Edit
                  </button>
                </div>
                <div style={styles.tagRow}>
                  {interviewTypes.map((t) => (
                    <span key={t} style={styles.tag}>
                      <TagIcon type={t} />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Banner */}
            <div style={styles.ctaBanner}>
              <div style={styles.ctaLeft}>
                <div style={styles.ctaIconWrap}>
                  <RocketIcon />
                </div>
                <div>
                  <p style={styles.ctaTitle}>You're all set!</p>
                  <p style={styles.ctaSubtitle}>
                    Start practicing mock interviews and track your progress.
                  </p>
                </div>
              </div>
              <button
                style={styles.ctaBtn}
                onClick={() => navigate("/dashboard")}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Go to Dashboard <ArrowRightIcon />
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {isEditing && (
        <div style={styles.overlay} onClick={() => setIsEditing(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Edit Profile</h2>

            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />

            <label style={styles.label}>Target Companies</label>
            <div style={styles.chipGrid}>
              {companies.map((c) => (
                <button
                  key={c}
                  style={styles.chip(selectedCompanies.includes(c))}
                  onClick={() => toggleCompany(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <label style={styles.label}>Interview Types</label>
            <div style={styles.chipGrid}>
              {availableInterviewTypes.map((t) => (
                <button
                  key={t}
                  style={styles.chip(interviewTypes.includes(t))}
                  onClick={() => toggleType(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <button style={styles.saveBtn} onClick={handleSaveProfile}>
              Save Changes
            </button>
            <button
              style={styles.cancelBtn}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
