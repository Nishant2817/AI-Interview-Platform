import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import LogoIcon from "../components/LogoIcon";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        token,
        new_password: newPassword,
      });

      toast.success("Password Reset Successfully 🚀");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.detail || "Password reset failed");
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

                <p className="text-white-400">
                  Practice smarter. Get hired faster.
                </p>
              </div>
            </div>

            <h1 className="mt-10 text-6xl font-bold leading-tight">
              Create
              <span className="block bg-linear-to-r from-emerald-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                New Password
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-white-400">
              Create a strong password to keep your account secure and continue
              your interview preparation journey.
            </p>

            <div className="mt-10 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-emerald-400/30 hover:translate-x-2">
                🔒 Strong Password Protection
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-emerald-400/30 hover:translate-x-2">
                🛡 Secure Account Recovery
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-emerald-400/30 hover:translate-x-2">
                🚀 Continue Your Journey
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
              Create your new password below.
            </p>

            <form onSubmit={handleResetPassword} className="mt-10 space-y-6">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-[#111827] px-5 py-4 outline-none transition-all duration-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-[#111827] px-5 py-4 outline-none transition-all duration-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              />

              <button
                type="submit"
                className="w-full rounded-xl border border-emerald-400/50 bg-black/60 py-3 font-semibold tracking-widest uppercase transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]"
              >
                Update Password
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="font-medium text-white transition hover:text-emerald-300"
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
