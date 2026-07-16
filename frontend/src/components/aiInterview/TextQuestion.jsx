import { useEffect, useRef } from "react";

const MAX_CHARS = 2000;

export default function TextQuestion({ question, answer, onAnswerChange }) {
  const textareaRef = useRef(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(160, el.scrollHeight)}px`;
  };

  useEffect(() => {
    autoResize();
  }, [answer]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      onAnswerChange(question.id, val);
    }
  };

  const charCount = answer?.length || 0;
  const charPercent = (charCount / MAX_CHARS) * 100;

  const getCharColor = () => {
    if (charPercent >= 90) return "text-red-400";
    if (charPercent >= 70) return "text-yellow-400";
    return "text-gray-500";
  };

  return (
    <div className="mt-5 space-y-2">
      {/* Hint */}
      <div className="flex items-center gap-2 rounded-lg bg-blue-500/5 border border-blue-500/20 px-3 py-2">
        <span className="text-blue-400 text-xs">💡</span>
        <p className="text-xs text-blue-300/80">
          Structure your answer clearly. Use examples where applicable.
        </p>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={answer || ""}
        onChange={handleChange}
        onInput={autoResize}
        placeholder="Type your detailed answer here..."
        className="w-full rounded-xl border border-white/10 bg-white/4 p-4 text-white
          placeholder-gray-600 focus:outline-none focus:border-emerald-500/50
          focus:ring-2 focus:ring-emerald-500/20 focus:bg-white/6
          transition-all duration-200 resize-none min-h-40 leading-relaxed text-sm"
      />

      {/* Footer: tip + char count */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600">
          Be concise, clear, and back your points with real-world examples
        </span>
        <span className={`font-mono transition-colors duration-300 ${getCharColor()}`}>
          {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </span>
      </div>

      {/* Char fill bar */}
      {charCount > 0 && (
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full transition-all duration-300
              ${charPercent >= 90
                ? "bg-red-500"
                : charPercent >= 70
                ? "bg-yellow-500"
                : "bg-emerald-500"
              }`}
            style={{ width: `${Math.min(charPercent, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
