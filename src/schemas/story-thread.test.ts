import { describe, expect, it } from "vitest";
import { storyThreadDraftSchema } from "./story-thread";

const validThread = {
  title: " Die wiedergekehrte Straße ",
  premise: " Eine verschwundene Straße ist wieder aufgetaucht. ",
  description: " ",
  status: "open",
  urgency: "4",
  progressCurrent: "1",
  progressTarget: "4",
  relatedEntityIds: ["entity-1"],
  nextPossibleDevelopments: [" Die Straße wechselt erneut ihren Verlauf. "],
};

describe("storyThreadDraftSchema", () => {
  it("normalizes a structured story thread", () => {
    expect(storyThreadDraftSchema.parse(validThread)).toMatchObject({
      title: "Die wiedergekehrte Straße",
      description: null,
      urgency: 4,
      progressCurrent: 1,
      progressTarget: 4,
      nextPossibleDevelopments: ["Die Straße wechselt erneut ihren Verlauf."],
    });
  });

  it("rejects progress beyond its target", () => {
    const result = storyThreadDraftSchema.safeParse({
      ...validThread,
      progressCurrent: 5,
      progressTarget: 4,
    });

    expect(result.success).toBe(false);
  });
});
