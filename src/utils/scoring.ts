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

export const getScoreGrade = (score: number): { grade: string; color: string } => {
  if (score >= 90) return { grade: "优秀", color: "text-emerald-600" };
  if (score >= 75) return { grade: "良好", color: "text-blue-600" };
  if (score >= 60) return { grade: "及格", color: "text-amber-600" };
  return { grade: "不及格", color: "text-red-600" };
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

export const generateReviewReport = (
  caseData: CaseData,
  selectedSequence: string[],
  selectedFindings: string[]
): string => {
  const operationSteps = caseData.correctSequence.length - 1;
  const correctOps = caseData.correctSequence.slice(0, operationSteps);
  const correctRequiredFindings = caseData.requiredFindings.filter((f) =>
    selectedFindings.includes(f.id)
  );
  const missedFindings = caseData.requiredFindings.filter(
    (f) => !selectedFindings.includes(f.id)
  );

  const seqNames = correctOps.map((s) => getStepName(s)).join(" → ");

  let report = `======= ${caseData.title} - 咬合评估复盘报告 =======\n\n`;
  report += `【患者基本信息】\n`;
  report += `${caseData.patientInfo.age}，${caseData.patientInfo.gender}，${caseData.patientInfo.occupation}\n`;
  report += `主诉：${caseData.chiefComplaint}\n\n`;

  report += `【标准检查顺序】\n${seqNames}\n`;
  if (selectedSequence.length > 0) {
    const mySeq = selectedSequence.map((s) => getStepName(s)).join(" → ");
    report += `我的操作顺序：${mySeq}\n`;
  }
  report += `\n`;

  report += `【已识别的异常征象】\n`;
  if (correctRequiredFindings.length > 0) {
    correctRequiredFindings.forEach((f, idx) => {
      report += `${idx + 1}. ${f.name}：${f.description}\n`;
    });
  } else {
    report += `（未正确识别征象）\n`;
  }
  report += `\n`;

  report += `【建议补充识别】\n`;
  if (missedFindings.length > 0) {
    missedFindings.forEach((f, idx) => {
      report += `${idx + 1}. ${f.name}：${f.description}\n`;
    });
  } else {
    report += `（征象已识别完整）\n`;
  }
  report += `\n`;

  report += `【推荐诊室问诊句】\n`;
  const usedPrompts: string[] = [];
  caseData.dialoguePrompts.forEach((dp) => {
    if (dp.text && !usedPrompts.includes(dp.text)) {
      usedPrompts.push(dp.text);
      report += `· "${dp.text}"\n`;
    }
  });
  report += `\n`;

  report += `【标准评估摘要】\n${caseData.standardSummary}\n`;
  report += `\n======= 报告结束 =======`;

  return report;
};
