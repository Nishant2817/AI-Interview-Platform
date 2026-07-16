import { useEffect, useRef, useState } from "react";
import { FaClock } from "react-icons/fa";

export default function InterviewTimer({ totalSeconds, isPaused, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const intervalRef = useRef(null);
  const onTimeUpRef = useRef(onTimeUp);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (isPaused) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isPaused]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percent = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0;

  const getColorClass = () => {
    if (percent > 50) return "text-emerald-400";
    if (percent > 20) return "text-yellow-400";
    return "text-red-400";
  };

  const getContainerClass = () => {
    if (percent > 50)
      return "border-emerald-500/30 bg-emerald-500/10";
    if (percent > 20)
      return "border-yellow-500/30 bg-yellow-500/10";
    return "border-red-500/30 bg-red-500/10 animate-pulse";
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-4 py-2 transition-all duration-700 ${getContainerClass()}`}
    >
      <FaClock className={`text-xs ${getColorClass()}`} />
      <span
        className={`font-mono text-lg font-bold tabular-nums leading-none ${getColorClass()}`}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
