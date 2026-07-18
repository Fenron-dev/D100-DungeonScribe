import { describe, expect, it } from "vitest";
import { MockNarrativeProvider } from "@/ai/mock-narrative-provider";
import type { NarrationRequest } from "@/ai/narrative-provider";

const request: NarrationRequest = {
  locale: "de",
  direction: "Zeige eine Spur im Nebel",
  context: {
    campaign: {
      name: "Nebelpfade",
      premise: "Verlorene Wege kehren zurück.",
      genre: "Fantasy",
      mood: "Unheimlich",
      tension: 3,
    },
    scene: {
      title: "Am Leuchtturm",
      actualSetup: "Das Licht ist erloschen.",
      objective: "Den Eingang finden",
      participants: ["Elara"],
      activeThreads: ["Der verlorene Weg"],
    },
  },
};

describe("MockNarrativeProvider", () => {
  it("returns a deterministic narration without a network dependency", async () => {
    const provider = new MockNarrativeProvider();
    await expect(provider.generateNarration(request)).resolves.toEqual(
      await provider.generateNarration(request),
    );
  });
});
