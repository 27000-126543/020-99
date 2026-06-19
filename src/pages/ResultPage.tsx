import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getCaseById } from "@/data/cases";
import { useGameStore } from "@/store/useGameStore";
import { ScoreRing } from "@/components/ScoreRing";
import { DeductionList } from "@/components/DeductionList";
import { FindingCard } from "@/components/FindingCard";
import {
  ArrowLeft,
  Home,
  RotateCcw,
  ChevronRight,
  FileText,
  Lightbulb,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const ResultPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const caseId = parseInt(id || "1");
  const caseData = getCaseById(caseId);

  const { score, deductions, selectedFindings, resetGame } = useGameStore();

  useEffect(() => {
    if (!caseData) {
      navigate("/");
    }
  }, [caseData, navigate]);

  const handleRetry = () => {
    resetGame();
    navigate(`/case/${caseId}`);
  };

  const handleNextCase = () => {
    const nextId = caseId + 1;
    if (getCaseById(nextId)) {
      resetGame();
      navigate(`/case/${nextId}`);
    } else {
      navigate("/");
    }
  };

  if (!caseData) return null;

  const correctFindings = caseData.requiredFindings.filter((f) =>
    selectedFindings.includes(f.id)
  );

  const missedFindings = caseData.requiredFindings.filter(
    (f) => !selectedFindings.includes(f.id)
  );

  const wrongFindings = caseData.decoyFindings.filter((f) =>
    selectedFindings.includes(f.id)
  );

  const hasNextCase = !!getCaseById(caseId + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">返回首页</span>
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">
                第 {caseData.id} 关 · 评分讲评
              </h1>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-shrink-0">
              <ScoreRing score={score} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                {caseData.title}
              </h2>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
                  <span className="text-sm text-gray-600">检查顺序</span>
                  <span className="font-bold text-blue-700">
                    {caseData.correctSequence
                      .slice(0, -1)
                      .map((s) =>
                        s === "centric"
                          ? "正中"
                          : s === "protrusive"
                            ? "前伸"
                            : "侧方"
                      )
                      .join(" → ")}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-700">
                    正确识别 {correctFindings.length} / {caseData.requiredFindings.length} 项
                  </span>
                </div>
                {missedFindings.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl">
                    <XCircle className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-amber-700">
                      遗漏 {missedFindings.length} 项
                    </span>
                  </div>
                )}
                {wrongFindings.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-xl">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="font-bold text-red-700">
                      错误选择 {wrongFindings.length} 项
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-4 justify-center md:justify-start">
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-all">
                  <RotateCcw className="w-5 h-5" />
                  重新练习
                </button>
                {hasNextCase && (
                  <button
                    onClick={handleNextCase}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-medium hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg transition-all">
                    下一关
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
                {!hasNextCase && (
                  <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-medium hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg transition-all">
                    <Home className="w-5 h-5" />
                    返回首页
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">标准评估摘要</h2>
            </div>
            <div className="p-5 bg-amber-50 rounded-2xl border-2 border-amber-200">
              <p className="text-gray-800 leading-relaxed text-[15px]">
                {caseData.standardSummary}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">扣分讲评</h2>
            </div>
            <DeductionList deductions={deductions} />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
            征象识别详情
          </h2>

          {correctFindings.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-emerald-700 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                正确识别的征象
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {correctFindings.map((finding) => (
                  <FindingCard
                    key={finding.id}
                    finding={finding}
                    showResult
                    isCorrect
                  />
                ))}
              </div>
            </div>
          )}

          {missedFindings.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-amber-700 mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                遗漏的征象
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {missedFindings.map((finding) => (
                  <FindingCard
                    key={finding.id}
                    finding={finding}
                    showResult
                    isCorrect={false}
                  />
                ))}
              </div>
            </div>
          )}

          {wrongFindings.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                错误选择的征象（本病例不存在）
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wrongFindings.map((finding) => (
                  <FindingCard
                    key={finding.id}
                    finding={finding}
                    showResult
                    isCorrect={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 pb-8">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all">
            <RotateCcw className="w-5 h-5" />
            重新练习本关
          </button>
          {hasNextCase && (
            <button
              onClick={handleNextCase}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg transition-all">
              进入下一关
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
          {!hasNextCase && (
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg transition-all">
              🎉 恭喜完成所有关卡
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
