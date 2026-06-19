import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/store/useGameStore";
import { getAllCases } from "@/data/cases";
import { CaseCard } from "@/components/CaseCard";
import {
  Stethoscope,
  BookOpen,
  Target,
  Award,
  RotateCcw,
  BookOpen as BookOpenIcon,
  Info,
} from "lucide-react";

export const HomePage = () => {
  const navigate = useNavigate();
  const cases = getAllCases();
  const { userProgress, resetProgress } = useGameStore();

  const completedCount = userProgress.filter((p) => p.completed).length;
  const avgScore =
    userProgress.length > 0
      ? Math.round(userProgress.reduce((sum, p) => sum + p.score, 0) / userProgress.length)
      : 0;

  const handleCaseClick = (caseId: number) => {
    useGameStore.getState().setCurrentCase(caseId);
    navigate(`/case/${caseId}`);
  };

  const handleResetProgress = () => {
    if (window.confirm("确定要重置所有学习进度吗？此操作不可撤销。")) {
      resetProgress();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12 pt-4">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            全口咬合关系评估训练系统
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            通过病例闯关方式练习检查顺序和判断表达，帮助口腔医学生和新入职医生熟练掌握全口咬合关系评估流程
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">完成进度</p>
                <p className="text-2xl font-bold text-gray-800">
                  {completedCount} / {cases.length}
                </p>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${(completedCount / cases.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">平均得分</p>
                <p className="text-2xl font-bold text-gray-800">{avgScore} 分</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {avgScore >= 90
                ? "太棒了！继续保持！"
                : avgScore >= 75
                  ? "良好，还有提升空间很大！"
                  : "继续努力练习！"}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">总尝试次数</p>
                <p className="text-2xl font-bold text-gray-800">
                  {userProgress.reduce((sum, p) => sum + p.attempts, 0)} 次
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">熟能生巧，多练多进步</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Info className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">游戏规则</h2>
              <p className="text-gray-600">
                每关给出患者主诉、口内照片文字描述和简单咬合线索，您需要：
              </p>
            </div>
            <button
              onClick={handleResetProgress}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-sm font-medium">
              <RotateCcw className="w-4 h-4" />
              重置进度
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4 p-5 bg-blue-50 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">选择检查顺序</h3>
                <p className="text-sm text-gray-600">
                  先查正中咬合，再查前伸或侧方运动，注意顺序不能错
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-5 bg-emerald-50 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">判断异常征象</h3>
                <p className="text-sm text-gray-600">
                  识别早接触、深覆合、反合、偏侧咀嚼等异常
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-5 bg-amber-50 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">查看评分讲评</h3>
                <p className="text-sm text-gray-600">
                  学习标准评估摘要，了解扣分原因和正确做法
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 p-5 bg-slate-50 rounded-2xl">
            <div className="flex items-start gap-3">
              <BookOpenIcon className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-800 mb-1">评分规则</h4>
                <p className="text-sm text-gray-600">
                  总分100分，检查顺序40分，征象识别60分。优秀≥90分，良好≥75分，及格≥60分。
                  检查顺序错误、漏选征象、错选干扰项都会扣分。
                </p>
              </div>
            </div>
            </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
            病例关卡
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((caseData, index) => (
              <CaseCard
                key={caseData.id}
                caseData={caseData}
                index={index}
                onClick={() => handleCaseClick(caseData.id)}
              />
            ))}
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm pb-8">
          <p>© 2024 口腔医学教育训练系统 · 适用于诊所培训晨会或学校实训课使用</p>
        </footer>
      </div>
    </div>
  );
};
