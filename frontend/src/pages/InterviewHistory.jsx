import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {FaGoogle, FaAmazon , FaApple ,FaMicrosoft,} from "react-icons/fa";

export default function InterviewHistory() {

const [sessions, setSessions] = useState([]);

useEffect(() => {
fetchHistory();
}, []);

const fetchHistory = async () => {
try {
const response = await api.get("/ai-interview/history");

setSessions(response.data);
    } catch (error) {
    console.error(error);
    toast.error("Failed to load history");
    }
  };
  const getCompanyLogo = (company) => {
    switch (company.toLowerCase()) {
      case "google":
        return <FaGoogle className="text-3xl text-red-500" />;

      case "amazon":
        return <FaAmazon className="text-3xl text-orange-400" />;

      case "microsoft":
        return <FaMicrosoft className="text-3xl text-blue-500" />;

      case "apple":
        return <FaApple className="text-3xl text-gray-200" />;

      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 font-bold">
            {company.charAt(0)}
          </div>
        );
    }
  };

return (
  <div className="flex min-h-screen bg-[#050816] text-white">
    <Sidebar  />

    <div className="ml-64 flex-1 p-8">
      <Navbar title="Interview History"  />

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="mb-6 text-3xl font-bold">Previous Interviews</h2>

        {sessions.length === 0 ? (
          <p className="text-gray-400">No interview history found.</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="rounded-2xl border border-white/10 p-5"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">
                      Session #{session.id}
                    </h3>

                    <div className="mt-4 flex items-center gap-4">
                      {getCompanyLogo(session.company_name)}

                      <div>
                        <p className="text-xl font-semibold">
                          {session.company_name}
                        </p>

                        <p className="text-sm text-gray-400">
                          Technical Interview
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                        session.status === "completed"
                          ? "bg-green-500/20 text-green-300"
                          : session.status === "paused"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-400">
                  <p>
                    Started: {new Date(session.started_at).toLocaleString()}
                  </p>

                  {session.completed_at && (
                    <p>
                      Completed:{" "}
                      {new Date(session.completed_at).toLocaleString()}
                    </p>
                  )}
                </div>
                <Link
                  to={`/ai-interview-report/${session.id}`}
                  className="mt-4 inline-block rounded-xl bg-violet-600 px-4 py-2"
                >
                  View Report
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);
}
