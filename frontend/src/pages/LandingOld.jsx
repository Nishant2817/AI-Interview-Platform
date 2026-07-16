import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoIcon from "../components/LogoIcon";
import heroImg from "../assets/hero-image.png";

/* ─────────── tiny helpers ─────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────── data ─────────── */
const NAV_LINKS = ["Home", "Features", "About Us", "Pricing", "Contact"];

const FEATURES = [
  {
    icon: "🎙️",
    title: "AI Mock Interviews",
    desc: "Practice with AI interviewers across different roles and difficulty levels.",
    color: "from-violet-600 to-purple-700",
    bg: "rgba(124,58,237,0.12)",
    border: "rgba(124,58,237,0.3)",
  },
  {
    icon: "📄",
    title: "Resume Analysis",
    desc: "Get AI-powered insights and suggestions to improve your resume instantly.",
    color: "from-emerald-500 to-teal-600",
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.3)",
  },
  {
    icon: "📊",
    title: "Progress Tracking",
    desc: "Track your performance, identify weak areas and improve continuously.",
    color: "from-blue-500 to-cyan-500",
    bg: "rgba(59,130,246,0.12)",
    border: "rgba(59,130,246,0.3)",
  },
  {
    icon: "🏢",
    title: "Company Specific Prep",
    desc: "Prepare for top companies with role-specific questions and expectations.",
    color: "from-pink-500 to-rose-600",
    bg: "rgba(236,72,153,0.12)",
    border: "rgba(236,72,153,0.3)",
  },
];

const STEPS = [
  { num: "01", icon: "☁️", title: "Upload Resume", desc: "Upload your resume and let our AI analyze your skills and experience." },
  { num: "02", icon: "🤖", title: "AI Analysis", desc: "Our AI analyzes and creates customized interview questions for you." },
  { num: "03", icon: "🎤", title: "Mock Interview", desc: "Practice with AI Interviewer in a real-time simulated environment." },
  { num: "04", icon: "📋", title: "Get Feedback", desc: "Receive instant feedback, score and personalized improvement tips." },
];

const STATS = [
  { value: "10,000+", label: "Interviews Practiced", icon: "👥" },
  { value: "5,000+", label: "Resumes Analyzed", icon: "📄" },
  { value: "95%", label: "Success Rate", icon: "🏆" },
  { value: "24/7", label: "AI Availability", icon: "🕐" },
];

const TESTIMONIALS = [
  {
    quote: "The AI mock interviews are incredibly realistic. It helped me crack my dream job at Google!",
    name: "Rohan Mehta",
    role: "SDE at Google",
    avatar: "RM",
    color: "from-violet-500 to-blue-500",
  },
  {
    quote: "Resume analysis feature gave me exact suggestions that improved my interview calls by 3x.",
    name: "Ananya Sharma",
    role: "Product Manager at Microsoft",
    avatar: "AS",
    color: "from-emerald-500 to-teal-500",
  },
  {
    quote: "Best platform for interview prep! The feedback is so detailed and easy to understand.",
    name: "Arpit Verma",
    role: "SDE at Amazon",
    avatar: "AV",
    color: "from-pink-500 to-rose-500",
  },
];

const COMPANIES = ["Google", "Amazon", "Microsoft", "Meta", "Infosys", "TCS"];

const FOOTER_LINKS = {
  Product: ["Features", "Pricing", "How It Works", "Updates"],
  Company: ["About Us", "Careers", "Blog", "Contact"],
  Resources: ["FAQ", "Interview Tips", "Privacy Policy", "Terms of Service"],
};

/* ─────────── Navbar ─────────── */
function Navbar({ navigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      id="navbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(5,8,22,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s ease",
        padding: "0 5%",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 72, gap: 24 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <LogoIcon size={40} />
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>AI Interview Platform</div>
            <div style={{ color: "#a0aec0", fontSize: 10 }}>Practice Smarter.Get Hired Faster.</div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 32 }} className="nav-links-desktop">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(" ", "-")}`}
              id={`nav-link-${link.toLowerCase().replace(" ", "-")}`}
              style={{
                color: i === 0 ? "#7c3aed" : "#cbd5e1",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                borderBottom: i === 0 ? "2px solid #7c3aed" : "2px solid transparent",
                paddingBottom: 4,
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => { e.target.style.color = "#a78bfa"; }}
              onMouseLeave={e => { e.target.style.color = i === 0 ? "#7c3aed" : "#cbd5e1"; }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <button
            id="navbar-login"
            onClick={() => navigate("/login")}
            style={{
              background: "transparent",
              color: "#a78bfa",
              border: "1px solid rgba(124,58,237,0.45)",
              borderRadius: 8,
              padding: "10px 20px",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.12)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.7)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.45)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Login
          </button>
          <button
            id="navbar-get-started"
            onClick={() => navigate("/signup")}
            style={{
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 22px",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
              transition: "opacity 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Get Started →
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

/* ─────────── Hero ─────────── */
function Hero({ navigate }) {
  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #050816 0%, #0d0f2e 40%, #050816 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Ambient glows */}
      <div style={{ position: "absolute", top: "10%", left: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "20%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "30%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Grid lines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 5% 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", width: "100%", position: "relative" }}>
        {/* Left content */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", display: "inline-block", animation: "hero-pulse 1.5s ease-in-out infinite" }} />
            <span style={{ color: "#a78bfa", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em" }}>AI-POWERED INTERVIEW PREPARATION</span>
          </div>

          <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, color: "#fff", marginBottom: 24 }}>
            Crack Your<br />
            <span style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Dream Job</span>
            <br />With AI{" "}
            <span style={{ background: "linear-gradient(135deg, #06b6d4, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Intelligence</span>
          </h1>

          <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
            Practice real interviews, analyze resumes,<br />
            track your progress and get instant<br />
            AI-powered feedback.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
            <button
              id="hero-get-started"
              onClick={() => navigate("/signup")}
              style={{
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "14px 28px",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(124,58,237,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.4)"; }}
            >
              Get Started Free →
            </button>
            <button
              id="hero-login"
              onClick={() => navigate("/login")}
              style={{
                background: "transparent",
                color: "#a78bfa",
                border: "1px solid rgba(124,58,237,0.5)",
                borderRadius: 10,
                padding: "14px 28px",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
                backdropFilter: "blur(4px)",
                background: "rgba(124,58,237,0.08)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.18)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.8)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.08)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <span style={{ fontSize: 16 }}>🔑</span>
              Login
            </button>
          </div>

          {/* Social proof */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex" }}>
              {["#7c3aed","#2563eb","#06b6d4","#10b981"].map((c, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${c}, ${c}99)`, border: "2px solid #050816", marginLeft: i > 0 ? -10 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 700 }}>
                  {["R","A","S","M"][i]}
                </div>
              ))}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>10,000+ students</div>
              <div style={{ color: "#64748b", fontSize: 12 }}>already preparing smarter</div>
            </div>
          </div>
        </div>

        {/* Right — floating visual */}
        <HeroVisual />
      </div>

      {/* Trusted by */}
      <TrustedBy />

      <style>{`
        @keyframes hero-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </section>
  );
}

function HeroVisual() {
  return (
    <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 420 }}>
      {/* Outer glow ring */}
      <div style={{
        position: "absolute",
        inset: -24,
        borderRadius: 32,
        background: "radial-gradient(ellipse at center, rgba(124,58,237,0.18) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Image frame */}
      <div style={{
        position: "relative",
        borderRadius: 24,
        overflow: "hidden",
        border: "1px solid rgba(124,58,237,0.35)",
        boxShadow: "0 0 0 1px rgba(37,99,235,0.2), 0 24px 60px rgba(124,58,237,0.25), 0 4px 20px rgba(0,0,0,0.5)",
        animation: "hero-float 5s ease-in-out infinite",
        maxWidth: 520,
        width: "100%",
      }}>
        <img
          src={heroImg}
          alt="AI Interview Platform - Professional AI-powered interview preparation"
          style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
        />
        {/* Subtle top shine overlay */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "40%",
          background: "linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Floating badge — top left */}
      <div style={{
        position: "absolute",
        top: "8%",
        left: "-8%",
        background: "rgba(10,13,36,0.92)",
        border: "1px solid rgba(16,185,129,0.35)",
        borderRadius: 12,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        backdropFilter: "blur(12px)",
        animation: "hero-float 4s ease-in-out 0.3s infinite",
        boxShadow: "0 4px 20px rgba(16,185,129,0.15)",
        zIndex: 3,
      }}>
        <span style={{ fontSize: 18 }}>✅</span>
        <span style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>Resume Analyzed</span>
      </div>

      {/* Floating badge — top right */}
      <div style={{
        position: "absolute",
        top: "8%",
        right: "-8%",
        background: "rgba(10,13,36,0.92)",
        border: "1px solid rgba(124,58,237,0.35)",
        borderRadius: 12,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        backdropFilter: "blur(12px)",
        animation: "hero-float 3.8s ease-in-out 0.7s infinite",
        boxShadow: "0 4px 20px rgba(124,58,237,0.15)",
        zIndex: 3,
      }}>
        <span style={{ fontSize: 18 }}>🎯</span>
        <span style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>95% Score</span>
      </div>

      {/* Floating badge — bottom left */}
      <div style={{
        position: "absolute",
        bottom: "6%",
        left: "-6%",
        background: "rgba(10,13,36,0.92)",
        border: "1px solid rgba(37,99,235,0.35)",
        borderRadius: 12,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        backdropFilter: "blur(12px)",
        animation: "hero-float 4.4s ease-in-out 1s infinite",
        boxShadow: "0 4px 20px rgba(37,99,235,0.15)",
        zIndex: 3,
      }}>
        <span style={{ fontSize: 18 }}>💬</span>
        <span style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>Feedback Ready</span>
      </div>

      {/* Floating badge — bottom right */}
      <div style={{
        position: "absolute",
        bottom: "6%",
        right: "-6%",
        background: "rgba(10,13,36,0.92)",
        border: "1px solid rgba(245,158,11,0.35)",
        borderRadius: 12,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        backdropFilter: "blur(12px)",
        animation: "hero-float 4.2s ease-in-out 1.4s infinite",
        boxShadow: "0 4px 20px rgba(245,158,11,0.15)",
        zIndex: 3,
      }}>
        <span style={{ fontSize: 18 }}>🏆</span>
        <span style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>Offer Received!</span>
      </div>

      <style>{`
        @keyframes hero-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}

function TrustedBy() {
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "10px 5%", background: "rgba(5,8,22,0.6)", backdropFilter: "blur(8px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ color: "#475569", fontSize: 12, textAlign: "center", marginBottom: 16, letterSpacing: "0.08em" }}>Trusted by students from</p>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "clamp(20px, 4vw, 56px)", flexWrap: "wrap" }}>
          {COMPANIES.map(c => (
            <span key={c} style={{ color: "#64748b", fontWeight: 700, fontSize: "clamp(12px,1.5vw,16px)", letterSpacing: "0.04em", opacity: 0.8, transition: "opacity 0.2s, color 0.2s", cursor: "default" }}
              onMouseEnter={e => { e.target.style.color = "#a78bfa"; e.target.style.opacity = "1"; }}
              onMouseLeave={e => { e.target.style.color = "#64748b"; e.target.style.opacity = "0.8"; }}
            >{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────── Features ─────────── */
function Features() {
  return (
    <section id="features" style={{ padding: "100px 5%", background: "#050816", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ color: "#7c3aed", fontWeight: 600, fontSize: 12, letterSpacing: "0.1em", marginBottom: 12, textTransform: "uppercase" }}>Powerful Features</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
              Everything You Need to{" "}
              <span style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Succeed</span>
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {FEATURES.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.1}>
              <FeatureCard {...f} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, bg, border, color }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        background: hovered ? bg : "rgba(13,15,46,0.8)",
        border: `1px solid ${hovered ? border : "rgba(255,255,255,0.08)"}`,
        borderRadius: 20,
        padding: "28px 24px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? `0 20px 40px ${border}40` : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${color.split(" ")[1]}, ${color.split(" ")[3]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 20 }}>
        {icon}
      </div>
      <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{title}</h3>
      <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{desc}</p>
      <div style={{ color: "#7c3aed", fontSize: 18, fontWeight: 700 }}>→</div>
    </div>
  );
}

/* ─────────── How It Works ─────────── */
function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: "100px 5%", background: "linear-gradient(180deg, #050816 0%, #0a0d24 100%)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{ color: "#7c3aed", fontWeight: 600, fontSize: 12, letterSpacing: "0.1em", marginBottom: 12, textTransform: "uppercase" }}>How It Works</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#fff" }}>
              Simple Steps to{" "}
              <span style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Get Better</span>
            </h2>
          </div>
        </FadeIn>

        {/* Steps */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, marginBottom: 72 }}>
          {STEPS.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.12}>
              <StepCard {...step} isLast={i === STEPS.length - 1} />
            </FadeIn>
          ))}
        </div>

        {/* Stats */}
        <FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  background: "rgba(13,15,46,0.9)",
                  padding: "32px 24px",
                  textAlign: "center",
                  borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", marginBottom: 4 }}>{stat.value}</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function StepCard({ num, icon, title, desc, isLast }) {
  return (
    <div style={{ position: "relative" }}>
      <div style={{ background: "rgba(13,15,46,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 22px" }}>
        <div style={{ color: "#7c3aed", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 16 }}>{num}</div>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 20 }}>
          {icon}
        </div>
        <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{title}</h3>
        <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>{desc}</p>
      </div>
      {!isLast && (
        <div style={{ position: "absolute", top: "50%", right: -16, transform: "translateY(-50%)", color: "#7c3aed", fontSize: 20, zIndex: 1, display: "flex" }} className="step-connector">
          +
        </div>
      )}
      <style>{`.step-connector { display: none; } @media(min-width:900px) { .step-connector { display: flex; } }`}</style>
    </div>
  );
}

/* ─────────── Testimonials ─────────── */
function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="testimonials" style={{ padding: "100px 5%", background: "#050816" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ color: "#7c3aed", fontWeight: 600, fontSize: 12, letterSpacing: "0.1em", marginBottom: 12, textTransform: "uppercase" }}>Loved by Students</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#fff" }}>
              What Our{" "}
              <span style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Users Say</span>
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 40 }}>
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.1}>
              <TestimonialCard {...t} isActive={i === active} />
            </FadeIn>
          ))}
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              id={`testimonial-dot-${i}`}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === active ? "#7c3aed" : "rgba(255,255,255,0.2)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ quote, name, role, avatar, color, isActive }) {
  return (
    <div style={{
      background: isActive ? "rgba(124,58,237,0.1)" : "rgba(13,15,46,0.8)",
      border: `1px solid ${isActive ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 20,
      padding: "28px 24px",
      transition: "all 0.4s ease",
      transform: isActive ? "scale(1.02)" : "scale(1)",
    }}>
      <div style={{ fontSize: 28, color: "#7c3aed", marginBottom: 16 }}>❝</div>
      <p style={{ color: "#e2e8f0", fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>{quote}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${color.split(" ")[1]}, ${color.split(" ")[3]})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
          {avatar}
        </div>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{name}</div>
          <div style={{ color: "#64748b", fontSize: 12 }}>{role}</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────── CTA Banner ─────────── */
function CTABanner({ navigate }) {
  return (
    <section style={{ padding: "80px 5%", background: "linear-gradient(135deg, #0a0d24, #0d0f2e)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <FadeIn>
          <div style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))",
            border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: 28,
            padding: "56px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Ambient glow */}
            <div style={{ position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)", width: 400, height: 200, background: "radial-gradient(ellipse, rgba(124,58,237,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />

            <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 800, color: "#fff", marginBottom: 12 }}>
              Ready to Ace Your Next Interview?
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 36 }}>
              Join thousands of candidates who are preparing smarter with AI
            </p>
            <button
              id="cta-get-started"
              onClick={() => navigate("/signup")}
              style={{
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "16px 36px",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 24px rgba(124,58,237,0.45)",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 36px rgba(124,58,237,0.55)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(124,58,237,0.45)"; }}
            >
              Get Started Free →
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────── Footer ─────────── */
function Footer({ navigate }) {
  return (
    <footer style={{ background: "#050816", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "64px 5% 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 40, marginBottom: 56 }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <LogoIcon size={40} />
              <div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>AI Interview Platform</div>
                <div style={{ color: "#475569", fontSize: 11 }}>Practice Smarter.Get Hired Faster.</div>
              </div>
            </div>
            <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>
              AI-powered interview preparation platform to help you practice and get hired faster.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: 10 }}>
              {["𝕏", "in", "⊙", "▶"].map((icon, i) => (
                <div key={i} style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontSize: 13, cursor: "pointer", transition: "background 0.2s, color 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.2)"; e.currentTarget.style.color = "#a78bfa"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#64748b"; }}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 20 }}>{section}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {links.map(link => (
                  <li key={link}>
                    <a href="#" style={{ color: "#475569", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => { e.target.style.color = "#a78bfa"; }}
                      onMouseLeave={e => { e.target.style.color = "#475569"; }}
                    >{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Connect */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 20 }}>Connect With Us</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["𝕏 Twitter", "LinkedIn", "⊙ YouTube"].map(s => (
                <a key={s} href="#" style={{ color: "#475569", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => { e.target.style.color = "#a78bfa"; }}
                  onMouseLeave={e => { e.target.style.color = "#475569"; }}
                >{s}</a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "center" }}>
          <p style={{ color: "#334155", fontSize: 12 }}>© 2026 AI Interview Platform. All rights reserved.</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ─────────── Main Page ─────────── */
export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#050816", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar navigate={navigate} />
      <Hero navigate={navigate} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTABanner navigate={navigate} />
      <Footer navigate={navigate} />
    </div>
  );
}
