import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { getCaseById } from "@/data/cases";
import { useGameStore } from "@/store/useGameStore";
import { OperationButton } from "@/components/OperationButton";
import { FindingCard } from "@/components/FindingCard";
import { FeedbackModal } from "@/components/FeedbackModal";
import { OperationStep, OPERATION_STEPS } from "@/types";
import { getStepName } from "@/utils/scoring";
import {
  ArrowLeft,
  User,
  MessageSquare,
  Search,
  FileText,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

export const CasePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const caseId = parseInt(id || "1");
  const caseData = getCaseById(caseId);

  const {
    currentStep,
    selectedSequence,
    selectedFindings,
    selectSequenceStep,
    confirmFindings,
    completeCase,
    setCurrentCase,
    showFeedback,
    isComplete,
    currentCaseId,
  } = useGameStore();

  useEffect(() => {
    if (currentCaseId !== caseId) {
      setCurrentCase(caseId);
    }
  }, [caseId, currentCaseId, setCurrentCase]);

  useEffect(() => {
    if (isComplete) {
      navigate(`/result/${caseId}`);
    }
  }, [isComplete, caseId, navigate]);

  const allFindings = useMemo(() => {
    if (!caseData) return [];
    return [...caseData.requiredFindings, ...caseData.decoyFindings].sort(
      () => Math.random() - 0.5
    );
  }, [caseData]);

  const isStepCompleted = (step: string) => {
    if (step === "findings") {
      return currentStep >= (caseData?.correctSequence.length || 4);
    }
    return selectedSequence.includes(step);
  };

  const isStepCurrent = (step: string) => {
    if (!caseData) return false;
    if (step === "findings") {
      return currentStep === caseData.correctSequence.length - 1;
    }
    return currentStep < caseData.correctSequence.length - 1 && !selectedSequence.includes(step);
  };

  const isStepDisabled = (step: string) => {
    if (!caseData) return true;
    if (step === "findings") {
      return currentStep < caseData.correctSequence.length - 1;
    }
    return selectedSequence.includes(step) || currentStep >= caseData.correctSequence.length - 1;
  };

  const handleSequenceStep = (step: OperationStep) => {
    if (!caseData) return;
    selectSequenceStep(step, caseData);
  };

  const handleConfirmFindings = () => {
    if (!caseData) return;
    confirmFindings(caseData);
  };

  const handleCompleteCase = () => {
    if (!caseData) return;
    completeCase(caseData);
  };

  const canComplete = useMemo(() => {
    if (!caseData) return false;
    const sequenceComplete = currentStep >= caseData.correctSequence.length - 1;
    const hasFindings = selectedFindings.length > 0;
    return sequenceComplete && hasFindings;
  }, [caseData, currentStep, selectedFindings.length]);

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">病例不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <FeedbackModal />

      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">返回首页</span>
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">
                第 {caseData.id} 关 · {caseData.title}
              </h1>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {caseData.correctSequence.map((step, index) => (
            <div key={step} className="flex items-center flex-shrink-0">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${index < currentStep
                    ? "bg-emerald-100 text-emerald-700"
                    : index === currentStep
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                )}
                {getStepName(step)}
              </div>
              {index < caseData.correctSequence.length - 1 && (
                <ChevronRight className="w-5 h-5 text-gray-300 mx-1" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">患者信息</h2>
                  <p className="text-sm text-gray-500">
                    {caseData.patientInfo.age} · {caseData.patientInfo.gender} · {caseData.patientInfo.occupation}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <h3 className="font-semibold text-blue-800">主诉</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {caseData.chiefComplaint}
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-semibold text-emerald-800">口内描述</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {caseData.intraoralDescription}
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <h3 className="font-semibold text-amber-800">咬合线索</h3>
                  </div>
                  <ul className="space-y-2">
                    {caseData.occlusalClues.map((clue, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{clue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                检查操作步骤
              </h2>
              <p className="text-gray-600 mb-6">
                请选择正确的检查顺序进行操作：
              </p>

              <div className="space-y-4">
                {(["centric", "protrusive", "lateral"] as OperationStep[]).map((step) => (
                  <OperationButton
                    key={step}
                    step={step}
                    onClick={() => handleSequenceStep(step)}
                    disabled={isStepDisabled(step)}
                    completed={isStepCompleted(step)}
                    current={isStepCurrent(step)}
                  />
                ))}

                <OperationButton
                  step="findings"
                  onClick={() => {}}
                  disabled={isStepDisabled("findings")}
                  completed={isStepCompleted("findings")}
                  current={isStepCurrent("findings")}
                />
              </div>
            </div>

            {currentStep >= caseData.correctSequence.length - 1 && !showFeedback && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                  征象记录判断
                </h2>
                <p className="text-gray-600 mb-6">
                  请选择您认为需要记录的异常征象（可多选）：
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {allFindings.map((finding) => (
                    <FindingCard key={finding.id} finding={finding} />
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleConfirmFindings}
                    disabled={selectedFindings.length === 0}
                    className="flex-1 py-4 rounded-2xl font-bold text-lg transition-all
                      bg-gradient-to-r from-purple-500 to-pink-500 text-white
                      hover:from-purple-600 hover:to-pink-600 hover:shadow-lg
                      disabled:opacity-50 disabled:cursor-not-allowed
                      active:scale-[0.98]">
                    确认征象判断
                  </button>
                  {canComplete && (
                    <button
                      onClick={handleCompleteCase}
                      className="flex-1 py-4 rounded-2xl font-bold text-lg transition-all
                        bg-gradient-to-r from-emerald-500 to-teal-500 text-white
                        hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg
                        active:scale-[0.98]">
                      完成评估，查看结果
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
