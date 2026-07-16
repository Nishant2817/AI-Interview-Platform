import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import LogoIcon from "../components/LogoIcon";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/forgot-password", {
        email,
      });

      toast.success(response.data.message);
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Email Not Registered");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B1020] text-white">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-20 top-40 h-[350px] w-[350px] rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="absolute right-20 top-20 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative grid min-h-screen lg:grid-cols-2">
        {/* Left Section */}
        <div className="hidden lg:flex flex-col justify-center px-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-4">
              <LogoIcon size={56} />

              <div>
                <p className="text-4xl font-semibold text-emerald-500">
                  PrepForge
                </p>

                <p className="text-sm text-white-400">
                  Practice smarter. Get hired faster.
                </p>
              </div>
            </div>

            <h1 className="mt-10 text-6xl font-bold leading-tight">
              Forgot
              <span className="block bg-linear-to-r from-emerald-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Password?
              </span>
            </h1>

            <p className="mt-6 text-lg text-white-400 leading-8">
              No worries. Enter your registered email address and we'll send you
              a secure password reset link instantly.
            </p>

            <div className="mt-10 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-emerald-400/30 hover:translate-x-2">
                🔒 Secure Password Reset
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-emerald-400/30 hover:translate-x-2">
                ✉ Email Verification
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-emerald-400/30 hover:translate-x-2">
                ⚡ Instant Recovery
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative flex items-center justify-center p-8">
          <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-[#172033]/90 p-10 backdrop-blur-xl shadow-[0_40px_120px_rgba(16,185,129,0.12)]">
            <h2 className="text-center text-5xl font-bold">
              Reset <span className="text-emerald-400">Password</span>
            </h2>

            <p className="mt-4 text-center text-white-400">
              Enter your email address to receive a secure password reset link.
            </p>

            <form onSubmit={handleForgotPassword} className="mt-10 space-y-6">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-[#111827] px-5 py-4 outline-none transition-all duration-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              />

              <button
                type="submit"
                className="w-full rounded-xl border border-emerald-400/50 bg-black/60 py-3 font-semibold tracking-widest uppercase transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]"
              >
                Send Reset Link
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="font-medium text-white hover:text-emerald-300"
              >
                ← Back to Login
              </Link>
            </div>

            <div className="mt-8 flex justify-center gap-6 text-sm text-slate-500">
              <span className="cursor-pointer hover:text-white">Terms</span>

              <span className="cursor-pointer hover:text-white">Privacy</span>

              <span className="cursor-pointer hover:text-white">Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
