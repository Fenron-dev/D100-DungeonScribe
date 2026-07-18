import { describe, expect, it } from "vitest";
import { RandomEventOracle } from "@/oracle/random-event-oracle";
import {
  eventFocuses,
  randomEventActionIds,
  randomEventSubjectIds,
} from "@/oracle/types";
import { FixedRandomSource } from "@/rules/testing/fixed-random-source";

describe("RandomEventOracle", () => {
  it("generates a reproducible event and explains every draw", () => {
    const result = new RandomEventOracle(new FixedRandomSource([5, 2, 7])).generate();
    expect(result).toEqual({
      focus: "thread_escalates",
      actionId: "event_action.reveal",
      subjectId: "event_subject.evidence",
      affectedEntityId: null,
      explanation: {
        focusIndex: 5,
        focusTableSize: 9,
        actionIndex: 2,
        actionTableSize: 9,
        subjectIndex: 7,
        subjectTableSize: 9,
      },
    });
  });

  it("provides unique non-empty stable tables", () => {
    for (const table of [eventFocuses, randomEventActionIds, randomEventSubjectIds]) {
      expect(table.length).toBeGreaterThanOrEqual(9);
      expect(new Set(table).size).toBe(table.length);
    }
  });
});
