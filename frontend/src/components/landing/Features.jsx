import { motion } from "framer-motion";
import {
  Brain,
  Code2,
  BarChart3,
  Building2,
  Mic,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Feedback",
    description:
      "Get instant, detailed feedback on your answers from our advanced AI model — covering correctness, clarity, and depth.",
    color: "text-emerald-400",
    border: "hover:border-emerald-500/40",
    glow: "bg-emerald-500/10",
    badge: "Core",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  {
    icon: Code2,
    title: "Real Interview Questions",
    description:
      "Practice hundreds of interview questions sourced from top tech companies like Google, Amazon, and Microsoft many more...",
    color: "text-sky-400",
    border: "hover:border-sky-500/40",
    glow: "bg-sky-500/10",
    badge: "Question",
    badgeColor: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Track your progress over time with detailed analytics — see your strengths, weak spots, and score trends at a glance.",
    color: "text-violet-400",
    border: "hover:border-violet-500/40",
    glow: "bg-violet-500/10",
    badge: "Analytics",
    badgeColor: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  },
  {
    icon: Building2,
    title: "Company-Specific Prep",
    description:
      "Filter questions by company — FAANG, startups, product companies — and prepare with a targeted interview strategy.",
    color: "text-yellow-400",
    border: "hover:border-yellow-500/40",
    glow: "bg-yellow-500/10",
    badge: "Companies",
    badgeColor: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  },
  {
    icon: Mic,
    title: "Mock Interview Sessions",
    description:
      "Simulate full end-to-end mock interviews with a timer, question queue, and comprehensive result report after each session.",
    color: "text-rose-400",
    border: "hover:border-rose-500/40",
    glow: "bg-rose-500/10",
    badge: "Mock",
    badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Resume-Aware Questions",
    description:
      "Upload your resume and get personalized interview questions tailored to your skills, experience, and target role.",
    color: "text-teal-400",
    border: "hover:border-teal-500/40",
    glow: "bg-teal-500/10",
    badge: "Personal",
    badgeColor: "bg-teal-500/10 text-teal-300 border-teal-500/20",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative overflow-hidden py-28">
      {/* Background ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/4 top-0 h-100 w-150 -translate-x-1/2 rounded-full bg-emerald-500/6 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-87.5 w-125 translate-x-1/2 rounded-full bg-sky-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            ⚡ Everything You Need
          </span>
          <h2 className="mt-6 text-5xl font-black leading-tight tracking-tight text-white">
            Features Built for{" "}
            <span className="text-emerald-400">Interview Success</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            From AI feedback to company-specific question banks, every tool you
            need to land your dream offer is here.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`group relative flex flex-col rounded-2xl border border-white/10 bg-[#172033]/80 p-6 backdrop-blur-xl transition-all duration-300 ${feature.border} hover:bg-[#172033]`}
            >
              {/* Badge */}
              <span
                className={`mb-5 inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold ${feature.badgeColor}`}
              >
                {feature.badge}
              </span>

              {/* Icon */}
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${feature.glow}`}
              >
                <feature.icon className={feature.color} size={22} />
              </div>

              <h3 className="text-lg font-bold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                {feature.description}
              </p>

              {/* Subtle bottom glow line on hover */}
              <div
                className={`absolute bottom-0 left-6 right-6 h-px rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${feature.glow}`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
