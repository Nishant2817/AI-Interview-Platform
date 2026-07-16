import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  const navItems = [
    {
      label: "Features",
      id: "features",
    },
    {
      label: "How It Works",
      id: "how-it-works",
    },
    {
      label: "Companies",
      id: "companies",
    },
    {
      label: "Testimonials",
      id: "testimonials",
    },
    {
      label: "About",
      id: "about",
    },
  ];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto mt-6 max-w-7xl px-6">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-xl">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
              <span className="text-lg font-extrabold text-white">PF</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                PrepForge - AI Interview Platform
              </h1>

              <p className="text-xs text-slate-400">
                Practice Smarter - Get Hired Faster
              </p>
            </div>
          </div>

          {/* Desktop Menu */}

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm text-slate-300 transition hover:text-emerald-400"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Buttons */}

          <div className="hidden items-center gap-4 md:flex">
            <Link to="/login" className="text-slate-300 hover:text-white">
              Login
            </Link>

            <Link
              to="/signup"
              className="rounded-xl bg-emerald-500 px-5 py-2 font-semibold text-black transition hover:bg-emerald-400"
            >
              Get Started →
            </Link>
          </div>

          {/* Mobile */}

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X /> : <Menu />}
          </button>
        </nav>
      </div>
    </motion.header>
  );
}
