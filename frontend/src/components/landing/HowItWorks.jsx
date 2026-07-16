import { motion } from "framer-motion";
import { UserPlus, LayoutDashboard, Mic2, Star } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Account",
    description:
      "Sign up in seconds — no credit card needed. Set up your profile and tell us your target role, skills, and dream companies.",
    color: "text-emerald-400",
    glow: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: LayoutDashboard,
    step: "02",
    title: "Choose Your Interview",
    description:
      "Pick a company, topic (DSA, System Design, Behavioral), and difficulty level. Our AI tailors the question set just for you.",
    color: "text-sky-400",
    glow: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
  {
    icon: Mic2,
    step: "03",
    title: "Practice & Get Feedback",
    description:
      "Answer questions in a real interview environment. Our AI evaluates your response instantly and gives detailed, actionable feedback.",
    color: "text-violet-400",
    glow: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Star,
    step: "04",
    title: "Track Progress & Improve",
    description:
      "Review your performance analytics, revisit weak areas, and watch your scores climb — until you're ready to ace the real thing.",
    color: "text-yellow-400",
    glow: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-28">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[500px] w-[700px] rounded-full bg-violet-500/5 blur-[130px]" />
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
            🔄 Simple Process
          </span>
          <h2 className="mt-6 text-5xl font-black leading-tight tracking-tight text-white">
            How <span className="text-emerald-400">PrepForge</span> Works
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            From sign-up to offer letter — our streamlined four-step process
            takes you from nervous to confident.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative"
            >
              {/* Connector line between steps (desktop) */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-10 hidden h-px w-full translate-x-1/2 border-t border-dashed border-white/10 lg:block" />
              )}

              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`flex h-full flex-col rounded-2xl border border-white/10 bg-[#172033]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-[#172033]`}
              >
                {/* Step number */}
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${step.glow}`}
                  >
                    <step.icon className={step.color} size={22} />
                  </div>
                  <span
                    className={`text-4xl font-black leading-none ${step.color} opacity-20`}
                  >
                    {step.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {step.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
