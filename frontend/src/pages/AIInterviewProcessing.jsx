import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../services/api";

export default function AIInterviewProcessing() {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const intervalRef = useRef(null);
  const taskIdRef = useRef(location.state?.task_id || null);

  const [elapsed, setElapsed] = useState(0);
  const [statusMsg, setStatusMsg] = useState("Submitting interview...");

  useEffect(() => {
    // Start elapsed counter
    const elapsedTimer = setInterval(() => setElapsed((s) => s + 1), 1000);

    // Kick off polling
    if (taskIdRef.current) {
      setStatusMsg("AI is evaluating your answers...");
      checkTaskStatus(taskIdRef.current);
    } else {
      // No task_id in state — fall back to DB polling immediately
      setStatusMsg("Checking evaluation status...");
      pollFeedbackDirectly();
    }

    return () => {
      clearInterval(elapsedTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Primary: poll Celery task status ──────────────────────────────────────
  const checkTaskStatus = (taskId) => {
    let attempts = 0;
    const MAX_ATTEMPTS = 60; // 2 minutes

    intervalRef.current = setInterval(async () => {
      attempts++;
      try {
        const res = await api.get(`/ai-interview/task-status/${taskId}`);
        const { status } = res.data;

        if (status === "completed") {
          clearInterval(intervalRef.current);
          navigate(`/ai-interview-report/${sessionId}`);
          return;
        }

        if (status === "failed") {
          clearInterval(intervalRef.current);
          setStatusMsg("AI evaluation failed. Please try again.");
          return;
        }

        // Celery stuck? Switch to DB polling
        if (attempts >= MAX_ATTEMPTS) {
          clearInterval(intervalRef.current);
          setStatusMsg("Taking longer than expected. Checking results...");
          pollFeedbackDirectly();
        }
      } catch {
        // Don't break on network hiccup — keep polling
      }
    }, 2000);
  };

  // ── Fallback: poll the DB feedback endpoint directly ──────────────────────
  const pollFeedbackDirectly = () => {
    let fbAttempts = 0;
    const MAX_FB_ATTEMPTS = 90; // 3 more minutes

    const fbInterval = setInterval(async () => {
      fbAttempts++;
      try {
        const res = await api.get(`/ai-interview/feedback-ready/${sessionId}`);
        if (res.data?.score !== undefined) {
          clearInterval(fbInterval);
          navigate(`/ai-interview-report/${sessionId}`);
        }
      } catch {
        // 404 = not ready yet — keep going
      }

      if (fbAttempts >= MAX_FB_ATTEMPTS) {
        clearInterval(fbInterval);
        setStatusMsg("Report generation timed out. Please check Interview History.");
      }
    }, 2000);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
      <div className="max-w-lg px-6 text-center">
        {/* Pulsing brain icon */}
        <div
          className="mb-2 text-8xl"
          style={{ animation: "pulse 2s ease-in-out infinite" }}
        >
          🤖
        </div>

        {/* Spinning ring */}
        <div className="mb-8 mt-4 flex justify-center">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "4px solid transparent",
              borderTopColor: "#10b981",
              borderRightColor: "#059669",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>

        <h1 className="mb-4 text-4xl font-bold">
          AI is analyzing your interview
        </h1>

        <p className="mb-3 text-lg text-gray-400">{statusMsg}</p>

        <p className="text-sm text-gray-600">⏱ Elapsed: {formatTime(elapsed)}</p>

        <p className="mt-6 text-xs text-gray-700">
          This usually takes 30–90 seconds depending on the number of questions.
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
