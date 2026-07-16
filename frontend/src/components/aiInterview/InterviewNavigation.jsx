export default function InterviewNavigation({
  currentIndex,
  total,
  answers,
  questions,
  onPrev,
  onNext,
  onJump,
  onSubmit,
}) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;
  const answeredCount = Object.keys(answers).filter((k) => answers[k]).length;

  return (
    <div className="space-y-4">
      {/* Question Navigator Panel */}
      <div className="rounded-2xl border border-white/10 bg-white/4 p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Navigator
          </p>
          <span className="text-xs text-emerald-400 font-medium">
            {answeredCount}/{total} done
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onJump(idx)}
                title={`Q${idx + 1}${isAnswered ? " · Answered" : " · Not answered"}`}
                className={`relative flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold
                  transition-all duration-200
                  ${
                    isCurrent
                      ? "scale-110 bg-emerald-500 text-black shadow-md shadow-emerald-500/40"
                      : isAnswered
                      ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                      : "border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200"
                  }`}
              >
                {idx + 1}
                {isAnswered && !isCurrent && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-[#050816]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded bg-emerald-500" />
            Current
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded border border-emerald-500/40 bg-emerald-500/15" />
            Answered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded border border-white/10 bg-white/5" />
            Skipped
          </span>
        </div>
      </div>

      {/* Prev / Next Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10
            bg-white/5 py-3 text-sm font-semibold text-white transition-all duration-200
            hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Prev
        </button>

        {!isLast ? (
          <button
            type="button"
            onClick={onNext}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600
              py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/20
              transition-all duration-200 hover:bg-emerald-500 hover:shadow-emerald-500/30"
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl
              bg-linear-to-r from-emerald-600 to-teal-500 py-3 text-sm font-bold text-white
              shadow-md shadow-emerald-500/20 transition-all duration-200
              hover:from-emerald-500 hover:to-teal-400 hover:shadow-emerald-500/30"
          >
            Submit ✓
          </button>
        )}
      </div>

      {/* Early Submit — shown on all questions except the last */}
      {!isLast && (
        <button
          type="button"
          onClick={onSubmit}
          className="w-full rounded-xl border border-emerald-500/20 bg-emerald-500/5
            py-2.5 text-xs font-semibold text-emerald-400 transition-all duration-200
            hover:border-emerald-500/40 hover:bg-emerald-500/15"
        >
          Submit Interview Early
        </button>
      )}

      {/* Stats Card */}
      <div className="rounded-xl border border-white/10 bg-white/3 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Progress
        </p>
        <div className="space-y-1 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>Answered</span>
            <span className="font-semibold text-emerald-400">
              {answeredCount} / {total}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Skipped</span>
            <span className="font-semibold text-yellow-400">
              {total - answeredCount}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Completion</span>
            <span className="font-semibold text-white">
              {Math.round((answeredCount / total) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
