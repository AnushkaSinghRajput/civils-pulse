/**
 * Deterministic Prelims scoring.
 * Score must be reproducible from answers + template params alone.
 */

export type ScoreInput = {
  answers: Array<{
    questionId: string;
    selectedOption: string | null;
    correctOption: string | null;
  }>;
  marksPerQuestion: number;
  negativeMarking: number; // e.g. 0.66 ≈ 1/3 of 2 marks
};

export type ScoreBreakdown = {
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  rawScore: number;
  maxScore: number;
  negativeImpact: number;
  perQuestion: Array<{
    questionId: string;
    selectedOption: string | null;
    correctOption: string | null;
    result: "correct" | "incorrect" | "unanswered";
    marks: number;
  }>;
};

export function scorePrelimsAttempt(input: ScoreInput): ScoreBreakdown {
  const { answers, marksPerQuestion, negativeMarking } = input;
  const perQuestion: ScoreBreakdown["perQuestion"] = [];

  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let rawScore = 0;
  let negativeImpact = 0;

  for (const a of answers) {
    if (!a.selectedOption) {
      unansweredCount += 1;
      perQuestion.push({
        questionId: a.questionId,
        selectedOption: null,
        correctOption: a.correctOption,
        result: "unanswered",
        marks: 0,
      });
      continue;
    }

    const isCorrect =
      a.correctOption != null &&
      a.selectedOption.trim().toUpperCase() === a.correctOption.trim().toUpperCase();

    if (isCorrect) {
      correctCount += 1;
      rawScore += marksPerQuestion;
      perQuestion.push({
        questionId: a.questionId,
        selectedOption: a.selectedOption,
        correctOption: a.correctOption,
        result: "correct",
        marks: marksPerQuestion,
      });
    } else {
      incorrectCount += 1;
      rawScore -= negativeMarking;
      negativeImpact += negativeMarking;
      perQuestion.push({
        questionId: a.questionId,
        selectedOption: a.selectedOption,
        correctOption: a.correctOption,
        result: "incorrect",
        marks: -negativeMarking,
      });
    }
  }

  return {
    correctCount,
    incorrectCount,
    unansweredCount,
    rawScore: round2(rawScore),
    maxScore: round2(answers.length * marksPerQuestion),
    negativeImpact: round2(negativeImpact),
    perQuestion,
  };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
