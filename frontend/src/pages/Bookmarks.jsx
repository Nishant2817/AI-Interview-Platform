import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Bookmarks() {
  
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await api.get("/bookmarks");

      setBookmarks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050816] text-white">
      <Sidebar  />

      <div className="ml-64 flex-1 p-8">
        <Navbar title="Bookmarks"  />

        <div className="grid gap-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <h2 className="font-semibold">
                Question ID: {bookmark.question_id}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
