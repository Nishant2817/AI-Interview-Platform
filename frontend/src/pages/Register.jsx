import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock} from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Register() {

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [errors, setErrors] = useState({});

const navigate = useNavigate();

// ── Validation ────────────────────────────────────────────────────────────
const validate = () => {
  const newErrors = {};

  // Name: required, letters & spaces only, min 2 chars
  const trimmedName = name.trim();
  if (!trimmedName) {
    newErrors.name = "Full name is required.";
  } else if (trimmedName.length < 2) {
    newErrors.name = "Name must be at least 2 characters.";
  } else if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
    newErrors.name = "Name can only contain letters and spaces.";
  }

  // Email: required + valid format (lowercased)
  const trimmedEmail = email.trim().toLowerCase();
  const emailRegex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/;
  if (!trimmedEmail) {
    newErrors.email = "Email address is required.";
  } else if (!emailRegex.test(trimmedEmail)) {
    newErrors.email = "Enter a valid email address (e.g. user@example.com).";
  }

  // Password: required, min 6 chars
  if (!password) {
    newErrors.password = "Password is required.";
  } else if (password.length < 6) {
    newErrors.password = "Password must be at least 6 characters.";
  }

  // Confirm password
  if (!confirmPassword) {
    newErrors.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleRegister = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    await api.post("/auth/register", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    toast.success("Registration Successful!");
    navigate("/login");
  } catch (error) {
    toast.error(error.response?.data?.detail || "Registration failed");
  }
};
return (
  <div className="relative min-h-screen overflow-hidden bg-[#0B1020] text-white">
    {/* Background Effects */}
    <div className="absolute inset-0">
      <div className="absolute top-0 right-0 h-[600px] w-[00px] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute top-0 left-1/3 h-full w-96 bg-gradient-to-b from-blue-400/20 via-transparent to-transparent blur-3xl rotate-12" />

      {/* Bright Sun Source */}
      <div className="absolute -top-32 left-1/2 h-[350px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      {/* Main Rays */}
      <div className="absolute top-0 left-[25%] h-[1000px] w-[60px] rotate-[18deg] bg-gradient-to-b from-blue-300/25 to-transparent blur-[30px]" />

      <div className="absolute top-0 left-[35%] h-[1000px] w-[80px] rotate-[12deg] bg-gradient-to-b from-blue-300/30 to-transparent blur-[30px]" />

      <div className="absolute top-0 left-[43%] h-[1000px] w-[100px] rotate-[6deg] bg-gradient-to-b from-blue-300/35 to-transparent blur-[45px]" />

      <div className="absolute top-0 left-1/2 h-[1000px] w-[80px] -translate-x-1/2 bg-gradient-to-b from-blue-200/40 to-transparent blur-[25px]" />

      <div className="absolute top-0 left-[57%] h-[1000px] w-[100px] -rotate-[6deg] bg-gradient-to-b from-blue-300/35 to-transparent blur-[35px]" />

      <div className="absolute top-0 left-[65%] h-[1000px] w-[80px] -rotate-[12deg] bg-gradient-to-b from-blue-300/30 to-transparent blur-[35px]" />

      <div className="absolute top-0 left-[75%] h-[1000px] w-[60px] -rotate-[18deg] bg-gradient-to-b from-blue-300/25 to-transparent blur-[30px]" />

      <div className="absolute top-0 left-0 right-0 h-[250px] bg-gradient-to-b from-blue-300/10 via-blue-300/5 to-transparent blur-[30px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_50%)]" />
    </div>

    <div className="relative grid min-h-screen lg:grid-cols-2">
      {/* LEFT SIDE - SIGNUP FORM */}
      <div className="flex items-center justify-center p-10">
        <div className="relative w-full max-w-md rounded-[36px] border border-white/10 bg-[#172033]/90 backdrop-blur-md p-10 shadow-[0_0_80px_rgba(59,130,246,0.15)] before:absolute before:inset-0 before:rounded-[36px] before:bg-gradient-to-br before:from-blue-500/10 before:to-transparent before:pointer-events-none">
          <h2 className="text-center text-5xl font-bold bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent ">
            Create Account
          </h2>
          <p className="mt-4 text-center text-gray-400">
            Join thousands of candidates and kickstart your interview journey
          </p>

          {/* Form  */}
          <form onSubmit={handleRegister} className="mt-8 space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                  className={`w-full rounded-xl border bg-[#111827] pl-10 py-2 outline-none transition-all focus:shadow-[0_0_20px_rgba(16,185,129,0.25)] ${errors.name ? "border-red-500 focus:border-red-500" : "border-emerald-500/30 focus:border-emerald-500"}`}
                />
              </div>
              {errors.name && <p className="mt-1 pl-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value.toLowerCase()); setErrors((p) => ({ ...p, email: "" })); }}
                  className={`w-full rounded-xl border bg-[#111827] pl-10 py-2 outline-none transition-all focus:shadow-[0_0_20px_rgba(16,185,129,0.25)] ${errors.email ? "border-red-500 focus:border-red-500" : "border-emerald-500/30 focus:border-emerald-500"}`}
                />
              </div>
              {errors.email && <p className="mt-1 pl-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                  className={`w-full rounded-xl border bg-[#111827] pl-10 py-2 outline-none transition-all focus:shadow-[0_0_20px_rgba(16,185,129,0.25)] ${errors.password ? "border-red-500 focus:border-red-500" : "border-emerald-500/30 focus:border-emerald-500"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-1 text-gray-400 hover:text-emerald-400 transition-colors duration-200 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 pl-1 text-xs text-red-400">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: "" })); }}
                  className={`w-full rounded-xl border bg-[#111827] pl-10 py-2 outline-none transition-all focus:shadow-[0_0_20px_rgba(16,185,129,0.25)] ${errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-emerald-500/30 focus:border-emerald-500"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-1 text-gray-400 hover:text-emerald-400 transition-colors duration-200 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 pl-1 text-xs text-red-400">{errors.confirmPassword}</p>}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                required
                className="h-4 w-4 accent-emerald-500"
              />
              <span>I agree to the Terms & Conditions</span>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl border border-emerald-500/50 bg-black/60 py-2 font-semibold tracking-widest uppercase transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
            >
              Sign Up
            </button>
            <div className="my-2 flex items-center">
              <div className="h-px flex-1 bg-white/10"></div>
              <span className="px-4 text-gray-400 text-sm">OR</span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            <div className="flex justify-center gap-8 mt-2 text-4xl">
              {/* Google */}
              <FcGoogle
                className="cursor-pointer hover:scale-110 transition-all"
                onClick={() =>
                  (window.location.href =
                    "http://127.0.0.1:8000/auth/google/login")
                }
              />

              {/* Facebook */}
              <FaFacebook
                className="text-blue-500 cursor-pointer hover:scale-110 transition-all"
                onClick={() => {
                  toast.success("Facebook Login Coming Soon");
                }}
              />

              {/* GitHub */}
              <FaGithub
                className="cursor-pointer hover:scale-110 transition-all"
                onClick={() => {
                  toast.success("GitHub Login Coming Soon");
                }}
              />
            </div>
            <p className="mt-6 text-center text-gray-400">
              Already have an account?
              <Link
                to="/login"
                className="ml-2 text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - PLATFORM INFO */}
      <div className="hidden lg:flex flex-col justify-center px-20">
        <p className="text-emerald-100 tracking-[8px] uppercase">
          START YOUR JOURNEY WITH
        </p>

        <h1 className="mt-3 text-5xl font-bold bg-linear-to-r from-emerald-200 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
          PrepForge 
        </h1>

        <div className="mt-4 h-1 w-24 rounded-full bg-emerald-500"></div>

        <p className="mt-8 text-xl text-gray-300 max-w-xl">
          Create your account and unlock personalized interview preparation
          powered by AI.
        </p>
        <div className="mt-12 flex flex-col gap-4">
          {/* Card 1 */}
          <div className=" group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-emerald-400/30 hover:shadow-[0_20px_60px_rgba(16,185,129,0.15)]">
            <h3 className="relative text-lg font-semibold text-white">
              🎯 Personalized Roadmap
            </h3>

            <p className="relative mt-2 text-sm text-gray-300">
              Get a customized preparation plan based on your goals.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-emerald-400/30 hover:shadow-[0_20px_60px_rgba(16,185,129,0.15)]">
            <h3 className="relative text-lg font-semibold text-white">
              📈 Skill Growth Tracking
            </h3>

            <p className="relative mt-2 text-sm text-gray-300">
              Monitor progress and improve weak areas.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-emerald-400/30 hover:shadow-[0_20px_60px_rgba(16,185,129,0.15)]">
            <h3 className="relative text-lg font-semibold text-white">
              🤖 AI Feedback Engine
            </h3>

            <p className="relative mt-2 text-sm text-gray-300">
              Receive instant feedback after every mock interview.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]">
            <h3 className="relative text-lg font-semibold text-white">
              🏆 Dream Company Preparation
            </h3>

            <p className="relative mt-2 text-sm text-gray-300">
              Prepare specifically for companies like Google, Amazon, Microsoft
              and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
