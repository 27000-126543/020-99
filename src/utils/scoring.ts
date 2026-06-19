import { DeductionItem, FeedbackItem, CaseData, Finding } from "@/types";

export const calculateSequenceScore = (
  selectedSequence: string[],
  correctSequence: string[],
  totalPoints: number
): { score: number; deductions: DeductionItem[] } => {
  const deductions: DeductionItem[] = [];
  let score = totalPoints;
  const pointsPerStep = Math.floor(totalPoints / (correctSequence.length - 1));

  for (let i = 0; i < selectedSequence.length; i++) {
    if (i < correctSequence.length - 1 && selectedSequence[i] !== correctSequence[i]) {
      const deduction = pointsPerStep;
      score -= deduction;
      deductions.push({
        reason: `第 ${i + 1} 步检查顺序错误`,
        points: deduction,
        correctAction: `正确的第 ${i + 1} 步应该是：${getStepName(correctSequence[i])}`,
      });
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

  if (missingFindings.length > 0) {
    missingFindings.forEach((f) => {
      deductions.push({
        reason: `遗漏征象：${f.name}`,
        points: f.points,
        correctAction: f.description,
      });
    });
  }

  if (wrongSelections.length > 0) {
    wrongSelections.forEach((f) => {
      const penalty = Math.min(5, Math.floor(totalPossiblePoints / requiredFindings.length / 2));
      score -= penalty;
      deductions.push({
        reason: `错误选择：${f.name}`,
        points: penalty,
        correctAction: `该征象在本病例中不存在，请重新鉴别：${f.description}`,
      });
    });
  }

  const correctlyIdentified = requiredFindings.filter((f) => selectedFindings.includes(f.id));
  correctlyIdentified.forEach((f) => {
    score += f.points;
  });

  return { score: Math.max(0, score), deductions };
};

export const getScoreGrade = (score: number): { grade: string; color: string } => {
  if (score >= 90) return { grade: "优秀", color: "text-emerald-600" };
  if (score >= 75) return { grade: "良好", color: "text-blue-600" };
  if (score >= 60) return { grade: "及格", color: "text-amber-600" };
  return { grade: "不及格", color: "text-red-600" };
};

export const getStepName = (step: string): string => {
  const names: Record<string, string> = {
    centric: "正中咬合检查",
    protrusive: "前伸运动检查",
    lateral: "侧方运动检查",
    findings: "征象记录判断",
  };
  return names[step] || step;
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
      message: `✗ 检查顺序有误。第一步应该从${getStepName(correctStep)}开始，请按正确顺序检查。`,
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
