import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCases, getCaseById } from "@/data/cases";
import { CaseData } from "@/types";
import { useGameStore } from "@/store/useGameStore";
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

type TeachingStep = 0 | 1 | 2 | 3 | 4 | 5;

const TEACHING_STEPS = [
  { key: "patient", title: "患者信息与主诉", icon: User, color: "from-indigo-500 to-purple-600" },
  { key: "clues", title: "咬合检查线索", icon: FileText, color: "from-amber-400 to-orange-500" },
  { key: "mistakes", title: "学员常见错误", icon: AlertTriangle, color: "from-red-400 to-rose-600" },
  { key: "dialogue", title: "标准问诊句", icon: MessageCircle, color: "from-cyan-400 to-blue-600" },
  { key: "summary", title: "标准参考答案", icon: Lightbulb, color: "from-emerald-400 to-teal-600" },
  { key: "start", title: "开始闯关练习", icon: Play, color: "from-emerald-500 to-teal-500" },
] as const;

export const TeacherPage = () => {
  const navigate = useNavigate();
  const cases = getAllCases();
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("clues");
  const [currentTeachingStep, setCurrentTeachingStep] = useState<TeachingStep>(0);

  const selectedCase: CaseData | undefined = selectedCaseId
    ? getCaseById(selectedCaseId)
    : undefined;

  const handleStartPractice = (caseId: number) => {
    useGameStore.getState().forceSetCurrentCase(caseId);
    navigate(`/case/${caseId}`);
  };

  const handleSelectCase = (id: number) => {
    setSelectedCaseId(id);
    setCurrentTeachingStep(0);
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
                onClick={() => handleSelectCase(caseData.id)}
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

  const nextStep = () => {
    if (currentTeachingStep < 5) {
      setCurrentTeachingStep((prev) => (prev + 1) as TeachingStep);
    }
  };

  const prevStep = () => {
    if (currentTeachingStep > 0) {
      setCurrentTeachingStep((prev) => (prev - 1) as TeachingStep);
    }
  };

  const goToStep = (step: number) => {
    setCurrentTeachingStep(step as TeachingStep);
  };

  const renderTeachingContent = () => {
    const stepInfo = TEACHING_STEPS[currentTeachingStep];
    const StepIcon = stepInfo.icon;

    switch (currentTeachingStep) {
      case 0:
        return (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center gap-5 mb-8">
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${stepInfo.color} flex items-center justify-center shadow-2xl`}>
                <StepIcon className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-indigo-300 font-bold uppercase tracking-wider mb-1">
                  第 {currentTeachingStep + 1} / {TEACHING_STEPS.length} 步
                </p>
                <h2 className="text-4xl font-bold">{stepInfo.title}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="p-8 bg-slate-800/60 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-5">
                  <User className="w-7 h-7 text-indigo-300" />
                  <h3 className="text-2xl font-bold text-indigo-100">患者基本信息</h3>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-slate-900/40 rounded-2xl">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">年龄</p>
                    <p className="text-2xl font-bold">{selectedCase.patientInfo.age}</p>
                  </div>
                  <div className="text-center p-4 bg-slate-900/40 rounded-2xl">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">性别</p>
                    <p className="text-2xl font-bold">{selectedCase.patientInfo.gender}</p>
                  </div>
                  <div className="text-center p-4 bg-slate-900/40 rounded-2xl">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">职业</p>
                    <p className="text-2xl font-bold text-sm">{selectedCase.patientInfo.occupation}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 rounded-3xl border border-indigo-500/30 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-5">
                  <MessageSquare className="w-7 h-7 text-purple-300" />
                  <h3 className="text-2xl font-bold text-purple-100">患者主诉</h3>
                </div>
                <p className="text-3xl leading-relaxed text-white font-medium">
                  {selectedCase.chiefComplaint}
                </p>
              </div>
            </div>

            <div className="p-8 bg-slate-800/60 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-5">
                <Search className="w-7 h-7 text-cyan-300" />
                <h3 className="text-2xl font-bold text-cyan-100">口内情况描述</h3>
              </div>
              <p className="text-2xl leading-relaxed text-white/95">
                {selectedCase.intraoralDescription}
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center gap-5 mb-8">
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${stepInfo.color} flex items-center justify-center shadow-2xl`}>
                <StepIcon className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-amber-300 font-bold uppercase tracking-wider mb-1">
                  第 {currentTeachingStep + 1} / {TEACHING_STEPS.length} 步
                </p>
                <h2 className="text-4xl font-bold">{stepInfo.title}</h2>
                <p className="text-lg text-slate-400 mt-1">带领学员逐条分析，引导发现异常征象</p>
              </div>
            </div>

            <div className="space-y-5">
              {selectedCase.occlusalClues.map((clue, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-6 p-8 bg-gradient-to-r from-amber-500/15 to-transparent rounded-3xl border-l-8 border-amber-400 hover:from-amber-500/25 transition-colors"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl font-bold flex-shrink-0 shadow-xl shadow-amber-900/40">
                    {idx + 1}
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="text-xs text-amber-300 uppercase tracking-wider font-bold mb-2">
                      咬合线索 · 第 {idx + 1} 条
                    </p>
                    <p className="text-2xl leading-relaxed text-white font-medium">
                      {clue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center gap-5 mb-8">
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${stepInfo.color} flex items-center justify-center shadow-2xl`}>
                <StepIcon className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-red-300 font-bold uppercase tracking-wider mb-1">
                  第 {currentTeachingStep + 1} / {TEACHING_STEPS.length} 步
                </p>
                <h2 className="text-4xl font-bold">{stepInfo.title}</h2>
                <p className="text-lg text-slate-400 mt-1">提前预判问题，带教时重点强调</p>
              </div>
            </div>

            <div className="space-y-5">
              {commonMistakes(selectedCase).map((mistake, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-6 p-7 bg-red-500/10 rounded-3xl border-2 border-red-500/30 hover:border-red-500/50 transition-colors"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl
                    ${mistake.type === "sequence" ? "bg-gradient-to-br from-purple-500 to-violet-600 shadow-purple-900/40" : mistake.type === "finding" ? "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-900/40" : "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-900/40"}`}>
                    {mistake.type === "sequence" ? (
                      <ClipboardList className="w-8 h-8 text-white" />
                    ) : mistake.type === "finding" ? (
                      <XCircle className="w-8 h-8 text-white" />
                    ) : (
                      <MessageCircle className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs px-4 py-1.5 rounded-full font-bold
                        ${mistake.type === "sequence" ? "bg-purple-500/30 text-purple-200" : mistake.type === "finding" ? "bg-red-500/30 text-red-200" : "bg-cyan-500/30 text-cyan-200"}`}>
                        {mistake.type === "sequence" ? "顺序错误" : mistake.type === "finding" ? "诊断错误" : "问诊不足"}
                      </span>
                      <h3 className="text-2xl font-bold text-white">{mistake.title}</h3>
                    </div>
                    <p className="text-xl leading-relaxed text-slate-200">
                      {mistake.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center gap-5 mb-8">
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${stepInfo.color} flex items-center justify-center shadow-2xl`}>
                <StepIcon className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-cyan-300 font-bold uppercase tracking-wider mb-1">
                  第 {currentTeachingStep + 1} / {TEACHING_STEPS.length} 步
                </p>
                <h2 className="text-4xl font-bold">{stepInfo.title}</h2>
                <p className="text-lg text-slate-400 mt-1">示范正确沟通方式，学员可直接套用</p>
              </div>
            </div>

            <div className="space-y-5">
              {selectedCase.dialoguePrompts.map((prompt, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-6 p-8 bg-gradient-to-r from-cyan-500/15 to-transparent rounded-3xl border-l-8 border-cyan-400"
                >
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border-4 border-cyan-400 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-8 h-8 text-cyan-300" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-xs text-cyan-300 mb-3 uppercase tracking-wide font-bold">
                      建议问诊 · 第 {idx + 1} 句
                    </p>
                    <p className="text-3xl leading-relaxed text-white font-semibold">
                      "{prompt.text}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center gap-5 mb-8">
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${stepInfo.color} flex items-center justify-center shadow-2xl`}>
                <StepIcon className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-emerald-300 font-bold uppercase tracking-wider mb-1">
                  第 {currentTeachingStep + 1} / {TEACHING_STEPS.length} 步
                </p>
                <h2 className="text-4xl font-bold">{stepInfo.title}</h2>
                <p className="text-lg text-slate-400 mt-1">学员考核的金标准，讲解结束后展示</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="p-8 bg-slate-800/60 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-5">
                  <Target className="w-7 h-7 text-emerald-300" />
                  <h3 className="text-2xl font-bold text-emerald-100">本关训练要点回顾</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-5 bg-slate-900/40 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center font-bold text-xl flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">规范检查顺序</h4>
                      <p className="text-slate-200 text-lg leading-relaxed">
                        {selectedCase.correctSequence.slice(0, -1).map((s) => getStepName(s)).join(" → ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-5 bg-slate-900/40 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center font-bold text-xl flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">核心学习征象</h4>
                      <p className="text-slate-200 text-lg leading-relaxed">
                        {selectedCase.requiredFindings.map((f) => f.name).join("、")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-800/60 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-5">
                  <ClipboardList className="w-7 h-7 text-amber-300" />
                  <h3 className="text-2xl font-bold text-amber-100">难度与分值</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl">
                    <span className="text-slate-300 text-lg">病例难度</span>
                    <span className={`px-4 py-2 rounded-full font-bold text-lg
                      ${selectedCase.difficulty === "easy" ? "bg-emerald-500/30 text-emerald-300" : selectedCase.difficulty === "medium" ? "bg-amber-500/30 text-amber-300" : "bg-red-500/30 text-red-300"}`}>
                      {selectedCase.difficulty === "easy" ? "入门级" : selectedCase.difficulty === "medium" ? "进阶级" : "挑战级"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl">
                    <span className="text-slate-300 text-lg">满分</span>
                    <span className="text-3xl font-bold text-emerald-400">100 分</span>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl">
                    <span className="text-slate-300 text-lg">检查顺序 / 征象</span>
                    <span className="text-xl font-bold">40 / 60 分</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 bg-gradient-to-br from-emerald-500/20 to-teal-500/15 rounded-3xl border-4 border-emerald-400/50">
              <div className="flex items-center gap-4 mb-7">
                <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                <span className="text-emerald-300 font-bold text-2xl uppercase tracking-wide">
                  标准评估报告（金标准范例）
                </span>
              </div>
              <p className="text-2xl leading-relaxed text-white/95 font-medium">
                {selectedCase.standardSummary}
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="animate-in fade-in duration-500 text-center">
            <div className="flex flex-col items-center mb-10">
              <div className={`w-28 h-28 rounded-[2rem] bg-gradient-to-br ${stepInfo.color} flex items-center justify-center shadow-2xl shadow-emerald-900/40 mb-6`}>
                <StepIcon className="w-14 h-14 text-white" />
              </div>
              <p className="text-emerald-300 font-bold uppercase tracking-wider mb-2">
                第 {currentTeachingStep + 1} / {TEACHING_STEPS.length} 步 · 带教讲解完成
              </p>
              <h2 className="text-5xl font-bold mb-3">准备开始闯关练习！</h2>
              <p className="text-xl text-slate-400 max-w-2xl">
                所有知识点已讲解完毕。现在让全体学员进入闯关模式，
                <br />从第一步「正中咬合检查」开始，独立完成本次病例评估训练。
              </p>
            </div>

            <div className="max-w-2xl mx-auto mb-10 space-y-5">
              <div className="flex items-center justify-between p-6 bg-slate-800/60 rounded-3xl border border-slate-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-slate-400 text-sm">今日带教病例</p>
                    <p className="text-xl font-bold">第 {selectedCase.id} 关 · {selectedCase.title}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-800/60 rounded-3xl border border-slate-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-slate-400 text-sm">检查顺序</p>
                    <p className="text-xl font-bold">
                      {selectedCase.correctSequence.slice(0, -1).map((s) => getStepName(s)).join(" → ")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-800/60 rounded-3xl border border-slate-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-slate-400 text-sm">核心征象（共 {selectedCase.requiredFindings.length} 项）</p>
                    <p className="text-xl font-bold">
                      {selectedCase.requiredFindings.map((f) => f.name).join("、")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStartPractice(selectedCase.id)}
              className="inline-flex items-center gap-4 px-16 py-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-[2rem] font-bold text-3xl hover:from-emerald-600 hover:to-teal-600 hover:shadow-2xl hover:shadow-emerald-900/50 transition-all hover:scale-105 active:scale-100"
            >
              <Play className="w-10 h-10" />
              🚀 全体学员开始闯关
            </button>
          </div>
        );

      default:
        return null;
    }
  };

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
                <p className="text-sm text-slate-400">教师带教视图 · 晨会投屏讲解 · 逐步播放模式</p>
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

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <div className="flex items-center justify-between gap-3 mb-4">
            {TEACHING_STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = idx === currentTeachingStep;
              const isPast = idx < currentTeachingStep;
              return (
                <button
                  key={step.key}
                  onClick={() => goToStep(idx)}
                  className={`flex-1 group relative flex items-center gap-2 p-3 rounded-2xl transition-all duration-300
                    ${isActive
                      ? `bg-gradient-to-r ${step.color} shadow-xl`
                      : isPast
                        ? "bg-slate-700/60 border border-slate-600 hover:bg-slate-700"
                        : "bg-slate-800/40 border border-slate-700/30 hover:bg-slate-800"
                    }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all
                    ${isActive ? "bg-white/20" : isPast ? "bg-emerald-500/30" : "bg-slate-700/80"}`}>
                    {isPast ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    ) : (
                      <StepIcon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`} />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0 hidden sm:block">
                    <p className={`text-xs font-bold uppercase tracking-wide truncate
                      ${isActive ? "text-white/80" : isPast ? "text-emerald-300" : "text-slate-500 group-hover:text-slate-300"}`}>
                      Step {idx + 1}
                    </p>
                    <p className={`text-sm font-bold truncate
                      ${isActive ? "text-white" : isPast ? "text-slate-200" : "text-slate-400 group-hover:text-slate-200"}`}>
                      {step.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentTeachingStep) / (TEACHING_STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-sm rounded-[2rem] border border-slate-700/50 p-10 md:p-14 mb-10 min-h-[600px]">
          {renderTeachingContent()}
        </div>

        <div className="flex items-center justify-between gap-4 pb-6">
          <button
            onClick={prevStep}
            disabled={currentTeachingStep === 0}
            className={`flex items-center gap-3 px-8 py-5 rounded-2xl font-bold text-xl transition-all
              ${currentTeachingStep === 0
                ? "bg-slate-800/50 text-slate-600 cursor-not-allowed border border-slate-700/30"
                : "bg-slate-700/80 hover:bg-slate-700 text-white border border-slate-600 hover:shadow-lg"
              }`}
          >
            <ArrowLeft className="w-6 h-6" />
            上一步
          </button>

          <div className="hidden md:flex items-center gap-2 px-6 py-3 bg-slate-800/60 rounded-2xl border border-slate-700/30">
            <span className="text-slate-400">当前进度：</span>
            <span className="font-bold text-white text-lg">{currentTeachingStep + 1}</span>
            <span className="text-slate-500">/</span>
            <span className="font-bold text-slate-400 text-lg">{TEACHING_STEPS.length}</span>
          </div>

          {currentTeachingStep < TEACHING_STEPS.length - 1 ? (
            <button
              onClick={nextStep}
              className={`flex items-center gap-3 px-8 py-5 rounded-2xl font-bold text-xl transition-all bg-gradient-to-r ${TEACHING_STEPS[currentTeachingStep + 1].color} text-white hover:shadow-xl hover:scale-105 active:scale-100`}
            >
              下一步
              <ChevronRight className="w-6 h-6" />
            </button>
          ) : (
            <button
              onClick={() => handleStartPractice(selectedCase.id)}
              className="flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-xl hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-900/50 transition-all hover:scale-105 active:scale-100"
            >
              <Play className="w-6 h-6" />
              立即开始闯关
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
