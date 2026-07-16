import { motion } from "framer-motion";
import Dashboardpreview from "./Dashboardpreview";


const companies = [
  {
    name: "Google",
    logo: "/logos/google.svg",
  },
  {
    name: "Amazon",
    logo: "/logos/amazon.svg",
  },
  {
    name: "Microsoft",
    logo: "/logos/microsoft.svg",
  },
  {
    name: "Adobe",
    logo: "/logos/adobe.svg",
  },
  {
    name: "Flipkart",
    logo: "/logos/flipkart.svg",
  },
  {
    name: "TCS",
    logo: "/logos/tcs.svg"
  },
  {
    name: "INFOSYS",
    logo: "/logos/Infosys.svg"
  },
  {
    name: "Wipro",
    logo: "/logos/Wipro.svg"
  },
  {
    name: "Capgemini",
    logo: "/logos/Capgemini.svg"
  },
];
export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-40">
      <div className="mx-auto grid min-h-[90vh] max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        {/* LEFT SIDE */}

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            🚀 AI Powered Interview Practice
          </span>

          <h1 className="mt-8 text-6xl font-black leading-tight tracking-tight">
            Ace Your Next
            <br />
            <span className="text-emerald-400"> Interview.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">
            Practice real interview questions, receive instant AI-powered
            feedback, and improve your confidence before your actual 
            interview.
          </p>
        </motion.div>

        {/* RIGHT SIDE */}
        <div className="relative -mt-24 flex items-start justify-center lg:justify-end">
          <Dashboardpreview />
        </div>
      </div>
      <div className="mt-10 flex flex-wrap gap-4">
      </div>{" "}
      <div className="mt-10">
        <p className="mb-4 text-xl text-center text-slate-400">
          Practice interview questions inspired by
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {companies.map((company) => (
            <div
              key={company.name}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10"
            >
              <img src={company.logo} alt={company.name} className="h-6 w-6" />

              <span className="text-sm font-medium">{company.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="h-3 w-3 rounded-full bg-emerald-400"></div>

          <p className="text-sm text-slate-400">
            Trusted by
            <span className="mx-1 font-semibold text-emerald-400">10,000+</span>
            learners worldwide
          </p>
        </div>
      </div>
    </section>
  );
}
