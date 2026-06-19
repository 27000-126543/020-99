import { DeductionItem, FeedbackItem, CaseData, Finding, OperationStep } from "@/types";

export const getStepName = (step: string): string => {
  const names: Record<string, string> = {
    centric: "正中咬合检查",
    protrusive: "前伸运动检查",
    lateral: "侧方运动检查",
    findings: "征象记录判断",
  };
  return names[step] || step;
};

export const getScoreGrade = (score: number): { grade: string; color: string } => {
  if (score >= 90) return { grade: "优秀", color: "text-emerald-600" };
  if (score >= 75) return { grade: "良好", color: "text-blue-600" };
  if (score >= 60) return { grade: "及格", color: "text-amber-600" };
  return { grade: "不及格", color: "text-red-600" };
};

export const calculateSequenceScore = (
  finalSequence: string[],
  correctSequence: string[],
  feedbackHistory: FeedbackItem[],
  totalPoints: number
): { score: number; deductions: DeductionItem[] } => {
  const deductions: DeductionItem[] = [];
  let score = totalPoints;
  const operationSteps = correctSequence.length - 1;
  const pointsPerStep = Math.floor(totalPoints / operationSteps);
  const remainder = totalPoints - pointsPerStep * operationSteps;

  for (let i = 0; i < operationSteps; i++) {
    const correctStep = correctSequence[i];
    const stepFeedback = feedbackHistory.filter((f) => f.step === i + 1);
    const wrongAttempts = stepFeedback.filter((f) => !f.correct).length;
    const hasCorrect = stepFeedback.some((f) => f.correct);

    if (!hasCorrect) {
      const deduction = i === operationSteps - 1 ? pointsPerStep + remainder : pointsPerStep;
      score -= deduction;
      deductions.push({
        reason: `未完成第 ${i + 1} 步：${getStepName(correctStep)}`,
        points: deduction,
        correctAction: `按照规范流程，第 ${i + 1} 步应先进行：${getStepName(correctStep)}`,
      });
    } else {
      const penaltyEach = Math.ceil(pointsPerStep / 3);
      const totalPenalty = Math.min(pointsPerStep, wrongAttempts * penaltyEach);
      if (totalPenalty > 0) {
        deductions.push({
          reason: `第 ${i + 1} 步「${getStepName(correctStep)}」选错 ${wrongAttempts} 次后才答对`,
          points: totalPenalty,
          correctAction: `标准流程为：${correctSequence
            .slice(0, operationSteps)
            .map((s, idx) => `${idx + 1}.${getStepName(s)}`)
            .join(" → ")}`,
        });
        score -= totalPenalty;
      }
    }
  }

  return { score: Math.max(0, score), deductions };
};

export const calculateFindingsScore = (
  selectedFindings: string[],
  requiredFindings: Finding[],
  decoyFindings: Finding[]
): { score: number; deductions: DeductionItem[] } => {
  const deductions: DeductionItem[] = [];
  let score = 0;
  const totalPossiblePoints = requiredFindings.reduce((sum, f) => sum + f.points, 0);

  const missingFindings = requiredFindings.filter((f) => !selectedFindings.includes(f.id));
  const wrongSelections = decoyFindings.filter((f) => selectedFindings.includes(f.id));

  const correctlyIdentified = requiredFindings.filter((f) => selectedFindings.includes(f.id));
  correctlyIdentified.forEach((f) => {
    score += f.points;
  });

  missingFindings.forEach((f) => {
    deductions.push({
      reason: `遗漏征象：${f.name}`,
      points: f.points,
      correctAction: f.description,
    });
  });

  if (wrongSelections.length > 0) {
    const wrongPenalty = Math.ceil(totalPossiblePoints / 10);
    wrongSelections.forEach((f) => {
      deductions.push({
        reason: `错误选择：${f.name}`,
        points: wrongPenalty,
        correctAction: `本病例中不存在「${f.name}」征象，请鉴别：${f.description}`,
      });
      score -= wrongPenalty;
    });
  }

  return { score: Math.max(0, Math.min(totalPossiblePoints, score)), deductions };
};

export const createSequenceFeedback = (
  stepIndex: number,
  selectedStep: string,
  correctStep: string,
  caseData: CaseData
): FeedbackItem => {
  const isCorrect = selectedStep === correctStep;

  if (isCorrect) {
    let dialoguePrompt = "";
    if (correctStep === "centric") {
      dialoguePrompt = caseData.dialoguePrompts.find((d) => d.trigger === "centric_done")?.text || "";
    } else if (correctStep === "protrusive") {
      dialoguePrompt = caseData.dialoguePrompts.find((d) => d.trigger === "protrusive_done")?.text || "";
    } else if (correctStep === "lateral") {
      dialoguePrompt = caseData.dialoguePrompts.find((d) => d.trigger === "lateral_done")?.text || "";
    }

    return {
      step: stepIndex + 1,
      correct: true,
      message: `✓ 正确！${getStepName(correctStep)}完成。`,
      dialoguePrompt,
    };
  } else {
    return {
      step: stepIndex + 1,
      correct: false,
      message: `✗ 顺序有误。当前第 ${stepIndex + 1} 步应先进行「${getStepName(correctStep)}」，请重新选择。`,
    };
  }
};

export const getFindingsDialoguePrompt = (
  selectedFindings: string[],
  caseData: CaseData
): string | undefined => {
  const hasDeepOverbite = caseData.requiredFindings.some(
    (f) => f.category === "deepOverbite" && selectedFindings.includes(f.id)
  );
  const hasCrossBite = caseData.requiredFindings.some(
    (f) => f.category === "crossBite" && selectedFindings.includes(f.id)
  );
  const hasEarlyContact = caseData.requiredFindings.some(
    (f) => f.category === "earlyContact" && selectedFindings.includes(f.id)
  );
  const hasUnilateralChewing = caseData.requiredFindings.some(
    (f) => f.category === "unilateralChewing" && selectedFindings.includes(f.id)
  );
  const hasOther = caseData.requiredFindings.some(
    (f) => f.category === "other" && selectedFindings.includes(f.id)
  );

  if (hasDeepOverbite) {
    return caseData.dialoguePrompts.find((d) => d.trigger === "deepOverbite_found")?.text;
  }
  if (hasCrossBite) {
    return caseData.dialoguePrompts.find((d) => d.trigger === "crossBite_found")?.text;
  }
  if (hasEarlyContact) {
    return caseData.dialoguePrompts.find((d) => d.trigger === "earlyContact_found")?.text;
  }
  if (hasUnilateralChewing) {
    return caseData.dialoguePrompts.find((d) => d.trigger === "unilateralChewing_found")?.text;
  }
  if (hasOther) {
    return caseData.dialoguePrompts.find((d) => d.trigger === "other_found")?.text;
  }

  return undefined;
};

const getImprovementSuggestions = (deductions: DeductionItem[]): string[] => {
  const suggestions: string[] = [];
  const hasSequenceError = deductions.some((d) => d.reason.includes("步"));
  const hasMissingFinding = deductions.some((d) => d.reason.includes("遗漏"));
  const hasWrongFinding = deductions.some((d) => d.reason.includes("错误选择"));

  if (hasSequenceError) {
    suggestions.push("熟记标准检查顺序：正中咬合 → 前伸/侧方运动 → 征象判断，每次练习默念流程");
    suggestions.push("操作前先回忆下一步是什么，不要着急点击，形成肌肉记忆");
  }
  if (hasMissingFinding) {
    suggestions.push("每条咬合线索对应至少一个征象，建议线索逐条过，对应征象逐个记");
    suggestions.push("重点关注「深覆合、反合、早接触、偏侧咀嚼」四大类典型表现，不要遗漏");
  }
  if (hasWrongFinding) {
    suggestions.push("存在干扰项时，回到口内描述和咬合线索找证据，不能主观臆断");
    suggestions.push("掌握鉴别诊断：深覆合看覆合比例，反合看上下牙位置关系，不要混淆");
  }
  if (!hasSequenceError && !hasMissingFinding && !hasWrongFinding) {
    suggestions.push("本关表现完美！建议挑战更高难度关卡，或尝试用标准诊室话术口述");
    suggestions.push("下一步可练习：在限时内完成评估，模拟真实临床节奏");
  }
  if (suggestions.length === 0) {
    suggestions.push("多做几次同关卡，争取每一步零错误");
    suggestions.push("完成后用复盘报告的标准摘要对照自己的口述");
  }
  return suggestions;
};

export const generateReviewReport = (
  caseData: CaseData,
  selectedSequence: string[],
  selectedFindings: string[],
  score: number,
  deductions: DeductionItem[],
  version: "concise" | "full" = "full"
): string => {
  const operationSteps = caseData.correctSequence.length - 1;
  const correctOps = caseData.correctSequence.slice(0, operationSteps);
  const correctRequiredFindings = caseData.requiredFindings.filter((f) =>
    selectedFindings.includes(f.id)
  );
  const missedFindings = caseData.requiredFindings.filter(
    (f) => !selectedFindings.includes(f.id)
  );
  const grade = getScoreGrade(score);
  const seqNames = correctOps.map((s) => getStepName(s)).join(" → ");
  const suggestions = getImprovementSuggestions(deductions);

  const totalScore = 100;
  const dateStr = new Date().toLocaleDateString("zh-CN");

  if (version === "concise") {
    let report = `====== ${caseData.title} 咬合评估作业（精简版）======\n`;
    report += `提交日期：${dateStr}\n\n`;
    report += `【成绩】得分 ${score} / ${totalScore}（${grade.grade}）\n`;
    if (deductions.length > 0) {
      report += `【扣分原因】共 ${deductions.length} 项，合计 -${deductions.reduce((s, d) => s + d.points, 0)} 分\n`;
      deductions.slice(0, 3).forEach((d, i) => {
        report += `  ${i + 1}. ${d.reason}（-${d.points}分）\n`;
      });
      if (deductions.length > 3) {
        report += `  ... 其余 ${deductions.length - 3} 项详见完整版\n`;
      }
    } else {
      report += `【扣分原因】无扣分，完美完成 🎉\n`;
    }
    report += `\n`;
    report += `【患者主诉】${caseData.chiefComplaint}\n\n`;
    report += `【标准检查顺序】${seqNames}\n`;
    if (selectedSequence.length > 0) {
      const mySeq = selectedSequence.map((s) => getStepName(s)).join(" → ");
      report += `我的操作顺序：${mySeq}\n`;
    }
    report += `\n`;
    report += `【征象识别】正确 ${correctRequiredFindings.length} / 共 ${caseData.requiredFindings.length} 项\n`;
    correctRequiredFindings.forEach((f, idx) => {
      report += `  ✓ ${f.name}\n`;
    });
    if (missedFindings.length > 0) {
      report += `  遗漏：${missedFindings.map((f) => f.name).join("、")}\n`;
    }
    report += `\n`;
    report += `【改进建议】\n`;
    suggestions.slice(0, 2).forEach((s, i) => {
      report += `  ${i + 1}. ${s}\n`;
    });
    report += `\n`;
    report += `【标准诊室表达（3句核心）】\n`;
    caseData.dialoguePrompts.slice(0, 3).forEach((dp) => {
      report += `  · "${dp.text}"\n`;
    });
    report += `\n====== 报告结束 ======`;
    return report;
  }

  let report = `\n================ ${caseData.title} - 咬合评估完整复盘报告 ================\n`;
  report += `【训练信息】\n`;
  report += `  病例编号：第 ${caseData.id} 关\n`;
  report += `  病例难度：${caseData.difficulty === "easy" ? "入门级" : caseData.difficulty === "medium" ? "进阶级" : "挑战级"}\n`;
  report += `  提交日期：${dateStr}\n\n`;

  report += `================ 成绩与等级 ================\n`;
  report += `  最终得分：${score} 分（满分 100 分）\n`;
  report += `  成绩等级：${grade.grade}\n`;
  report += `  优秀标准：≥ 90 分（优秀）；≥ 75 分（良好）；≥ 60 分（及格）\n\n`;

  report += `================ 扣分明细 ================\n`;
  if (deductions.length === 0) {
    report += `  🎉 无任何扣分，完美完成本关！检查流程规范，征象识别准确。\n\n`;
  } else {
    const totalDeduct = deductions.reduce((sum, d) => sum + d.points, 0);
    report += `  共 ${deductions.length} 项问题，累计扣分：${totalDeduct} 分\n\n`;
    deductions.forEach((d, idx) => {
      report += `  [${idx + 1}] ${d.reason}\n`;
      report += `       扣分：-${d.points} 分\n`;
      report += `       正确做法：${d.correctAction}\n\n`;
    });
  }

  report += `================ 改进建议 ================\n`;
  suggestions.forEach((s, i) => {
    report += `  建议 ${i + 1}：${s}\n`;
  });
  report += `\n`;

  report += `================ 患者基本信息 ================\n`;
  report += `  基本情况：${caseData.patientInfo.age}，${caseData.patientInfo.gender}，${caseData.patientInfo.occupation}\n`;
  report += `  患者主诉：${caseData.chiefComplaint}\n\n`;

  report += `================ 检查流程复盘 ================\n`;
  report += `  标准检查顺序：${seqNames}\n`;
  if (selectedSequence.length > 0) {
    const mySeq = selectedSequence.map((s) => getStepName(s)).join(" → ");
    report += `  学员操作顺序：${mySeq}\n`;
    if (mySeq === seqNames) {
      report += `  ✅ 操作顺序完全规范，符合临床标准流程\n`;
    } else {
      report += `  ⚠️  操作存在顺序/尝试错误，建议多次练习形成肌肉记忆\n`;
    }
  } else {
    report += `  学员未完成检查步骤，请重新练习\n`;
  }
  report += `\n`;

  report += `================ 征象识别详情 ================\n`;
  report += `  共需识别 ${caseData.requiredFindings.length} 项异常征象\n`;
  report += `  已正确识别 ${correctRequiredFindings.length} 项，遗漏 ${missedFindings.length} 项\n\n`;

  if (correctRequiredFindings.length > 0) {
    report += `  【已识别征象】\n`;
    correctRequiredFindings.forEach((f, idx) => {
      report += `    ✅ ${idx + 1}. ${f.name}\n`;
      report += `          ${f.description}\n\n`;
    });
  }

  if (missedFindings.length > 0) {
    report += `  【遗漏征象（需补识别）】\n`;
    missedFindings.forEach((f, idx) => {
      report += `    ⚠️  ${idx + 1}. ${f.name}\n`;
      report += `          ${f.description}\n\n`;
    });
  }

  report += `================ 推荐诊室问诊句 ================\n`;
  report += `  （共 ${caseData.dialoguePrompts.length} 句，建议在对应检查环节自然带出）\n\n`;
  caseData.dialoguePrompts.forEach((dp, idx) => {
    report += `  第 ${idx + 1} 句："${dp.text}"\n\n`;
  });

  report += `================ 标准评估摘要（参考范例） ================\n`;
  report += `  ${caseData.standardSummary}\n`;
  report += `\n`;
  report += `================ 报告结束 ================\n`;
  return report;
};
