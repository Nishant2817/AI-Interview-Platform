import { motion } from "framer-motion";
import { Users, BookOpen, Trophy, Building2 } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Active Candidates",
    color: "text-emerald-400",
    glow: "bg-emerald-500/10",
  },
  {
    icon: BookOpen,
    value: "50,000+",
    label: "Questions Practiced",
    color: "text-sky-400",
    glow: "bg-sky-500/10",
  },
  {
    icon: Trophy,
    value: "87%",
    label: "Success Rate",
    color: "text-yellow-400",
    glow: "bg-yellow-500/10",
  },
  {
    icon: Building2,
    value: "120+",
    label: "Companies Covered",
    color: "text-violet-400",
    glow: "bg-violet-500/10",
  },
];

export default function Stats() {
  return (
    <section className="relative py-20">
      {/* Subtle separator glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[300px] w-[900px] rounded-full bg-emerald-500/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-6 md:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.04 }}
              className="group relative flex flex-col items-center rounded-2xl border border-white/10 bg-[#172033]/80 p-8 text-center backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-[#172033]"
            >
              {/* Icon glow bg */}
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${stat.glow}`}
              >
                <stat.icon className={stat.color} size={24} />
              </div>

              <h3 className={`text-3xl font-black tracking-tight ${stat.color}`}>
                {stat.value}
              </h3>
              <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
