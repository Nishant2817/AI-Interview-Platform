import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Progress() {

const [stats, setStats] = useState({
    total_interviews: 0,
    completed_interviews: 0,
    average_score: 0,
    best_score: 0,
});
const [recentInterviews, setRecentInterviews] = useState([]);
const [distribution, setDistribution] = useState({
  excellent: 0,
  average: 0,
  needs_improvement: 0,
});
const totalDistribution =
  distribution.excellent +
  distribution.average +
    distribution.needs_improvement;
  
const [achievements, setAchievements] = useState({
  first_interview: false,
  practice_starter: false,
  consistent_candidate: false,
  high_performer: false,
  interview_master: false,
  resume_ready: false,
});
const [openSection, setOpenSection] = useState(null);
  
const fetchStats = async () => {
    try {
    const response = await api.get("/dashboard/stats");
    setStats(response.data);
    } catch (error) {
    console.error(error);
    toast.error("Failed to load progress stats");
    }
    };
const fetchRecentInterviews = async () => {
    try {
    const response = await api.get("/dashboard/recent-ai-interviews");
    setRecentInterviews(response.data);
    } catch (error) {
    console.error(error);
    toast.error("Failed to load recent interviews");
    }
  };
const fetchDistribution = async () => {
  try {
    const response = await api.get("/dashboard/score-distribution");
    setDistribution(response.data);
  } catch (error) {
    console.error(error);
    toast.error("Failed to load score distribution");
  }
  };
const fetchAchievements = async () => {
  try {
    const response = await api.get("/dashboard/achievements");
    setAchievements(response.data);
  } catch (error) {
    console.error(error);
    toast.error("Failed to load achievements");
  }
};

useEffect(() => {
  fetchStats();
  fetchRecentInterviews();
  fetchDistribution();
  fetchAchievements();
}, []);

return (
  <div className="flex min-h-screen bg-gradient-to-br from-[#050816] via-[#0b1020] to-[#111827] text-white">
    <Sidebar  />

    <div className="ml-64 flex-1 p-8">
      <Navbar title="Progress"  />

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Total Interviews */}
        <div className="rounded-3xl border border-emerald-500/20 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-emerald-400">
          <div className="text-4xl">🎤</div>
          <p className="mt-4 text-gray-400">Total Interviews</p>
          <h2 className="mt-2 text-5xl font-bold text-white">
            {stats.total_interviews}
          </h2>
        </div>

        {/* Completed */}

        <div className="rounded-3xl border border-blue-500/20 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-blue-400">
          <div className="text-4xl">✅</div>

          <p className="mt-4 text-gray-400">Completed</p>

          <h2 className="mt-2 text-5xl font-bold text-white">
            {stats.completed_interviews}
          </h2>
        </div>

        {/* Average */}

        <div className="rounded-3xl border border-yellow-500/20 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-yellow-400">
          <div className="text-4xl">📈</div>
          <p className="mt-4 text-gray-400">Average Score</p>
          <h2 className="mt-2 text-5xl font-bold text-yellow-400">
            {stats.average_score}/10
          </h2>
        </div>

        {/* Best */}

        <div className="rounded-3xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-purple-400">
          <div className="text-4xl">🏆</div>
          <p className="mt-4 text-gray-400">Best Score</p>

          <h2 className="mt-2 text-5xl font-bold text-purple-400">
            {stats.best_score}/10
          </h2>
        </div>
      </div>
      <div className="mt-10 rounded-3xl border border-emerald-500/20 bg-white/5 p-8 backdrop-blur-xl">
        <div
          onClick={() =>
            setOpenSection(openSection === "recent" ? null : "recent")
          }
          className="
    flex
    cursor-pointer
    items-center
    justify-between
    rounded-2xl
    border
    border-emerald-500/20
    bg-white/5
    px-6
    py-5
    transition-all
    hover:border-emerald-400
    hover:bg-white/10
  "
        >
          <div>
            <h2 className="text-2xl font-bold">📈 Recent Performance</h2>

            <p className="mt-1 text-gray-400">
              View your latest interview scores
            </p>
          </div>

          {openSection === "recent" ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </div>

        {openSection === "recent" &&
          (recentInterviews.length === 0 ? (
            <p className="mt-6 text-gray-400">No interviews completed yet.</p>
          ) : (
            <div className="space-y-6">
              {recentInterviews.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-black/20 p-6"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{item.company}</h3>

                      <p className="text-sm text-gray-400">{item.date}</p>
                    </div>

                    <span
                      className={`rounded-full px-4 py-1 text-sm font-semibold ${
                        item.score >= 8
                          ? "bg-green-500/20 text-green-300"
                          : item.score >= 5
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {item.score}/10
                    </span>
                  </div>

                  {/* Progress Bar */}

                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                      style={{
                        width: `${item.score * 10}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
      {/* Score Distribution */}
      <div className="mt-10 rounded-3xl border border-emerald-500/20 bg-white/5 p-8 backdrop-blur-xl">
        <div
          onClick={() =>
            setOpenSection(
              openSection === "distribution" ? null : "distribution",
            )
          }
          className="
    flex
    cursor-pointer
    items-center
    justify-between
    rounded-2xl
    border
    border-emerald-500/20
    bg-white/5
    px-6
    py-5
    transition-all
    hover:border-emerald-400
    hover:bg-white/10
  "
        >
          <div>
            <h2 className="text-2xl font-bold">📊 Score Distribution</h2>

            <p className="mt-1 text-gray-400">
              View your interview score breakdown
            </p>
          </div>

          {openSection === "distribution" ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </div>
        {openSection === "distribution" && (
          <div className="space-y-8 mt-6">
            {/* Excellent */}

            <div>
              <div className="mb-2 flex justify-between">
                <span className="font-medium text-green-400">
                  Excellent (8-10)
                </span>

                <span>{distribution.excellent}</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-700">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{
                    width: totalDistribution
                      ? `${(distribution.excellent / totalDistribution) * 100}%`
                      : "0%",
                  }}
                />
              </div>
            </div>

            {/* Average */}

            <div>
              <div className="mb-2 flex justify-between">
                <span className="font-medium text-yellow-400">Average (5-7)</span>

                <span>{distribution.average}</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-700">
                <div
                  className="h-full rounded-full bg-yellow-500"
                  style={{
                    width: totalDistribution
                      ? `${(distribution.average / totalDistribution) * 100}%`
                      : "0%",
                  }}
                />
              </div>
            </div>

            {/* Needs Improvement */}

            <div>
              <div className="mb-2 flex justify-between">
                <span className="font-medium text-red-400">
                  Needs Improvement (0-4)
                </span>

                <span>{distribution.needs_improvement}</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-700">
                <div
                  className="h-full rounded-full bg-red-500"
                  style={{
                    width: totalDistribution
                      ? `${(distribution.needs_improvement / totalDistribution) * 100}%`
                      : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-10 rounded-3xl border border-emerald-500/20 bg-white/5 p-8 backdrop-blur-xl">
        <div
          onClick={() =>
            setOpenSection(
              openSection === "badges" ? null : "badges",
            )
          }
          className="
    flex
    cursor-pointer
    items-center
    justify-between
    rounded-2xl
    border
    border-emerald-500/20
    bg-white/5
    px-6
    py-5
    transition-all
    hover:border-emerald-400
    hover:bg-white/10
  "
        >
          <div>
            <h2 className="text-2xl font-bold">🏅 Achievement Badges</h2>

            <p className="mt-1 text-gray-400">
              Track your milestones and achievements
            </p>
          </div>

          {openSection === "badges" ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </div>

        {openSection === "badges" && (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {/* First Interview */}

          <div
            className={`rounded-2xl border p-6 transition-all ${
              achievements.first_interview
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-gray-700 bg-white/5 opacity-60"
            }`}
          >
            <div className="text-5xl">🎯</div>

            <h3 className="mt-4 text-xl font-bold">First Interview</h3>

            <p className="mt-2 text-gray-400">Complete your first interview</p>

            <p className="mt-4 font-semibold text-emerald-400">
              {achievements.first_interview ? "Unlocked ✅" : "Locked 🔒"}
            </p>
          </div>

          {/* Practice Starter */}

          <div
            className={`rounded-2xl border p-6 transition-all ${
              achievements.practice_starter
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-gray-700 bg-white/5 opacity-60"
            }`}
          >
            <div className="text-5xl">🥉</div>

            <h3 className="mt-4 text-xl font-bold">Practice Starter</h3>

            <p className="mt-2 text-gray-400">Complete 5 interviews</p>

            <p className="mt-4 font-semibold text-emerald-400">
              {achievements.practice_starter ? "Unlocked ✅" : "Locked 🔒"}
            </p>
          </div>

          {/* Consistent Candidate */}

          <div
            className={`rounded-2xl border p-6 transition-all ${
              achievements.consistent_candidate
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-gray-700 bg-white/5 opacity-60"
            }`}
          >
            <div className="text-5xl">🥈</div>

            <h3 className="mt-4 text-xl font-bold">Consistent Candidate</h3>

            <p className="mt-2 text-gray-400">Complete 10 interviews</p>

            <p className="mt-4 font-semibold text-emerald-400">
              {achievements.consistent_candidate ? "Unlocked ✅" : "Locked 🔒"}
            </p>
          </div>

          {/* High Performer */}

          <div
            className={`rounded-2xl border p-6 transition-all ${
              achievements.high_performer
                ? "border-yellow-500 bg-yellow-500/10"
                : "border-gray-700 bg-white/5 opacity-60"
            }`}
          >
            <div className="text-5xl">⭐</div>

            <h3 className="mt-4 text-xl font-bold">High Performer</h3>

            <p className="mt-2 text-gray-400">Achieve a score of 8+</p>

            <p className="mt-4 font-semibold text-yellow-400">
              {achievements.high_performer ? "Unlocked ✅" : "Locked 🔒"}
            </p>
          </div>

          {/* Interview Master */}

          <div
            className={`rounded-2xl border p-6 transition-all ${
              achievements.interview_master
                ? "border-purple-500 bg-purple-500/10"
                : "border-gray-700 bg-white/5 opacity-60"
            }`}
          >
            <div className="text-5xl">👑</div>

            <h3 className="mt-4 text-xl font-bold">Interview Master</h3>

            <p className="mt-2 text-gray-400">Score a perfect 10/10</p>

            <p className="mt-4 font-semibold text-purple-400">
              {achievements.interview_master ? "Unlocked ✅" : "Locked 🔒"}
            </p>
          </div>

          {/* Resume Ready */}

          <div
            className={`rounded-2xl border p-6 transition-all ${
              achievements.resume_ready
                ? "border-blue-500 bg-blue-500/10"
                : "border-gray-700 bg-white/5 opacity-60"
            }`}
          >
            <div className="text-5xl">📄</div>

            <h3 className="mt-4 text-xl font-bold">Resume Ready</h3>

            <p className="mt-2 text-gray-400">Upload your resume</p>

            <p className="mt-4 font-semibold text-blue-400">
              {achievements.resume_ready ? "Unlocked ✅" : "Locked 🔒"}
            </p>
          </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
}
