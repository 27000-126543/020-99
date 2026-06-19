import { useState } from "react";
import { CaseData, DeductionItem } from "@/types";
import { generateReviewReport, getScoreGrade } from "@/utils/scoring";
import { ClipboardCopy, Check, FileSpreadsheet, FileText, FileStack } from "lucide-react";

interface ReviewReportProps {
  caseData: CaseData;
  selectedSequence: string[];
  selectedFindings: string[];
  score: number;
  deductions: DeductionItem[];
}

export const ReviewReport = ({
  caseData,
  selectedSequence,
  selectedFindings,
  score,
  deductions,
}: ReviewReportProps) => {
  const [copied, setCopied] = useState<"full" | "concise" | null>(null);
  const [activeTab, setActiveTab] = useState<"concise" | "full">("full");

  const fullReport = generateReviewReport(
    caseData,
    selectedSequence,
    selectedFindings,
    score,
    deductions,
    "full"
  );
  const conciseReport = generateReviewReport(
    caseData,
    selectedSequence,
    selectedFindings,
    score,
    deductions,
    "concise"
  );
  const activeContent = activeTab === "full" ? fullReport : conciseReport;
  const grade = getScoreGrade(score);

  const handleCopy = async (version: "concise" | "full") => {
    const content = version === "full" ? fullReport : conciseReport;
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(version);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">复盘报告 · 课后提交版</h2>
            <p className="text-sm text-gray-500">
              得分 <span className={`font-bold ${grade.color}`}>{score}分 · {grade.grade}</span>
              {"  "}· 可复制提交实训课作业
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="inline-flex rounded-2xl bg-slate-100 p-1">
            <button
              onClick={() => setActiveTab("concise")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${activeTab === "concise"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
                }`}
            >
              <FileText className="w-4 h-4" />
              精简版
            </button>
            <button
              onClick={() => setActiveTab("full")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${activeTab === "full"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
                }`}
            >
              <FileStack className="w-4 h-4" />
              完整版
            </button>
          </div>
          <button
            onClick={() => handleCopy(activeTab)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all
              ${copied === activeTab
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg"
              }`}
          >
            {copied === activeTab ? (
              <>
                <Check className="w-5 h-5" />
                已复制
              </>
            ) : (
              <>
                <ClipboardCopy className="w-5 h-5" />
                一键复制
              </>
            )}
          </button>
        </div>
      </div>

      {activeTab === "concise" && (
        <div className="mb-4 flex flex-wrap gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 text-sm text-amber-800">
          <span className="font-bold">📋 精简版包含：</span>
          <span>成绩等级 · 扣分摘要 · 患者主诉 · 检查顺序 · 征象识别 · 改进建议 · 3句核心问诊</span>
        </div>
      )}
      {activeTab === "full" && (
        <div className="mb-4 flex flex-wrap gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 text-sm text-emerald-800">
          <span className="font-bold">📚 完整版包含：</span>
          <span>完整成绩 · 逐项扣分明细 · 针对性改进建议 · 患者信息 · 流程复盘 · 完整征象讲解 · 全部问诊句 · 标准评估摘要</span>
        </div>
      )}

      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 max-h-[600px] overflow-y-auto">
        <pre className="whitespace-pre-wrap font-sans text-[14px] leading-relaxed text-gray-700">
          {activeContent}
        </pre>
      </div>
    </div>
  );
};
