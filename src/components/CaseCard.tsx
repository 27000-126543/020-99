import { CaseData } from "@/types";
import { useGameStore } from "@/store/useGameStore";
import { getScoreGrade } from "@/utils/scoring";
import { CheckCircle, Star, Lock, Play, Trophy } from "lucide-react";

interface CaseCardProps {
  caseData: CaseData;
  onClick: () => void;
  index: number;
}

const difficultyConfig = {
  easy: { label: "入门", color: "bg-emerald-100 text-emerald-700" },
  medium: { label: "进阶", color: "bg-amber-100 text-amber-700" },
  hard: { label: "挑战", color: "bg-red-100 text-red-700" },
};

export const CaseCard = ({ caseData, onClick, index }: CaseCardProps) => {
  const progress = useGameStore((state) => state.getProgressForCase(caseData.id));
  const allProgress = useGameStore((state) => state.userProgress);

  const isLocked = index > 0 && !allProgress.some((p) => p.caseId === caseData.id - 1 && p.completed);

  const difficulty = difficultyConfig[caseData.difficulty];
  const lastScore = progress?.lastScore ?? 0;
  const bestScore = progress?.bestScore ?? 0;
  const grade = progress ? getScoreGrade(lastScore) : null;
  const bestGrade = progress ? getScoreGrade(bestScore) : null;

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 overflow-hidden
        ${isLocked
          ? "border-gray-200 opacity-60 cursor-not-allowed"
          : "border-gray-100 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
        }`}
      onClick={() => !isLocked && onClick()}
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400" />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold
              ${progress?.completed
                ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white"
                : isLocked
                  ? "bg-gray-200 text-gray-500"
                  : "bg-gradient-to-br from-blue-400 to-blue-600 text-white"
              }`}>
              {progress?.completed ? (
                <CheckCircle className="w-6 h-6" />
              ) : isLocked ? (
                <Lock className="w-5 h-5" />
              ) : (
                caseData.id
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{caseData.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficulty.color}`}>
                  {difficulty.label}
                </span>
                {progress?.attempts && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    已尝试 {progress.attempts} 次
                  </span>
                )}
              </div>
            </div>
          </div>
          {progress?.completed && grade && (
            <div className="text-right">
              <div className={`text-2xl font-bold ${grade.color}`}>
                {lastScore}
              </div>
              <div className={`text-sm font-medium ${grade.color}`}>
                {grade.grade}
              </div>
              {bestScore > 0 && bestScore !== lastScore && (
                <div className={`text-xs mt-1 font-medium ${bestGrade.color} opacity-80 flex items-center justify-end gap-1`}>
                  <Trophy className="w-3 h-3" />
                  历史最佳 {bestScore}
                </div>
              )}
              {bestScore > 0 && bestScore === lastScore && (
                <div className={`text-xs mt-1 font-medium ${bestGrade.color} opacity-80 flex items-center justify-end gap-1`}>
                  <Trophy className="w-3 h-3" />
                  历史最佳
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">
            {caseData.patientInfo.age} · {caseData.patientInfo.gender}
          </p>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {caseData.chiefComplaint}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  progress?.lastScore && progress.lastScore >= 60 + star * 10
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>

          <button
            disabled={isLocked}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm transition-all
              ${isLocked
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 group-hover:scale-105"
              }`}
          >
            <Play className="w-4 h-4" />
            {progress?.completed ? "再次练习" : "开始练习"}
          </button>
        </div>
      </div>
    </div>
  );
};
