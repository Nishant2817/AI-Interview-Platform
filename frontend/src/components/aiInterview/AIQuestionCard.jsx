import MCQQuestion from "./MCQQuestion";
import TextQuestion from "./TextQuestion";

const DIFFICULTY_STYLES = {
  Easy: "border-green-500/30 bg-green-500/10 text-green-400",
  Medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  Hard: "border-red-500/30 bg-red-500/10 text-red-400",
};

const TYPE_STYLES = {
  mcq: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  text: "border-blue-500/30 bg-blue-500/10 text-blue-400",
};

const TYPE_LABELS = {
  mcq: "Multiple Choice",
  text: "Written Answer",
};

export default function AIQuestionCard({
  question,
  currentIndex,
  total,
  answer,
  onAnswerChange,
}) {
  const diffClass =
    DIFFICULTY_STYLES[question.difficulty] || DIFFICULTY_STYLES.Medium;
  const typeClass = TYPE_STYLES[question.type] || TYPE_STYLES.text;

  return (
    <div className="animate-fadeIn rounded-2xl border border-white/10 bg-white/4 p-6 shadow-xl md:p-8">
      {/* Badges Row */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {/* Question Number */}
        <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
          Q{currentIndex + 1} / {total}
        </span>

        {/* Topic */}
        {question.topic && (
          <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
            {question.topic}
          </span>
        )}

        {/* Difficulty */}
        <span className={`rounded-lg border px-3 py-1 text-xs font-semibold ${diffClass}`}>
          {question.difficulty}
        </span>

        {/* Type */}
        <span className={`ml-auto rounded-lg border px-3 py-1 text-xs font-semibold ${typeClass}`}>
          {TYPE_LABELS[question.type] || question.type}
        </span>
      </div>

      {/* Divider */}
      <div className="mb-5 h-px w-full bg-white/5" />

      {/* Question Text */}
      <h2 className="text-base font-semibold leading-relaxed text-white md:text-lg">
        {question.question}
      </h2>

      {/* Answer Area */}
      {question.type === "mcq" ? (
        <MCQQuestion
          question={question}
          selectedAnswer={answer}
          onAnswerChange={onAnswerChange}
        />
      ) : (
        <TextQuestion
          question={question}
          answer={answer}
          onAnswerChange={onAnswerChange}
        />
      )}
    </div>
  );
}
