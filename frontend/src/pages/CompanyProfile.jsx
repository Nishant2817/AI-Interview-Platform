import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function CompanyProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  
  const [company, setCompany] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchCompany();
    fetchQuestions();
  }, []);

  const fetchCompany = async () => {
    try {
      const response = await api.get(`/companies/${id}`);
      setCompany(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await api.get(`/companies/${id}/questions`);
      setQuestions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050816] text-white">
      <Sidebar  />

      <div className="ml-64 flex-1 p-8">
        <Navbar title="Company Profile"  />

        {!company ? (
          <div className="mt-20 text-center text-gray-400 text-xl">
            Loading company...
          </div>
        ) : (
          <>
            {/* Hero Section */}

            <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-[#111827] via-[#0b1023] to-[#050816] p-10 backdrop-blur-xl">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                {/* Left */}

                <div className="flex items-center gap-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-violet-500/20 text-5xl font-bold text-violet-400">
                    <img
                      src={`/logos/${company.logo}`}
                      alt={company.name}
                      className="h-12 w-12 object-contain"
                    />
                  </div>

                  <div>
                    <h1 className="text-5xl font-bold">{company.name}</h1>

                    <p className="mt-2 text-lg text-violet-300">
                      {company.company_type}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-emerald-300">
                        ⭐ 4.8 / 5 Interview Experience
                      </span>

                      <span className="rounded-full bg-blue-500/20 px-4 py-2 text-blue-300">
                        💼 Hiring Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right */}

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/5 p-5">
                    <p className="text-sm text-gray-400">Headquarters</p>

                    <h3 className="mt-2 font-semibold">
                      {company.headquarters}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-5">
                    <p className="text-sm text-gray-400">{company.founded}</p>

                    <h3 className="mt-2 font-semibold">1998</h3>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-5">
                    <p className="text-sm text-gray-400">Employees</p>

                    <h3 className="mt-2 font-semibold">{company.employees}</h3>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-5">
                    <p className="text-sm text-gray-400">Questions</p>

                    <h3 className="mt-2 font-semibold">{questions.length}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* About Company */}

            <div className="mt-8 rounded-3xl border border-emerald-500/20 bg-white/5 p-8 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">📖 About {company.name}</h2>

                <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm text-emerald-300">
                  Company Overview
                </span>
              </div>

              <p className="mt-6 leading-8 text-lg text-gray-300">
                {company.description}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="font-semibold text-violet-400">
                    🌐 Official Website
                  </h3>

                  <p className="mt-3 text-gray-300">
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 hover:underline"
                    >
                      {company.website}
                    </a>
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="font-semibold text-violet-400">
                    💼 Common Roles
                  </h3>

                  <p className="mt-3 text-gray-300">
                    Software Engineer • Frontend • Backend • Full Stack • SDE
                  </p>
                </div>
              </div>
            </div>

            {/* Categories */}

            <div className="mt-8 rounded-3xl border border-violet-500/20 bg-white/5 p-8 backdrop-blur-xl">
              <h2 className="text-3xl font-bold">
                🎯 Choose Interview Category
              </h2>

              <p className="mt-3 text-gray-400">
                Select a category to start practicing company-specific interview
                questions.
              </p>

              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <div className="group cursor-pointer rounded-3xl border border-blue-500/20 bg-white/5 p-8 transition-all hover:-translate-y-2 hover:border-blue-400">
                  <div className="text-5xl">💻</div>

                  <h3 className="mt-5 text-3xl font-bold">Technical</h3>

                  <p className="mt-3 text-gray-400">
                    DSA • OOPS • DBMS • OS • SQL • Coding
                  </p>

                  <button
                    onClick={() => navigate(`/company/${id}/questions/1`)}
                    className="mt-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold"
                  >
                    Practice →
                  </button>
                </div>

                <div className="group cursor-pointer rounded-3xl border border-green-500/20 bg-white/5 p-8 transition-all hover:-translate-y-2 hover:border-green-400">
                  <div className="text-5xl">👨‍💼</div>

                  <h3 className="mt-5 text-3xl font-bold">HR</h3>

                  <p className="mt-3 text-gray-400">
                    Tell me about yourself • Strengths • Weaknesses
                  </p>

                  <button
                    onClick={() => navigate(`/company/${id}/questions/2`)}
                    className="mt-8 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold"
                  >
                    Practice →
                  </button>
                </div>

                <div className="group cursor-pointer rounded-3xl border border-yellow-500/20 bg-white/5 p-8 transition-all hover:-translate-y-2 hover:border-yellow-400">
                  <div className="text-5xl">🧠</div>

                  <h3 className="mt-5 text-3xl font-bold">Behavioral</h3>

                  <p className="mt-3 text-gray-400">
                    Leadership • Teamwork • Conflict • STAR Method
                  </p>

                  <button
                    onClick={() => navigate(`/company/${id}/questions/3`)}
                    className="mt-8 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 font-semibold"
                  >
                    Practice →
                  </button>
                </div>

                <div className="group cursor-pointer rounded-3xl border border-pink-500/20 bg-white/5 p-8 transition-all hover:-translate-y-2 hover:border-pink-400">
                  <div className="text-5xl">📚</div>

                  <h3 className="mt-5 text-3xl font-bold">Non Technical</h3>

                  <p className="mt-3 text-gray-400">
                    Aptitude • Reasoning • Communication • General
                  </p>

                  <button
                    onClick={() => navigate(`/company/${id}/questions/4`)}
                    className="mt-8 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-3 font-semibold"
                  >
                    Practice →
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
