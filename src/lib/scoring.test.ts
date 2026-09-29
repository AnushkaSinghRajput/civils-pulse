import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { scorePrelimsAttempt } from "./scoring";

describe("scorePrelimsAttempt", () => {
  it("applies positive and negative marks deterministically", () => {
    const result = scorePrelimsAttempt({
      marksPerQuestion: 2,
      negativeMarking: 0.66,
      answers: [
        { questionId: "1", selectedOption: "A", correctOption: "A" },
        { questionId: "2", selectedOption: "B", correctOption: "C" },
        { questionId: "3", selectedOption: null, correctOption: "D" },
      ],
    });

    assert.equal(result.correctCount, 1);
    assert.equal(result.incorrectCount, 1);
    assert.equal(result.unansweredCount, 1);
    assert.equal(result.rawScore, 1.34);
    assert.equal(result.maxScore, 6);
    assert.equal(result.negativeImpact, 0.66);
  });

  it("is reproducible for the same inputs", () => {
    const input = {
      marksPerQuestion: 2,
      negativeMarking: 0.66,
      answers: [
        { questionId: "1", selectedOption: "A", correctOption: "A" },
        { questionId: "2", selectedOption: "a", correctOption: "A" },
      ],
    };
    assert.deepEqual(scorePrelimsAttempt(input), scorePrelimsAttempt(input));
  });
});
