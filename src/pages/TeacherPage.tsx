import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCases, getCaseById } from "@/data/cases";
import { CaseData } from "@/types";
import {
  ArrowLeft,
  Stethoscope,
  User,
  MessageSquare,
  Search,
  FileText,
  ChevronRight,
  AlertTriangle,
  MessageCircle,
  Lightbulb,
  Target,
  Users,
  CheckCircle2,
  Play,
  Presentation,
  XCircle,
  ClipboardList,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getStepName } from "@/utils/scoring";

export const TeacherPage = () => {
  const navigate = useNavigate();
  const cases = getAllCases();
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("clues");

  const selectedCase: CaseData | undefined = selectedCaseId
    ? getCaseById(selectedCaseId)
    : undefined;

  const handleStartPractice = (caseId: number) => {
    navigate(`/case/${caseId}`);
  };

  const commonMistakes = (caseData: CaseData) => {
    const mistakes: { title: string; desc: string; type: "sequence" | "finding" | "dialogue" }[] = [];
    const correctOrder = caseData.correctSequence.slice(0, -1);

    mistakes.push({
      type: "sequence",
      title: "检查顺序错误",
      desc: `最常见错误：跳过正中咬合直接查前伸/侧方，或把${correctOrder.length === 3 ? (caseData.correctSequence[1] === "protrusive" ? "前伸" : "侧方") + "和" + (caseData.correctSequence[2] === "protrusive" ? "前伸" : "侧方") : "检查"}顺序搞反。正确顺序：${correctOrder.map((s, i) => `${i + 1}.${getStepName(s)}`).join(" → ")}`,
    });

    caseData.requiredFindings.forEach((f) => {
      mistakes.push({
        type: "finding",
        title: `遗漏征象：${f.name}`,
        desc: `学员常忽略：${f.description}。关键线索在咬合线索第 ${caseData.occlusalClues.findIndex((c) =>
          c.includes(f.name.slice(0, 4)) || c.includes(f.name.slice(0, 2))
        ) >= 0
          ? caseData.occlusalClues.findIndex((c) =>
              c.includes(f.name.slice(0, 4)) || c.includes(f.name.slice(0, 2))
            ) + 1
          : caseData.occlusalClues.length > 1
            ? "1~" + caseData.occlusalClues.length
            : 1
        } 条`,
      });
    });

    caseData.decoyFindings.slice(0, 2).forEach((f) => {
      mistakes.push({
        type: "finding",
        title: `过度诊断：${f.name}`,
        desc: `学员容易误判：${f.description}。鉴别要点：本病例${caseData.title}中${f.category === "deepOverbite" ? "覆合未达诊断标准" : f.category === "crossBite" ? "未出现反合体征" : f.category === "unilateralChewing" ? "无偏侧咀嚼证据" : "不符合描述"}`,
      });
    });

    if (caseData.dialoguePrompts.length > 0) {
      mistakes.push({
        type: "dialogue",
        title: "问诊遗漏关键问题",
        desc: `学员常忘记追问病史。应主动询问：${caseData.dialoguePrompts.slice(0, 2).map((d) => `"${d.text.slice(0, 20)}..."`).join("；")}`,
      });
    }

    return mistakes;
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!selectedCase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-lg">
                <ArrowLeft className="w-6 h-6" />
                <span className="font-semibold">返回首页</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">教师带教模式</h1>
                  <p className="text-sm text-gray-500">晨会投屏 · 病例讲解 · 标准化培训</p>
                </div>
              </div>
              <div className="w-32" />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 mb-10">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Presentation className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">选择今日带教病例</h2>
                <p className="text-lg text-gray-600 mb-6">
                  点击卡片进入病例讲解视图，大屏展示主诉、咬合线索、学员常见错误及标准问诊语句。讲完后可一键进入学员闯关模式。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">标准问诊</h4>
                      <p className="text-sm text-gray-600">诊室话术示例</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">常见错误</h4>
                      <p className="text-sm text-gray-600">学员易错点提醒</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">学习要点</h4>
                      <p className="text-sm text-gray-600">本关核心训练目标</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((caseData, index) => (
              <div
                key={caseData.id}
                onClick={() => setSelectedCaseId(caseData.id)}
                className="group relative bg-white rounded-3xl shadow-sm border-2 border-gray-100 hover:border-indigo-400 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <div className="p-7">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-300/50 group-hover:scale-110 transition-transform">
                        {caseData.id}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">
                          {caseData.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {caseData.patientInfo.age} · {caseData.patientInfo.gender}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-base text-gray-600 mb-5 line-clamp-2 leading-relaxed">
                    {caseData.chiefComplaint}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium
                      ${caseData.difficulty === "easy" ? "bg-emerald-100 text-emerald-700" : caseData.difficulty === "medium" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                      {caseData.difficulty === "easy" ? "入门级" : caseData.difficulty === "medium" ? "进阶级" : "挑战级"}
                    </span>
                    <span className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                      {caseData.requiredFindings.length} 项征象
                    </span>
                    <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                      {caseData.occlusalClues.length} 条线索
                    </span>
                  </div>

                  <button
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-bold text-lg group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:shadow-lg group-hover:shadow-indigo-300/50 transition-all"
                  >
                    <Stethoscope className="w-5 h-5" />
                    进入带教讲解
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedCaseId(null)}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-lg">
              <ArrowLeft className="w-6 h-6" />
              <span className="font-semibold">返回病例列表</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <h1 className="text-2xl font-bold">
                  第 {selectedCase.id} 关 · {selectedCase.title}
                </h1>
                <p className="text-sm text-slate-400">教师带教视图 · 晨会投屏讲解</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-900/50">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
            <button
              onClick={() => handleStartPractice(selectedCase.id)}
              className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-900/50 transition-all"
            >
              <Play className="w-5 h-5" />
              开始学员闯关
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 shadow-2xl shadow-indigo-900/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">患者信息</h2>
                  <p className="text-lg text-indigo-200">
                    {selectedCase.patientInfo.age} · {selectedCase.patientInfo.gender} · {selectedCase.patientInfo.occupation}
                  </p>
                </div>
              </div>
              <div className="space-y-5">
                <div className="p-5 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageSquare className="w-6 h-6 text-indigo-200" />
                    <h3 className="text-xl font-bold text-indigo-100">患者主诉</h3>
                  </div>
                  <p className="text-xl leading-relaxed text-white">
                    {selectedCase.chiefComplaint}
                  </p>
                </div>

                <div className="p-5 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Search className="w-6 h-6 text-indigo-200" />
                    <h3 className="text-xl font-bold text-indigo-100">口内情况描述</h3>
                  </div>
                  <p className="text-lg leading-relaxed text-white/95">
                    {selectedCase.intraoralDescription}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 shadow-2xl shadow-emerald-900/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">本关训练要点</h2>
                  <p className="text-lg text-emerald-200">
                    {selectedCase.difficulty === "easy" ? "基础训练 · 规范检查顺序" : selectedCase.difficulty === "medium" ? "进阶训练 · 综合判断能力" : "高阶训练 · 临床思维能力"}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">规范检查顺序</h4>
                    <p className="text-emerald-100 text-base leading-relaxed">
                      {selectedCase.correctSequence.slice(0, -1).map((s, i) => getStepName(s)).join(" → ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">核心学习征象</h4>
                    <p className="text-emerald-100 text-base leading-relaxed">
                      {selectedCase.requiredFindings.map((f) => f.name).join("、")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">问诊沟通技巧</h4>
                    <p className="text-emerald-100 text-base leading-relaxed">
                      共 {selectedCase.dialoguePrompts.length} 句标准问诊话术
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-3xl border border-slate-700/50 overflow-hidden">
              <button
                onClick={() => toggleSection("clues")}
                className="w-full p-7 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold mb-1">咬合检查线索</h2>
                    <p className="text-slate-400">带领学员逐条分析，引导发现异常征象</p>
                  </div>
                </div>
                {expandedSection === "clues" ? (
                  <ChevronUp className="w-7 h-7 text-slate-400" />
                ) : (
                  <ChevronDown className="w-7 h-7 text-slate-400" />
                )}
              </button>
              {(expandedSection === "clues" || expandedSection === null) && (
                <div className="px-7 pb-7">
                  <div className="space-y-4">
                    {selectedCase.occlusalClues.map((clue, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-6 bg-gradient-to-r from-amber-500/10 to-transparent rounded-2xl border-l-4 border-amber-400"
                      >
                        <div className="w-12 h-12 rounded-xl bg-amber-400 text-white flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-lg shadow-amber-900/30">
                          {idx + 1}
                        </div>
                        <p className="text-xl leading-relaxed text-white/95 flex-1 pt-1">
                          {clue}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-3xl border border-slate-700/50 overflow-hidden">
              <button
                onClick={() => toggleSection("mistakes")}
                className="w-full p-7 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center shadow-lg">
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold mb-1">学员常见错误</h2>
                    <p className="text-slate-400">提前预判问题，带教时重点强调</p>
                  </div>
                </div>
                {expandedSection === "mistakes" ? (
                  <ChevronUp className="w-7 h-7 text-slate-400" />
                ) : (
                  <ChevronDown className="w-7 h-7 text-slate-400" />
                )}
              </button>
              {(expandedSection === "mistakes") && (
                <div className="px-7 pb-7">
                  <div className="grid grid-cols-1 gap-4">
                    {commonMistakes(selectedCase).map((mistake, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-5 bg-red-500/10 rounded-2xl border border-red-500/30"
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg
                          ${mistake.type === "sequence" ? "bg-purple-500 shadow-purple-900/30" : mistake.type === "finding" ? "bg-red-500 shadow-red-900/30" : "bg-cyan-500 shadow-cyan-900/30"}`}>
                          {mistake.type === "sequence" ? (
                            <ClipboardList className="w-6 h-6 text-white" />
                          ) : mistake.type === "finding" ? (
                            <XCircle className="w-6 h-6 text-white" />
                          ) : (
                            <MessageCircle className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-xs px-3 py-1 rounded-full font-medium
                              ${mistake.type === "sequence" ? "bg-purple-500/30 text-purple-200" : mistake.type === "finding" ? "bg-red-500/30 text-red-200" : "bg-cyan-500/30 text-cyan-200"}`}>
                              {mistake.type === "sequence" ? "顺序错误" : mistake.type === "finding" ? "诊断错误" : "问诊不足"}
                            </span>
                            <h4 className="text-xl font-bold text-white">{mistake.title}</h4>
                          </div>
                          <p className="text-lg leading-relaxed text-slate-200">
                            {mistake.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-3xl border border-slate-700/50 overflow-hidden">
              <button
                onClick={() => toggleSection("dialogue")}
                className="w-full p-7 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold mb-1">标准诊室问诊句</h2>
                    <p className="text-slate-400">示范正确沟通方式，学员可直接套用</p>
                  </div>
                </div>
                {expandedSection === "dialogue" ? (
                  <ChevronUp className="w-7 h-7 text-slate-400" />
                ) : (
                  <ChevronDown className="w-7 h-7 text-slate-400" />
                )}
              </button>
              {(expandedSection === "dialogue") && (
                <div className="px-7 pb-7">
                  <div className="space-y-4">
                    {selectedCase.dialoguePrompts.map((prompt, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-6 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-2xl border-l-4 border-cyan-400"
                      >
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-6 h-6 text-cyan-300" />
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-xs text-cyan-300 mb-2 uppercase tracking-wide font-bold">
                            建议问诊 · 第 {idx + 1} 句
                          </p>
                          <p className="text-2xl leading-relaxed text-white font-medium">
                            "{prompt.text}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-3xl border border-slate-600/50 overflow-hidden">
              <button
                onClick={() => toggleSection("summary")}
                className="w-full p-7 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg">
                    <Lightbulb className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold mb-1">标准评估摘要（参考答案）</h2>
                    <p className="text-slate-400">学员考核的金标准，讲解结束后展示</p>
                  </div>
                </div>
                {expandedSection === "summary" ? (
                  <ChevronUp className="w-7 h-7 text-slate-400" />
                ) : (
                  <ChevronDown className="w-7 h-7 text-slate-400" />
                )}
              </button>
              {(expandedSection === "summary") && (
                <div className="px-7 pb-7">
                  <div className="p-7 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 rounded-2xl border-2 border-emerald-400/40">
                    <div className="flex items-center gap-3 mb-5">
                      <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                      <span className="text-emerald-300 font-bold text-lg uppercase tracking-wide">
                        标准评估报告（完成练习后展示）
                      </span>
                    </div>
                    <p className="text-xl leading-relaxed text-white/95">
                      {selectedCase.standardSummary}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-5 pb-10">
          <button
            onClick={() => setSelectedCaseId(null)}
            className="flex items-center gap-3 px-8 py-4 bg-slate-700/80 hover:bg-slate-700 text-white rounded-2xl font-bold text-xl transition-all backdrop-blur-sm border border-slate-600"
          >
            <ArrowLeft className="w-6 h-6" />
            切换其他病例
          </button>
          <button
            onClick={() => handleStartPractice(selectedCase.id)}
            className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-2xl hover:from-emerald-600 hover:to-teal-600 hover:shadow-2xl hover:shadow-emerald-900/50 transition-all"
          >
            <Play className="w-7 h-7" />
            🚀 全体学员开始闯关练习
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};
