import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "SDE-2 @ Google",
    avatar: "PS",
    avatarColor: "from-emerald-400 to-teal-500",
    quote:
      "PrepForge completely changed how I prepared. The AI feedback was brutally honest and exactly what I needed. Got my Google offer after 3 weeks of consistent practice.",
    company: "Google",
    rating: 5,
  },
  {
    name: "Arjun Mehta",
    role: "Software Engineer @ Microsoft",
    avatar: "AM",
    avatarColor: "from-sky-400 to-blue-500",
    quote:
      "The company-specific question bank is a game changer. Microsoft-tagged questions were spot on. I walked into my interview feeling like I'd already done it before.",
    company: "Microsoft",
    rating: 5,
  },
  {
    name: "Sneha Kapoor",
    role: "Backend Engineer @ Amazon",
    avatar: "SK",
    avatarColor: "from-violet-400 to-purple-500",
    quote:
      "Doing 2 mock interviews a day on PrepForge was the best decision I made. The score tracking showed me exactly where I was improving week by week.",
    company: "Amazon",
    rating: 5,
  },
  {
    name: "Rohan Verma",
    role: "Full Stack Dev @ Flipkart",
    avatar: "RV",
    avatarColor: "from-yellow-400 to-orange-500",
    quote:
      "I was skeptical about AI feedback but PrepForge proved me wrong. It catches subtle issues like vague explanations and missed edge cases. Highly recommend!",
    company: "Flipkart",
    rating: 5,
  },
  {
    name: "Ananya Singh",
    role: "ML Engineer @ Adobe",
    avatar: "AS",
    avatarColor: "from-rose-400 to-pink-500",
    quote:
      "Resume-aware questions feature is incredible — it dug into my Python and ML projects and asked super relevant questions. Felt like a real interviewer.",
    company: "Adobe",
    rating: 5,
  },
  {
    name: "Dev Patel",
    role: "Frontend Engineer @ Razorpay",
    avatar: "DP",
    avatarColor: "from-teal-400 to-emerald-500",
    quote:
      "The behavioral interview prep on PrepForge is underrated. Helped me structure my STAR answers properly. Got 4 offers in 6 weeks of prep. This platform delivers.",
    company: "Razorpay",
    rating: 5,
  },
];

function StarRating({ count }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative overflow-hidden py-28">
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-0 top-1/2 h-[400px] w-[500px] -translate-y-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute right-0 top-1/4 h-[350px] w-[450px] rounded-full bg-sky-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            💬 Real Stories
          </span>
          <h2 className="mt-6 text-5xl font-black leading-tight tracking-tight text-white">
            Candidates Who{" "}
            <span className="text-emerald-400">Got Hired</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Join thousands of engineers who cracked their interviews with
            AI-powered practice on PrepForge.
          </p>
        </motion.div>

        {/* Testimonial Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group flex flex-col rounded-2xl border border-white/10 bg-[#172033]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-[#172033]"
            >
              {/* Stars */}
              <StarRating count={t.rating} />

              {/* Quote */}
              <p className="mt-4 flex-1 text-sm leading-7 text-slate-300">
                "{t.quote}"
              </p>

              {/* Divider */}
              <div className="my-5 h-px w-full bg-white/5" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.avatarColor} text-sm font-bold text-white shadow-lg`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
                <span className="ml-auto rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                  {t.company}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust strip */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center text-sm text-slate-500"
        >
          Trusted by{" "}
          <span className="font-semibold text-slate-300">10,000+</span>{" "}
          candidates worldwide · Average rating{" "}
          <span className="font-semibold text-emerald-400">4.9 / 5.0</span>
        </motion.p>
      </div>
    </section>
  );
}
