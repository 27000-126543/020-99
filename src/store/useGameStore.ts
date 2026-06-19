import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameState, FeedbackItem, UserProgress, CaseData, DeductionItem } from "@/types";
import {
  calculateSequenceScore,
  calculateFindingsScore,
  createSequenceFeedback,
  getFindingsDialoguePrompt,
} from "@/utils/scoring";

interface GameStore extends GameState {
  userProgress: UserProgress[];
  currentCaseId: number | null;
  currentFeedback: FeedbackItem | null;
  showFeedback: boolean;

  setCurrentCase: (caseId: number) => void;
  forceSetCurrentCase: (caseId: number) => void;
  selectSequenceStep: (step: string, caseData: CaseData) => void;
  toggleFinding: (findingId: string) => void;
  confirmFindings: (caseData: CaseData) => void;
  completeCase: (caseData: CaseData) => { score: number; deductions: DeductionItem[] };
  resetGame: () => void;
  clearFeedback: () => void;
  resetProgress: () => void;
  getProgressForCase: (caseId: number) => UserProgress | undefined;
}

const initialState: GameState = {
  currentStep: 0,
  selectedSequence: [],
  selectedFindings: [],
  feedbackHistory: [],
  score: 0,
  deductions: [],
  isComplete: false,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      userProgress: [],
      currentCaseId: null,
      currentFeedback: null,
      showFeedback: false,

      setCurrentCase: (caseId: number) => {
        set({
          ...initialState,
          currentCaseId: caseId,
        });
      },

      forceSetCurrentCase: (caseId: number) => {
        const existing = get().userProgress.find((p) => p.caseId === caseId);
        const preserved = existing
          ? {
              caseId,
              bestScore: existing.bestScore,
              lastScore: existing.lastScore,
              attempts: existing.attempts,
              completed: existing.completed,
              lastPlayedAt: existing.lastPlayedAt,
            }
          : null;

        const newUserProgress = preserved
          ? [...get().userProgress.filter((p) => p.caseId !== caseId), preserved]
          : get().userProgress;

        set({
          ...initialState,
          currentCaseId: caseId,
          userProgress: newUserProgress,
        });
      },

      selectSequenceStep: (step: string, caseData: CaseData) => {
        const { currentStep, selectedSequence } = get();
        const correctStep = caseData.correctSequence[currentStep];

        if (step === "findings" && currentStep < caseData.correctSequence.length - 1) {
          const feedback = createSequenceFeedback(currentStep, step, correctStep, caseData);
          set({
            currentFeedback: feedback,
            showFeedback: true,
          });
          return;
        }

        if (currentStep >= caseData.correctSequence.length - 1) {
          return;
        }

        const feedback = createSequenceFeedback(currentStep, step, correctStep, caseData);

        if (feedback.correct) {
          const newSelectedSequence = [...selectedSequence, step];
          set((state) => ({
            selectedSequence: newSelectedSequence,
            currentStep: currentStep + 1,
            feedbackHistory: [...state.feedbackHistory, feedback],
            currentFeedback: feedback,
            showFeedback: true,
          }));
        } else {
          set((state) => ({
            feedbackHistory: [...state.feedbackHistory, feedback],
            currentFeedback: feedback,
            showFeedback: true,
          }));
        }
      },

      toggleFinding: (findingId: string) => {
        set((state) => {
          const isSelected = state.selectedFindings.includes(findingId);
          return {
            selectedFindings: isSelected
              ? state.selectedFindings.filter((id) => id !== findingId)
              : [...state.selectedFindings, findingId],
          };
        });
      },

      confirmFindings: (caseData: CaseData) => {
        const { selectedFindings } = get();

        const dialoguePrompt = getFindingsDialoguePrompt(selectedFindings, caseData);

        const selectedRequired = caseData.requiredFindings.filter((f) =>
          selectedFindings.includes(f.id)
        );
        const selectedDecoys = caseData.decoyFindings.filter((f) =>
          selectedFindings.includes(f.id)
        );

        let message = "";
        if (selectedRequired.length > 0 && selectedDecoys.length === 0) {
          message = `✓ 很好！您识别出了 ${selectedRequired.length} 项重要征象。`;
        } else if (selectedDecoys.length > 0) {
          message = `⚠ 您选择了 ${selectedDecoys.length} 项不存在的征象，请仔细鉴别。`;
        } else {
          message = "⚠ 您还未选择任何征象，请仔细观察。";
        }

        const feedback: FeedbackItem = {
          step: get().currentStep + 1,
          correct: selectedDecoys.length === 0 && selectedRequired.length > 0,
          message,
          dialoguePrompt: dialoguePrompt || undefined,
        };

        set((state) => ({
          feedbackHistory: [...state.feedbackHistory, feedback],
          currentFeedback: feedback,
          showFeedback: true,
        }));
      },

      completeCase: (caseData: CaseData) => {
        const { selectedSequence, selectedFindings, userProgress, feedbackHistory } = get();

        const sequenceResult = calculateSequenceScore(
          selectedSequence,
          caseData.correctSequence,
          feedbackHistory,
          caseData.sequencePoints
        );

        const findingsResult = calculateFindingsScore(
          selectedFindings,
          caseData.requiredFindings,
          caseData.decoyFindings
        );

        const totalScore = sequenceResult.score + findingsResult.score;
        const allDeductions = [...sequenceResult.deductions, ...findingsResult.deductions];

        const existingProgress = userProgress.find((p) => p.caseId === caseData.id);
        const previousBest = existingProgress?.bestScore || 0;
        const previousAttempts = existingProgress?.attempts || 0;

        const newProgress: UserProgress = {
          caseId: caseData.id,
          bestScore: Math.max(previousBest, totalScore),
          lastScore: totalScore,
          completed: true,
          attempts: previousAttempts + 1,
          lastPlayedAt: Date.now(),
        };

        set((state) => ({
          score: totalScore,
          deductions: allDeductions,
          isComplete: true,
          userProgress: [
            ...state.userProgress.filter((p) => p.caseId !== caseData.id),
            newProgress,
          ],
        }));

        return { score: totalScore, deductions: allDeductions };
      },

      resetGame: () => {
        set({
          ...initialState,
        });
      },

      clearFeedback: () => {
        set({
          showFeedback: false,
          currentFeedback: null,
        });
      },

      resetProgress: () => {
        set({
          userProgress: [],
          ...initialState,
        });
      },

      getProgressForCase: (caseId: number) => {
        return get().userProgress.find((p) => p.caseId === caseId);
      },
    }),
    {
      name: "occlusion-training-storage",
      partialize: (state) => ({
        userProgress: state.userProgress,
      }),
      migrate: (persistedState: any, version) => {
        if (persistedState && persistedState.userProgress) {
          const migratedProgress = persistedState.userProgress.map((p: any) => ({
            caseId: p.caseId,
            bestScore: p.bestScore ?? p.score ?? 0,
            lastScore: p.lastScore ?? p.score ?? 0,
            completed: p.completed ?? false,
            attempts: p.attempts ?? (p.completed ? 1 : 0),
            lastPlayedAt: p.lastPlayedAt ?? Date.now(),
          }));
          return { ...persistedState, userProgress: migratedProgress };
        }
        return persistedState;
      },
    }
  )
);
