import { useState } from "react";
import { CaseData } from "@/types";
import { generateReviewReport } from "@/utils/scoring";
import { ClipboardCopy, Check, FileSpreadsheet } from "lucide-react";

interface ReviewReportProps {
  caseData: CaseData;
  selectedSequence: string[];
  selectedFindings: string[];
}

export const ReviewReport = ({
  caseData,
  selectedSequence,
  selectedFindings,
}: ReviewReportProps) => {
  const [copied, setCopied] = useState(false);

  const reportContent = generateReviewReport(
    caseData,
    selectedSequence,
    selectedFindings
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = reportContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">复盘报告</h2>
            <p className="text-sm text-gray-500">整理为诊室表达，方便课后提交作业</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all
            ${copied
              ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              已复制！
            </>
          ) : (
            <>
              <ClipboardCopy className="w-5 h-5" />
              一键复制
            </>
          )}
        </button>
      </div>

      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
        <pre className="whitespace-pre-wrap font-sans text-[14px] leading-relaxed text-gray-700 font-mono">
          {reportContent}
        </pre>
      </div>
    </div>
  );
};
