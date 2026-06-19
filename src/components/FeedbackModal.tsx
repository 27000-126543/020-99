import { useGameStore } from "@/store/useGameStore";
import { MessageCircle, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export const FeedbackModal = () => {
  const { currentFeedback, showFeedback, clearFeedback } = useGameStore();

  if (!showFeedback || !currentFeedback) return null;

  const isCorrect = currentFeedback.correct;
  const hasDialogue = !!currentFeedback.dialoguePrompt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div
        className={`relative max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`h-3 ${isCorrect ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-gradient-to-r from-red-400 to-red-600"}`}
        />

        <div className="p-8">
          <div className="flex items-start gap-5">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0
              ${isCorrect ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}
            >
              {isCorrect ? (
              <CheckCircle2 className="w-9 h-9" />
            ) : (
              <XCircle className="w-9 h-9" />
            )}
            </div>

            <div className="flex-1">
              <h3 className={`text-2xl font-bold mb-3
                ${isCorrect ? "text-emerald-700" : "text-red-700"}`}>
                {isCorrect ? "操作正确！" : "操作有误"}
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {currentFeedback.message}
              </p>
            </div>
          </div>

          {hasDialogue && (
            <div className="mt-6 p-5 bg-blue-50 rounded-2xl border-2 border-blue-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-700 mb-1">
                    💬 诊室问诊提示
                  </h4>
                  <p className="text-blue-800 font-medium">
                    "{currentFeedback.dialoguePrompt}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isCorrect && (
            <div className="mt-6 p-5 bg-amber-50 rounded-2xl border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-amber-700 mb-1">
                    ⚠ 学习要点
                  </h4>
                  <p className="text-amber-800">
                    全口咬合关系评估应从正中咬合开始，依次检查前伸运动和侧方运动，最后综合判断咬合异常征象。
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={clearFeedback}
            className={`w-full mt-8 py-4 rounded-2xl font-bold text-white text-lg transition-all
              ${isCorrect
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              }
              hover:shadow-lg active:scale-[0.98]`}
          >
            继续练习
          </button>
        </div>
      </div>
    </div>
  );
};
