import { motion } from "framer-motion";
import { Clock3, Brain, Trophy, ChevronRight } from "lucide-react";

export default function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute -left-29 top-10 rounded-2xl border border-white/10 bg-[#172033] px-6 py-4"
      >
        <p className="text-xs text-slate-400">Average Score</p>
        <h2 className="mt-2 text-3xl font-bold text-emerald-400">8.9</h2>
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="absolute -right-24 top-40 rounded-2xl border border-white/10 bg-[#172033] px-6 py-4"
      >
        <p className="text-xs text-slate-400">Companies</p>
        <h2 className="mt-2 text-3xl font-bold">120+</h2>
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute bottom-10 -left-26 rounded-2xl border border-white/10 bg-[#172033] p-4"
      >
        <p className="text-xs text-slate-400">AI Feedback</p>
        <h2 className="mt-2 font-bold text-sky-400">Instant</h2>
      </motion.div>
      <div className="w-[420px] rounded-3xl border border-white/10 bg-[#172033]/90 p-6 shadow-2xl backdrop-blur-xl">
        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Mock Interview</p>

            <h3 className="mt-1 text-xl font-bold">Google • DSA</h3>
          </div>

          <div className="rounded-xl bg-emerald-500/20 px-3 py-1 text-sm text-emerald-400">
            Live
          </div> 
        </div>

        {/* Progress */}

        <div className="mt-8">
          <div className="flex justify-between text-sm">
            <span>Question</span>

            <span>4 / 10</span>
          </div>

          <div className="mt-3 h-2 rounded-full bg-slate-700">
            <div className="h-2 w-2/5 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Question */}

        <div className="mt-8 rounded-2xl bg-white/5 p-5">
          <p className="text-sm text-slate-400">Current Question</p>

          <h2 className="mt-2 text-lg font-semibold">
            Explain the optimal solution for the Two Sum problem.
          </h2>
        </div>

        {/* Bottom Cards */}

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/5 p-4">
            <Clock3 className="text-emerald-400" size={20} />

            <p className="mt-3 text-xs text-slate-400">Time Left</p>

            <h3 className="font-bold">01:35</h3>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <Brain className="text-sky-400" size={20} />

            <p className="mt-3 text-xs text-slate-400">AI Score</p>

            <h3 className="font-bold">8.9/10</h3>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <Trophy className="text-yellow-400" size={20} />

            <p className="mt-3 text-xs text-slate-400">Progress</p>

            <h3 className="font-bold">78%</h3>
          </div>
        </div>

        {/* Button */}

        <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 font-semibold text-black transition hover:bg-emerald-400">
          Continue Interview
          <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}
