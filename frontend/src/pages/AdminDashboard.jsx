import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FaUsers,
  FaBookmark,
  FaQuestionCircle,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { FaEdit, FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  
  const [stats, setStats] = useState({
    total_users: 0,
    total_questions: 0,
    total_bookmarks: 0,
  });
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await api.get("/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecentQuestions = async () => {
    try {
      const response = await api.get("/admin/recent-questions");
      setRecentQuestions(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchQuestions = async () => {
    try {
      const response = await api.get("/questions");
      setQuestions(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const deleteQuestion = async (id) => {
    const result = await Swal.fire({
      title: "Delete Question?",
      text: "This action cannot be undone.",
      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",

      background: "rgba(17,24,39,0.95)",
      color: "#ffffff",

      customClass: {
        popup: "rounded-3xl border border-white/10",
        actions: "swal-actions-gap",
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },

      buttonsStyling: false,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await api.delete(`/questions/${id}`);

      toast.success("Question deleted successfully");

      fetchQuestions();
      fetchStats();
    } catch (error) {
      toast.error("Failed to delete question");

      console.error(error);
    }
  };
  const updateQuestion = async () => {
    try {
      await api.put(`/questions/${selectedQuestion.id}`, selectedQuestion);

      toast.success("Question updated successfully");

      setShowEditModal(false);

      fetchQuestions();
      fetchRecentQuestions();
    } catch (error) {
      toast.error("Failed to update question");

      console.error(error);
    }
  };
  const uploadCSV = async () => {
    try {
      if (!csvFile) {
        toast.error("Please select a CSV file");
        return;
      }

      const formData = new FormData();

      formData.append("file", csvFile);

      await api.post("/admin/questions/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Questions imported successfully");

      setCsvFile(null);

      fetchQuestions();
      fetchStats();
      fetchRecentQuestions();
    } catch (error) {
      toast.error("Failed to import questions");

      console.error(error);
    }
  };
  const removeSelectedFile = () => {
    setCsvFile(null);
  };
  const getCompanyName = (id) => {
    switch (id) {
      case 1:
        return "Google";
      case 2:
        return "Amazon";
      case 3:
        return "Microsoft";
      default:
        return "N/A";
    }
  };
  const getDifficultyName = (id) => {
    switch (id) {
      case 1:
        return "Easy";
      case 2:
        return "Medium";
      case 3:
        return "Hard";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecentQuestions();
    fetchQuestions();
  }, []);

  return (
  <div className="flex min-h-screen bg-linear-to-br from-[#050816] via-[#0b1020] to-[#111827] text-white">
  <Sidebar  />

  <div className="ml-64 flex-1 p-8">
  <Navbar title="Admin Dashboard"  />

  {/* Stats Cards */}
  <div className="grid gap-6 md:grid-cols-3">
  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
  <div className="flex items-center gap-4">
  <div className="rounded-xl bg-violet-500/20 p-4">
  <FaQuestionCircle className="text-2xl text-violet-400" />
  </div>

  <div>
  <p className="text-gray-400">Total Questions</p>

  <h2 className="text-5xl font-bold">{stats.total_questions}</h2>
  </div>
  </div>
  </div>

  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
  <div className="flex items-center gap-4">
  <div className="rounded-2xl bg-blue-500/20 p-4">
  <FaUsers className="text-3xl text-blue-400" />
  </div>

  <div>
  <p className="text-gray-400">Total Users</p>

  <h2 className="text-5xl font-bold">{stats.total_users}</h2>
  </div>
  </div>
  </div>

  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
  <div className="flex items-center gap-4">
  <div className="rounded-2xl bg-green-500/20 p-4">
  <FaBookmark className="text-3xl text-green-400" />
  </div>

  <div>
  <p className="text-gray-400">Bookmarks</p>

  <h2 className="text-5xl font-bold">{stats.total_bookmarks}</h2>
  </div>
  </div>
  </div>
  </div>

  {/* Upload + Recent Questions */}
  <div className="mt-10 grid gap-6 lg:grid-cols-2">
  {/* Upload CSV */}
  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
  <h2 className="mb-6 text-2xl font-bold">Upload Questions CSV</h2>

  <div className="rounded-2xl border-2 border-dashed border-white/10 p-10 text-center">
  <FaCloudUploadAlt className="mx-auto text-5xl text-violet-500" />

  <p className="mt-4 text-lg">Choose CSV file</p>

  <p className="text-gray-400">Only CSV files are allowed</p>
  </div>

  <input
  type="file"
  accept=".csv"
  onChange={(e) => setCsvFile(e.target.files[0])}
  className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 p-3"
  />

  {csvFile && (
  <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
  <span className="text-sm">{csvFile.name}</span>
  <button
  onClick={removeSelectedFile}
  className="text-red-400 hover:text-red-300 text-lg font-bold"
  >
  ✕
  </button>
  </div>
  )}

  <button
  onClick={uploadCSV}
  className=" mt-4 w-full rounded-xl border border-emerald-400/50 bg-black/60 py-3 font-semibold tracking-widest uppercase transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]"
  >
  Upload CSV
  </button>
  </div>

  {/* Recent Questions */}
  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
  <h2 className="mb-6 text-2xl font-bold">Recent Questions</h2>

  <div className="space-y-4">
  {recentQuestions.map((question) => (
  <div
  key={question.id}
  className="rounded-xl border border-white/10 p-4 hover:bg-white/5"
  >
  <div className="flex items-start justify-between">
  <h3 className="font-semibold text-lg">{question.title}</h3>

  <span className="rounded-lg bg-green-500/20 px-3 py-1 text-green-400 text-sm">
  Easy
  </span>
  </div>

  <p className="mt-2 text-gray-400">{question.description}</p>
  </div>
  ))}
  </div>
  </div>
  </div>

  {/* Manage Questions */}
  <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
  <h2 className="mb-6 text-2xl font-bold">Manage Questions</h2>

  <div className="overflow-hidden rounded-2xl border border-white/10">
  <table className="w-full">
  <thead className="bg-white/5">
  <tr>
  <th className="p-4 text-left">ID</th>
  <th className="p-4 text-left">Title</th>
  <th className="p-4 text-left">Actions</th>
  <th className="p-4 text-left">Company</th>
  <th className="p-4 text-left">Difficulty</th>
  </tr>
  </thead>

  <tbody>
  {questions.map((question) => (
  <tr
  key={question.id}
  className="border-t border-white/10 hover:bg-white/5"
  >
  <td className="p-4">{question.id}</td>

  <td className="p-4">{question.title}</td>

  <td className="p-4">
  <div className="flex gap-3">
  <button
  onClick={() => {
  setSelectedQuestion(question);
  setShowEditModal(true);
  }}
  className="flex items-center gap-2 rounded-xl bg-blue-500/20 px-4 py-2 text-blue-300"
  >
  <FaEdit />
  Edit
  </button>

  <button
  onClick={() => deleteQuestion(question.id)}
  className="flex items-center gap-2 rounded-xl bg-red-500/20 px-4 py-2 text-red-300"
  >
  <FaTrash />
  Delete
  </button>
  </div>
  </td>
  <td className="p-4">
  {getCompanyName(question.company_id)}
  </td>
  <td className="p-4">
  <span
  className={`rounded-lg px-3 py-1 text-sm

${
  question.difficulty_id === 1
  ? "bg-green-500/20 text-green-400"
  : question.difficulty_id === 2
  ? "bg-yellow-500/20 text-yellow-400"
  : "bg-red-500/20 text-red-400"
}
    `}
>
{getDifficultyName(question.difficulty_id)}
</span>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>

{showEditModal && selectedQuestion && (
<div className="fixed inset-0 flex items-center justify-center bg-black/60">
<div className='w-150 rounded-3xl bg-[#0b1020] p-6'>
<h2 className="text-2xl font-bold mb-4">Edit Question</h2>

<input
value={selectedQuestion.title}
onChange={(e) =>
setSelectedQuestion({
...selectedQuestion,
title: e.target.value,
})
}
className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
/>

<textarea
value={selectedQuestion.description}
onChange={(e) =>
setSelectedQuestion({
...selectedQuestion,
description: e.target.value,
})
}
className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 p-3"
/>

<textarea
value={selectedQuestion.answer}
onChange={(e) =>
setSelectedQuestion({
...selectedQuestion,
answer: e.target.value,
})
}
className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 p-3"
/>

<div className="mt-6 flex gap-3">
<button
onClick={updateQuestion}
className="rounded-xl bg-green-600 px-4 py-2"
>
Save
</button>

<button
onClick={() => setShowEditModal(false)}
className="rounded-xl bg-gray-700 px-4 py-2"
>
Cancel
</button>
</div>
</div>
          </div>
        )}
      </div>
    </div>
  );
}
