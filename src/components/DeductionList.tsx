import { DeductionItem } from "@/types";
import { MinusCircle, CheckCircle2, AlertCircle } from "lucide-react";

interface DeductionListProps {
  deductions: DeductionItem[];
}

export const DeductionList = ({ deductions }: DeductionListProps) => {
  if (deductions.length === 0) {
    return (
      <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-800 text-lg">完美！</h4>
            <p className="text-emerald-700">本次评估无任何错误，检查流程规范，征象识别准确。</p>
          </div>
        </div>
      </div>
    );
  }

  const totalDeducted = deductions.reduce((sum, d) => sum + d.points, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border-2 border-red-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h4 className="font-bold text-red-800 text-lg">扣分明细</h4>
            <p className="text-red-700">共 {deductions.length} 项错误</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-red-600">-{totalDeducted}</div>
          <div className="text-sm text-red-600">总分</div>
        </div>
      </div>

      <div className="space-y-3">
        {deductions.map((deduction, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-red-300 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MinusCircle className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-gray-800">{deduction.reason}</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="text-emerald-700 font-medium">正确做法：</span>
                      {deduction.correctAction}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-700 font-bold rounded-lg text-sm">
                      -{deduction.points} 分
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
