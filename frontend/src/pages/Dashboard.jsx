import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFileUpload,
  FaMicrophone,
  FaChartLine,
  FaHistory,
  FaGoogle,
  FaAmazon,
  FaMicrosoft,
  FaApple,
} from "react-icons/fa";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total_interviews: 0,
    completed_interviews: 0,
    average_score: 0,
    best_score: 0,
    resume_uploaded: false,
  });
  const [recentInterviews, setRecentInterviews] = useState([]);

  const navigate = useNavigate();

  const getMotivation = (score) => {
    if (score >= 8) {
      return {
        title: "🌟 Excellent Work!",
        message:
          "You're consistently performing at a high level. Keep challenging yourself with harder interview questions.",
        border: "border-green-500/30",
        bg: "bg-green-500/10",
        text: "text-green-400",
      };
    }

    if (score >= 5) {
      return {
        title: "🚀 Good Progress!",
        message:
          "You're improving steadily. Focus on explaining your thought process and optimizing your solutions.",
        border: "border-yellow-500/30",
        bg: "bg-yellow-500/10",
        text: "text-yellow-400",
      };
    }

    return {
      title: "Keep Practicing!",
      message:
        "Every interview is a learning opportunity. Strengthen your DSA fundamentals and communication skills.",
      border: "border-red-500/30",
      bg: "bg-red-500/10",
      text: "text-red-400",
    };
  };
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return {
        greeting: "☀️ Good Morning",
        message: "A fresh start! Let's ace today's interview.",
      };
    }

    if (hour < 17) {
      return {
        greeting: "🌤 Good Afternoon",
        message: "Keep the momentum going with another mock interview.",
      };
    }

    return {
      greeting: "🌙 Good Evening",
      message: "End your day with one more interview practice.",
    };
  };

  const motivation =
    recentInterviews.length > 0
      ? getMotivation(recentInterviews[0].score)
      : null;
  const greeting = getGreeting();

  const getCompanyLogo = (company) => {
    switch (company?.toLowerCase()) {
      case "google":
        return <FaGoogle className="text-4xl text-red-500" />;

      case "amazon":
        return <FaAmazon className="text-4xl text-orange-400" />;

      case "microsoft":
        return <FaMicrosoft className="text-4xl text-blue-500" />;

      case "apple":
        return <FaApple className="text-4xl text-gray-300" />;

      default:
        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold">
            {company?.charAt(0)}
          </div>
        );
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/profile");
        setUser(response.data.user);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        setStats(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRecentInterviews = async () => {
      try {
        const response = await api.get("/dashboard/recent-ai-interviews");
        setRecentInterviews(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
    fetchStats();
    fetchRecentInterviews();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#050816] text-white">
      <Sidebar  />
      <div className="ml-64 flex-1 p-8">
        <Navbar title="Dashboard"  />
        {/* Main Content */}
        <div className="flex-1 p-10">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold">
            {greeting.greeting},
              <span className="ml-3 bg-linear-to-r from-emerald-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {user?.name || "Nishant Pandey"}
              </span>
              👋
            </h1>

            <p className="mt-3 text-lg text-white-400">
              {greeting.message}</p>
          </div>

          {/* Today's Goal */}
          <div className="mb-10 rounded-3xl border border-violet-500/20 bg-white/5 p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">🎯 Today's Goal</h2>

                <p className="mt-2 text-gray-400">
                  Complete 2 mock interviews today
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-400">Progress</p>

                <h2 className="text-3xl font-bold text-emerald-400">1 / 2</h2>
              </div>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                style={{ width: "50%" }}
              />
            </div>
          </div>

          {/* Continue Interview */}
          <div className="mb-10 rounded-3xl border border-emerald-500/20 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-emerald-400">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">▶ Continue Your Journey</h2>

                <p className="mt-3 text-gray-400">
                  Ready for another AI-powered mock interview?
                </p>
              </div>

              <button
                onClick={() => navigate("/ai-interview")}
                className="rounded-xl border border-emerald-400/50 bg-black/60 px-8 py-3 font-semibold tracking-widest uppercase transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] cursor-pointer"
              >
                Start Interview →
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold">⚡ Quick Actions</h2>

            <p className="mt-2 text-gray-400">
              Access the most frequently used features.
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {/* Resume Upload */}
            <div
              className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
              onClick={() => navigate("/resume-upload")}
            >
              <FaFileUpload size={28} className="mb-5 text-violet-400" />

              <h2 className="mt-4 text-2xl font-semibold">Resume Upload</h2>

              <p className="mt-3 text-gray-400">
                Upload and analyze your resume.
              </p>
            </div>

            {/* Mock Interview */}
            <div
              className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
              onClick={() => navigate("/ai-interview")}
            >
              <FaMicrophone size={28} className="mb-5 text-pink-400" />

              <h2 className="mt-4 text-2xl font-semibold">Mock Interview</h2>

              <p className="mt-3 text-gray-400">
                Practice AI-powered interviews.
              </p>
            </div>

            {/* Progress */}
            <div
              className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
              onClick={() => navigate("/progress")}
            >
              <FaChartLine size={28} className="mb-5 text-green-400" />

              <h2 className="mt-4 text-2xl font-semibold">Progress Tracking</h2>

              <p className="mt-3 text-gray-400">
                Track your performance and improvement.
              </p>
            </div>

            {/* History */}
            <div
              className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
              onClick={() => navigate("/interview-history")}
            >
              <FaHistory size={28} className="mb-5 text-yellow-400" />

              <h2 className="mt-4 text-2xl font-semibold">Interview History</h2>

              <p className="mt-3 text-gray-400">
                Review previous interview sessions.
              </p>
            </div>
          </div>

          {/* Latest Interview */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold">📝 Latest Interview</h2>

            <p className="mt-2 text-gray-400">
              Review your most recent interview session.
            </p>
          </div>

          {recentInterviews.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <p className="text-gray-400">No interview completed yet.</p>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-emerald-400">
              <div className="flex items-start justify-between">
                {/* Left Side */}
                <div>
                  <div className="flex items-center gap-4">
                    {getCompanyLogo(recentInterviews[0].company)}

                    <div>
                      <h3 className="text-3xl font-bold">
                        {recentInterviews[0].company}
                      </h3>

                      <p className="mt-1 text-gray-400">Latest AI Interview</p>
                    </div>
                  </div>

                  <p className="mt-3 text-gray-400">
                    📅 {recentInterviews[0].date}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-400">
                      🎯 Score {recentInterviews[0].score}/10
                    </span>

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
                        ["completed", "evaluated"].includes(recentInterviews[0].status)
                          ? "bg-green-500/20 text-green-400"
                          : recentInterviews[0].status === "paused"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {recentInterviews[0].status}
                    </span>
                  </div>
                </div>

                {/* Right Side */}
                <button
                  onClick={() =>
                    navigate(
                      `/ai-interview-report/${recentInterviews[0].session_id}`,
                    )
                  }
                  className="rounded-xl border border-emerald-400/50 bg-black/60 px-6 py-3 font-semibold tracking-widest uppercase transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]"
                >
                  View Report →
                </button>
              </div>

              {/* AI Coach */}
              {motivation && (
                <div
                  className={`mt-8 rounded-3xl border ${motivation.border} ${motivation.bg} p-4 backdrop-blur-xl`}
                >
                  <h2 className={`text-2xl font-bold ${motivation.text}`}>
                    {motivation.title}
                  </h2>

                  <p className="mt-4 text-lg leading-8 text-gray-300">
                    {motivation.message}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
