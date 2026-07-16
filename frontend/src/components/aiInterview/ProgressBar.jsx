export default function ProgressBar({ current, total, answeredCount }) {
  const progressPercent = total > 0 ? ((current + 1) / total) * 100 : 0;
  const answeredPercent = total > 0 ? (answeredCount / total) * 100 : 0;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">
          Question{" "}
          <span className="font-bold text-white">{current + 1}</span> of{" "}
          <span className="font-bold text-white">{total}</span>
        </span>
        <span className="font-medium text-emerald-400">
          {answeredCount}/{total} answered
        </span>
      </div>

      {/* Track */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
        {/* Answered fill (lighter) */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-emerald-500/30 transition-all duration-500"
          style={{ width: `${answeredPercent}%` }}
        />
        {/* Current position fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
