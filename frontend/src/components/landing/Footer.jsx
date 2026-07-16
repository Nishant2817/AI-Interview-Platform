import { motion } from "framer-motion";
import {GitBranch, Globe, MessageCircle, Mail, Brain,} from "lucide-react";

const footerLinks = {
  Product: ["Features", "How It Works", "Pricing", "Changelog"],
  Practice: ["DSA Questions", "System Design", "Behavioral", "Mock Interviews"],
  Company: ["About Us", "Blog", "Careers", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

const socials = [
  { icon: GitBranch, href: "#", label: "GitHub" },
  { icon: Globe, href: "#", label: "Twitter" },
  { icon: MessageCircle, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
];

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
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 pt-20 pb-10">
 {/* Subtle ambient glow */}
  <div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 flex items-end justify-center"
  >
    <div className="h-45 w-200 rounded-full bg-emerald-500/5 blur-[120px]" />
  </div>

  <div className="relative mx-auto max-w-7xl px-6">
  {/* Top Row */}
  <div className="grid gap-12 lg:grid-cols-5">
  {/* Brand Column */}
  <div className="lg:col-span-2">
  <div className="flex items-center gap-3">
  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
  <span className="text-lg font-extrabold text-white">PF</span>
  </div>
  <div>
  <h2 className="text-xl font-bold tracking-tight text-white">
  PrepForge
  </h2>
  <p className="text-xs text-slate-400">
  Practice. Improve. Get Hired.
  </p>
  </div>
  </div>

  <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
  The AI-powered interview platform that helps candidates crack
  top-tier interviews through targeted practice, real-time
  feedback, and actionable analytics.
  </p>

 {/* Social Links */}
  <div className="mt-6 flex gap-3">
  {socials.map((social) => (
  <motion.a
  key={social.label}
  href={social.href}
  aria-label={social.label}
  whileHover={{ scale: 1.1, y: -2 }}
  whileTap={{ scale: 0.95 }}
  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
  >
  <social.icon size={16} />
  </motion.a>
  ))}
  </div>
  </div>

  {/* Link Columns */}
  <div className="grid grid-cols-2 gap-8 lg:col-span-3 lg:grid-cols-4">
  {Object.entries(footerLinks).map(([title, links]) => (
  <div key={title}>
  <h3 className="mb-4 text-sm font-semibold text-white">
  {title}
  </h3>
  <ul className="space-y-3">
  {links.map((link) => (
  <li key={link}>
  <a
  href="#"
  className="text-sm text-slate-400 transition-colors hover:text-emerald-400"
  >
  {link}
  </a>
  </li>
  ))}
  </ul>
  </div>
  ))}
  </div>
  </div>

  {/* Company Tags */}
  <div className="mt-14 flex flex-wrap gap-2">
  <span className="text-lg font-semibold text-white-500 self-center mr-2">
  Questions from:
  </span>
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

  {/* Divider */}
  <div className="mt-12 h-px w-full bg-white/5" />

  {/* Bottom Row */}
  <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
  <p className="text-sm text-white-500">
  © {new Date().getFullYear()} PrepForge. All rights reserved.
  </p>
  <p className="flex items-center gap-2 text-sm text-white-500">
  Built with ❤️ &{" "}
  <Brain size={14} className="text-emerald-400" />
  AI to help you land your dream job.
  </p>
  </div>
  </div>
  </footer>
  );
}
