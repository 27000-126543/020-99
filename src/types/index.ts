export interface CaseData {
  id: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  patientInfo: {
    age: string;
    gender: string;
    occupation: string;
  };
  chiefComplaint: string;
  intraoralDescription: string;
  occlusalClues: string[];
  correctSequence: string[];
  requiredFindings: Finding[];
  decoyFindings: Finding[];
  dialoguePrompts: DialoguePrompt[];
  standardSummary: string;
  sequencePoints: number;
}

export interface Finding {
  id: string;
  name: string;
  category: "earlyContact" | "deepOverbite" | "crossBite" | "unilateralChewing" | "other";
  description: string;
  points: number;
}

export interface DialoguePrompt {
  trigger: string;
  text: string;
}

export interface UserProgress {
  caseId: number;
  bestScore: number;
  lastScore: number;
  completed: boolean;
  attempts: number;
  lastPlayedAt: number;
}

export interface GameState {
  currentStep: number;
  selectedSequence: string[];
  selectedFindings: string[];
  feedbackHistory: FeedbackItem[];
  score: number;
  deductions: DeductionItem[];
  isComplete: boolean;
}

export interface FeedbackItem {
  step: number;
  correct: boolean;
  message: string;
  dialoguePrompt?: string;
}

export interface DeductionItem {
  reason: string;
  points: number;
  correctAction: string;
}

export type OperationStep = "centric" | "protrusive" | "lateral" | "findings";

export const OPERATION_STEPS: Record<OperationStep, string> = {
  centric: "正中咬合检查",
  protrusive: "前伸运动检查",
  lateral: "侧方运动检查",
  findings: "征象记录判断",
};
