import { Finding } from "@/types";
import { useGameStore } from "@/store/useGameStore";
import { Check, AlertCircle } from "lucide-react";

interface FindingCardProps {
  finding: Finding;
  showResult?: boolean;
  isCorrect?: boolean;
}

const categoryColors: Record<Finding["category"], { bg: string; border: string; text: string; badge: string }> = {
  earlyContact: {
    bg: "bg-orange-50",
    border: "border-orange-300",
    text: "text-orange-800",
    badge: "bg-orange-100 text-orange-700",
  },
  deepOverbite: {
    bg: "bg-purple-50",
    border: "border-purple-300",
    text: "text-purple-800",
    badge: "bg-purple-100 text-purple-700",
  },
  crossBite: {
    bg: "bg-rose-50",
    border: "border-rose-300",
    text: "text-rose-800",
    badge: "bg-rose-100 text-rose-700",
  },
  unilateralChewing: {
    bg: "bg-cyan-50",
    border: "border-cyan-300",
    text: "text-cyan-800",
    badge: "bg-cyan-100 text-cyan-700",
  },
  other: {
    bg: "bg-slate-50",
    border: "border-slate-300",
    text: "text-slate-800",
    badge: "bg-slate-100 text-slate-700",
  },
};

const categoryLabels: Record<Finding["category"], string> = {
  earlyContact: "早接触",
  deepOverbite: "深覆合",
  crossBite: "反合",
  unilateralChewing: "偏侧咀嚼",
  other: "其他异常",
};

export const FindingCard = ({ finding, showResult = false, isCorrect }: FindingCardProps) => {
  const { selectedFindings, toggleFinding, isComplete } = useGameStore();
  const isSelected = selectedFindings.includes(finding.id);
  const colors = categoryColors[finding.category];

  const handleClick = () => {
    if (!isComplete && !showResult) {
      toggleFinding(finding.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative p-4 rounded-xl border-2 transition-all duration-200
        ${showResult
          ? isCorrect
            ? "bg-emerald-50 border-emerald-400"
            : "bg-red-50 border-red-400"
          : isSelected
            ? `${colors.bg} ${colors.border} ring-2 ring-blue-400 ring-offset-2`
            : isComplete
              ? "bg-gray-50 border-gray-200 opacity-60"
              : `bg-white border-gray-200 hover:${colors.border} hover:shadow-md cursor-pointer`
        }
      `}
    >
      {!showResult && (
        <div
          className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
            ${isSelected
              ? "bg-blue-500 border-blue-500"
              : "border-gray-300"
            }`}
        >
          {isSelected && <Check className="w-4 h-4 text-white" />}
        </div>
      )}

      {showResult && (
        <div
          className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center
            ${isCorrect ? "bg-emerald-500" : "bg-red-500"}`}
        >
          {isCorrect ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white" />
          )}
        </div>
      )}

      <div className="pr-8">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
            {categoryLabels[finding.category]}
          </span>
          <span className="text-xs text-gray-500">
            {finding.points} 分
          </span>
        </div>
        <h4 className={`font-bold text-base mb-1
          ${showResult ? (isCorrect ? "text-emerald-800" : "text-red-800") : colors.text}`}>
          {finding.name}
        </h4>
        <p className={`text-sm ${showResult ? (isCorrect ? "text-emerald-700" : "text-red-700") : "text-gray-600"}`}>
          {finding.description}
        </p>
      </div>
    </div>
  );
};
