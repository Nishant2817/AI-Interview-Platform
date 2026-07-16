export default function MCQQuestion({ question, selectedAnswer, onAnswerChange }) {
  return (
    <div className="mt-5 space-y-3">
      {question.options.map((option, idx) => {
        const isSelected = selectedAnswer === option;
        const optionLabel = String.fromCharCode(65 + idx); // A, B, C, D

        return (
          <button
            key={idx}
            type="button"
            onClick={() => onAnswerChange(question.id, option)}
            className={`group w-full flex items-center gap-4 rounded-xl border p-4 text-left
              transition-all duration-200 ease-in-out
              ${
                isSelected
                  ? "border-emerald-500/60 bg-emerald-500/10 shadow-md shadow-emerald-500/10"
                  : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/[0.07]"
              }`}
          >
            {/* Option Letter Badge */}
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2
                text-sm font-bold transition-all duration-200
                ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500 text-black"
                    : "border-white/20 text-gray-400 group-hover:border-white/40 group-hover:text-gray-200"
                }`}
            >
              {optionLabel}
            </span>

            {/* Option Text */}
            <span
              className={`flex-1 text-sm leading-relaxed transition-colors duration-200
                ${isSelected ? "font-medium text-white" : "text-gray-300 group-hover:text-white"}`}
            >
              {option}
            </span>

            {/* Selected Indicator */}
            {isSelected && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                <svg
                  className="h-3 w-3 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
