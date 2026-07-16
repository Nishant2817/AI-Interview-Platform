import { FaHome, FaUser, FaFileUpload, FaChartLine, FaSignOutAlt, FaStar, FaBook, FaVideo, FaHistory, FaBrain } from "react-icons/fa";
import LogoIcon from "./LogoIcon";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/profile");
      setUser(response.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Stay Logged In",
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

    if (result.isConfirmed) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      toast.success("Logged out successfully 👋");
      navigate("/");
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Resume Upload", icon: <FaFileUpload />, path: "/resume-upload" },
    { name: "Progress", icon: <FaChartLine />, path: "/progress" },
    { name: "Question Bank", icon: <FaBook />, path: "/questions" },
    { name: "Bookmarks", icon: <FaStar />, path: "/bookmarks" },
    { name: "AI Interview", icon: <FaBrain />, path: "/ai-interview" },
    { name: "Interview History", icon: <FaHistory />, path: "/interview-history" },
    ...(user?.role === "admin"
      ? [{ name: "Admin Dashboard", icon: <FaUser />, path: "/admin" }]
      : []),
  ];

  return (
    <div className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-white/10 bg-[#0b1020]">
      {/* ── Logo Section ── */}
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <LogoIcon size={36} />
        <div>
          <h2 className="text-lg font-bold text-white">Prep Forge</h2>
          <p className="text-xs text-gray-400">Practice Smarter. Get Hired Faster</p>
        </div>
      </div>

      {/* ── Menu Section ── */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Logout Section ── */}
      <div className="border-t border-white/10 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500 hover:text-white"
        >
          <FaSignOutAlt className="text-lg" />
          Logout
        </button>
      </div>
    </div>
  );
}