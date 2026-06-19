import { OPERATION_STEPS, OperationStep } from "@/types";
import { MousePointer2, MoveHorizontal, MoveRight, ClipboardList } from "lucide-react";

interface OperationButtonProps {
  step: OperationStep;
  onClick: () => void;
  disabled?: boolean;
  completed?: boolean;
  current?: boolean;
}

const stepIcons: Record<OperationStep, typeof MousePointer2> = {
  centric: MousePointer2,
  protrusive: MoveRight,
  lateral: MoveHorizontal,
  findings: ClipboardList,
};

export const OperationButton = ({
  step,
  onClick,
  disabled = false,
  completed = false,
  current = false,
}: OperationButtonProps) => {
  const Icon = stepIcons[step];

  return (
    <button
      onClick={onClick}
      disabled={disabled || completed}
      className={`relative w-full p-5 rounded-2xl border-2 transition-all duration-300 text-left group
        ${completed
          ? "bg-emerald-50 border-emerald-300 cursor-default"
          : current
            ? "bg-blue-50 border-blue-400 ring-4 ring-blue-100"
            : disabled
              ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60"
              : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
        }`}
    >
      {completed && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}

      {current && !completed && (
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500 text-white text-xs font-medium rounded-full animate-pulse">
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
            当前步骤
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all
          ${completed
            ? "bg-emerald-100 text-emerald-600"
            : current
              ? "bg-blue-100 text-blue-600 group-hover:scale-110"
              : disabled
                ? "bg-gray-100 text-gray-400"
                : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
          }`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold text-lg mb-1
            ${completed
              ? "text-emerald-700"
              : current
                ? "text-blue-700"
                : disabled
                  ? "text-gray-400"
                  : "text-gray-800 group-hover:text-blue-700"
            }`}>
            {OPERATION_STEPS[step]}
          </h4>
          <p className={`text-sm
            ${completed
              ? "text-emerald-600"
              : current
                ? "text-blue-600"
                : disabled
                  ? "text-gray-400"
                  : "text-gray-500 group-hover:text-gray-600"
            }`}>
            {step === "centric" && "检查上下牙列正中咬合接触关系"}
            {step === "protrusive" && "嘱患者下颌前伸，检查前伸咬合"}
            {step === "lateral" && "嘱患者下颌左右侧方运动，检查侧方咬合"}
            {step === "findings" && "记录需要诊断和处理的异常征象"}
          </p>
        </div>
      </div>
    </button>
  );
};
