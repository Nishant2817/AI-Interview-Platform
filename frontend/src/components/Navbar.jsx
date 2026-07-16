import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function Navbar({ title }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

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
      text: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      background: "#111827",
      color: "#fff",
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem("access_token");
    localStorage.removeItem("role");

    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="mb-8 flex items-center justify-between">
      {/* ── Left: Title ── */}
      <h1 className="text-4xl font-bold">{title}</h1>

      {/* ── Right: User Dropdown ── */}
      <div className="relative shrink-0">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 md:gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 md:px-4 py-2.5 md:py-3 hover:bg-white/10 transition"
        >
          <FaUserCircle className="text-2xl md:text-3xl text-violet-400 shrink-0" />
          {/* Name hidden on small mobile, visible md+ */}
          <span className="hidden sm:block text-sm md:text-base">{user?.name || "User"}</span>
        </button>

        {showDropdown && (
          <div
            className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-[#0b1020] shadow-xl overflow-hidden z-50"
          >
            <button
              onClick={() => { navigate("/profile"); setShowDropdown(false); }}
              className="w-full px-4 py-3 text-left text-sm hover:bg-white/10 transition"
            >
              Profile
            </button>

            <button
              onClick={logout}
              className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
