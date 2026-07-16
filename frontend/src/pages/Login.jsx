import { useState } from "react";
import api from "../services/api";
import { FcGoogle } from "react-icons/fc";
import { FaRobot } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import LogoIcon from "../components/LogoIcon";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();

try {
  const response = await api.post("/auth/login", {
  email,
  password,
  });

  console.log(response.data);

  localStorage.setItem("access_token", response.data.access_token);
  localStorage.setItem("refresh_token", response.data.refresh_token);
  localStorage.setItem("role", response.data.role);
  toast.success("Login Successful!");
  navigate("/dashboard", { replace: true });
} catch (error) {
  console.error(error);

  toast.error("Invalid Email or Password");
}
  };

return (
  <div className="relative min-h-screen overflow-hidden bg-[#0B1020] text-white">
  {/* Background Glow Effects */}
  <div className="absolute inset-0">
  <div className="absolute top-0 left-1/4 h-125 w-125 rounded-full bg-violet-600/20 blur-[150px]" />
  <div className="absolute bottom-0 right-1/4 h-125 w-125 rounded-full bg-blue-600/20 blur-[150px]" />
  </div>
  <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-2">

  <div className="flex flex-col justify-center px-8 py-10 lg:px-16 lg:py-0">
  <div className="max-w-xl mx-auto lg:mx-0 w-full">
  <div className="mb-6 flex items-center gap-3">
  <LogoIcon size={48} />

  <div>
  <p className="text-3xl lg:text-4xl font-semibold text-emerald-500">PrepForge</p>

  <p className="text-sm text-gray-400">
  Practice smarter. Get hired faster.
  </p>
  </div>
  </div>
  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
  Crack Your
  <span className="block bg-linear-to-r from-emerald-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
  Dream Job
  </span>
  </h1>

  <p className="mt-4 lg:mt-6 text-gray-400 text-base lg:text-lg">
  AI-powered interview preparation platform to help you practice
  interviews, analyze resumes and get instant feedback.
  </p>

  <div className="mt-6 lg:mt-8 flex flex-col gap-3">
  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 lg:p-4 transition-all duration-300 hover:border-emerald-400/30 hover:bg-white/10 shadow-lg shadow-emerald-500/50 hover:translate-x-2 hover:scale-[1.02]">
  <FaRobot />
  <span>Continue Mock Interviews</span>
  </div>

  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 lg:p-4 transition-all duration-300 hover:border-emerald-400/30 hover:bg-white/10 shadow-lg shadow-emerald-500/50 hover:translate-x-2 hover:scale-[1.02]">
  <FaFileAlt />
  <span>Track Your Progress</span>
  </div>

  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 lg:p-4 transition-all duration-300 hover:border-emerald-400/30 hover:bg-white/10 shadow-lg shadow-emerald-500/50 hover:translate-x-2 hover:scale-[1.02]">
  <FaChartLine />
  <span>Get AI Feedback</span>
  </div>
  </div>
  </div>
  </div>

  {/* Right Side — Login Form */}
  <div className="relative flex items-center justify-center p-6">
  {/* Vertical Light Rays */}
  <div className="absolute inset-0 overflow-hidden">
  <div className="absolute left-[20%] top-0 h-full w-24 bg-blue-500/10 blur-3xl"></div>

  <div className="absolute left-[40%] top-0 h-full w-16 bg-violet-500/10 blur-3xl"></div>

  <div className="absolute right-[25%] top-0 h-full w-20 bg-blue-400/10 blur-3xl"></div>
  </div>

  <div className="relative w-full max-w-md rounded-[18px] border border-white/10 bg-black/30 backdrop-blur-2xl p-8 shadow-[0_0_120px_rgba(59,130,246,0.35)]">
  <h2 className="text-center text-5xl font-bold">
  Welcome
  <span className="text-emerald-400">Back</span>
  </h2>

  <p className="text-center text-white-400 mt-2">
  Login to continue your journey
  </p>

  <form onSubmit={handleLogin} className="mt-8 space-y-5">
  <input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full rounded-2xl border border-white/10 bg-[#111827]  px-4 py-3 outline-none transition-all duration-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
  />
  <div className="relative">
  <input
  type={showPassword ? "text" : "password"}
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full rounded-2xl border border-white/10 bg-[#111827]  px-4 py-3 pr-12 outline-none transition-all duration-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
  />

    <button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
  >
  {showPassword ? (
  <FaEyeSlash size={18} />
  ) : (
  <FaEye size={18} />
  )}
  </button>
  </div>
  <div className="flex items-center gap-2 text-sm text-gray-300">
  <input type="checkbox" className="accent-emerald-500" />

  <span>Remember Me</span>
  </div>

  <div className="text-right">
  <Link
  to="/forgot-password"
  className="text-sm text-emerald-400 hover:text-emerald-300"
  >
  Forgot Password?
  </Link>
  </div>

  <button
  type="submit"
  className="w-full rounded-xl border border-emerald-400/50 bg-black/60 py-3 font-semibold tracking-widest uppercase transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]"
  >
  Login
  </button>
  </form>

  <div className="my-6 text-center text-white-500">OR</div>

  <div className="flex justify-center gap-8 mt-6 text-4xl">
  <FcGoogle
  className="cursor-pointer hover:scale-110 transition-all"
  onClick={() => {
  window.location.href =
  "http://127.0.0.1:8000/auth/google/login";
  }}
  />

  <FaFacebook className="text-blue-500 cursor-pointer hover:scale-110 transition-all" />

  <FaGithub className="cursor-pointer hover:scale-110 transition-all" />
  </div>

  <p className="mt-6 text-center text-gray-400">
  Don't have an account?
  <Link
  to="/signup"
  className="ml-2 text-emerald-400 hover:text-emerald-300"
  >
  Sign Up
  </Link>
  </p>

  <div className="mt-8 flex justify-center gap-6 text-xs text-gray-500 hover:text-white">
  <span>Terms</span>
  <span>Contact</span>
  <span>Privacy</span>
  </div>
  </div>
  </div>
  </div>
  </div>
  );
}
