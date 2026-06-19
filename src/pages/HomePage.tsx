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
  Users,
  Play,
  Table,
  Trophy,
  Calendar,
  TrendingUp,
  BarChart3,
  Clock,
} from "lucide-react";
import { getScoreGrade } from "@/utils/scoring";

export const HomePage = () => {
  const navigate = useNavigate();
  const cases = getAllCases();
  const { userProgress, resetProgress } = useGameStore();

  const completedCount = userProgress.filter((p) => p.completed).length;
  const avgScore =
    userProgress.length > 0
      ? Math.round(userProgress.reduce((sum, p) => sum + (p.lastScore || 0), 0) / userProgress.length)
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div
            onClick={() => navigate("/teacher")}
            className="md:col-span-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/30 p-6 cursor-pointer hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-1 transition-all text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/3" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">👨‍🏫 教师带教</h3>
              <p className="text-sm text-white/80 mb-5">晨会投屏 · 病例讲解</p>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white text-purple-600 rounded-xl font-bold text-sm hover:scale-105 transition-transform w-fit">
                <Play className="w-4 h-4" />
                进入带教模式
              </div>
            </div>
          </div>
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

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-12 overflow-hidden">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">班级练习记录</h2>
                <p className="text-gray-600">
                  查看各病例最近成绩与历史最佳，追踪训练效果。重新练习后最近成绩更新，最好成绩保留。
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span className="text-indigo-700 font-medium">重新练习更新最近成绩</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span className="text-amber-700 font-medium">历史最佳永久保留</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y-2 border-slate-100">
                  <th className="text-left py-4 px-5 rounded-tl-2xl">
                    <div className="flex items-center gap-2 text-slate-600 font-bold">
                      <Table className="w-4 h-4" />
                      病例名称
                    </div>
                  </th>
                  <th className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2 text-slate-600 font-bold">
                      <TrendingUp className="w-4 h-4" />
                      最近成绩
                    </div>
                  </th>
                  <th className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2 text-slate-600 font-bold">
                      <Trophy className="w-4 h-4" />
                      最好成绩
                    </div>
                  </th>
                  <th className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2 text-slate-600 font-bold">
                      <Award className="w-4 h-4" />
                      尝试次数
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 rounded-tr-2xl">
                    <div className="flex items-center justify-center gap-2 text-slate-600 font-bold">
                      <Clock className="w-4 h-4" />
                      上次练习时间
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {cases.map((caseData, idx) => {
                  const progress = userProgress.find((p) => p.caseId === caseData.id);
                  const lastGrade = progress?.lastScore ? getScoreGrade(progress.lastScore) : null;
                  const bestGrade = progress?.bestScore ? getScoreGrade(progress.bestScore) : null;
                  const isImproved = progress && progress.bestScore > 0 && progress.lastScore >= progress.bestScore && progress.lastScore > 0;
                  const hasProgress = !!progress;

                  const formatDate = (ts: number) => {
                    try {
                      const d = new Date(ts);
                      const now = new Date();
                      const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
                      if (diffDays === 0) return "今天";
                      if (diffDays === 1) return "昨天";
                      if (diffDays < 7) return `${diffDays} 天前`;
                      return d.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" });
                    } catch {
                      return "-";
                    }
                  };

                  return (
                    <tr
                      key={caseData.id}
                      className={`border-b border-gray-50 hover:bg-slate-50/80 transition-colors ${idx === cases.length - 1 ? "border-b-0" : ""}`}
                    >
                      <td className="py-5 px-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0
                            ${hasProgress
                              ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white"
                              : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600"
                            }`}>
                            {caseData.id}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-800 text-base truncate">{caseData.title}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                ${caseData.difficulty === "easy" ? "bg-emerald-100 text-emerald-700" : caseData.difficulty === "medium" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                                {caseData.difficulty === "easy" ? "入门" : caseData.difficulty === "medium" ? "进阶" : "挑战"}
                              </span>
                              <span className="text-xs text-gray-500 truncate">
                                {caseData.patientInfo.age} · {caseData.patientInfo.gender} · {caseData.requiredFindings.length} 项征象
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-center">
                        {hasProgress && progress?.lastScore > 0 ? (
                          <div className="inline-flex flex-col items-center">
                            <div className="flex items-center gap-2">
                              <span className={`text-2xl font-bold ${lastGrade?.color || "text-gray-800"}`}>
                                {progress?.lastScore}
                              </span>
                              {isImproved && (
                                <span className="inline-flex items-center px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                                  ↑ 最佳
                                </span>
                              )}
                            </div>
                            <span className={`text-xs font-medium mt-0.5 ${lastGrade?.color || "text-gray-500"}`}>
                              {lastGrade?.grade || "-"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-300 font-bold text-xl">-</span>
                        )}
                      </td>
                      <td className="py-5 px-4 text-center">
                        {hasProgress && progress?.bestScore > 0 ? (
                          <div className="inline-flex flex-col items-center">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                              <Trophy className="w-4 h-4 text-amber-500 fill-amber-200" />
                              <span className={`text-2xl font-bold ${bestGrade?.color || "text-gray-800"}`}>
                                {progress?.bestScore}
                              </span>
                            </div>
                            <span className={`text-xs font-medium mt-1 ${bestGrade?.color || "text-gray-500"}`}>
                              {bestGrade?.grade || "-"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-300 font-bold text-xl">-</span>
                        )}
                      </td>
                      <td className="py-5 px-4 text-center">
                        {hasProgress ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-gray-800 font-bold text-xl">
                              {progress?.attempts || 0}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">次</span>
                          </div>
                        ) : (
                          <span className="text-gray-300 font-bold text-xl">-</span>
                        )}
                      </td>
                      <td className="py-5 px-4 text-center">
                        {hasProgress && progress?.lastPlayedAt ? (
                          <div className="inline-flex flex-col items-center">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <span className="font-medium text-gray-700 text-sm">
                                {formatDate(progress.lastPlayedAt)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-300 font-bold text-xl">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-r from-slate-50 via-blue-50 to-cyan-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">小提示</h4>
                <p className="text-sm text-gray-600">
                  建议每个病例至少练习 3 次以上，形成肌肉记忆。每次练习争取提高 5-10 分，直到稳定在 90 分以上。
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-600">
                  {userProgress.filter((p) => p.bestScore >= 90).length}
                </p>
                <p className="text-gray-500">优秀关卡</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {userProgress.reduce((s, p) => s + (p.attempts || 0), 0)}
                </p>
                <p className="text-gray-500">总练习次数</p>
              </div>
            </div>
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
