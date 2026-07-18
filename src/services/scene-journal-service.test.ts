import { describe, expect, it } from "vitest";
import type { Character } from "@/domain/character";
import type {
  DiceRoll,
  SceneJournalEntry,
  SceneMessage,
  SceneMessageDraft,
  SceneNote,
  SceneNoteDraft,
} from "@/domain/scene-journal";
import type {
  PersistedRollDraft,
  SceneJournalRepository,
} from "@/repositories/scene-journal-repository";
import type { RandomSource } from "@/rules/random-source";
import { D6PoolRuleEngine } from "@/rules/rule-engine";
import { coreAdventureRuleset } from "@/rules/ruleset";
import {
  SceneJournalService,
  SceneTraitMismatchError,
} from "@/services/scene-journal-service";

class FixedRandomSource implements RandomSource {
  public constructor(private readonly values: number[]) {}
  public nextInt(): number {
    const value = this.values.shift();
    if (value === undefined) throw new Error("No fixed die left.");
    return value;
  }
}

const character: Character = {
  id: "character-1",
  campaignId: "campaign-1",
  name: "Elara",
  concept: "Kartografin",
  archetype: "insightful",
  traits: ["Arkane Wahrnehmung"],
  flaw: null,
  notes: "",
  createdAt: new Date("2026-07-18T10:00:00Z"),
  updatedAt: new Date("2026-07-18T10:00:00Z"),
};

class InMemoryJournalRepository implements SceneJournalRepository {
  public entries: SceneJournalEntry[] = [];
  public async findRollCharacter() { return character; }
  public async addNote(
    campaignId: string,
    sceneId: string,
    draft: SceneNoteDraft,
  ): Promise<SceneNote> {
    const note = { id: "note-1", campaignId, sceneId, ...draft, createdAt: new Date() };
    this.entries.push({ type: "note", value: note });
    return note;
  }
  public async addMessage(
    campaignId: string,
    sceneId: string,
    draft: SceneMessageDraft,
  ): Promise<SceneMessage> {
    const message: SceneMessage = {
      id: "message-1",
      campaignId,
      sceneId,
      ...draft,
      source: "manual",
      createdAt: new Date(),
    };
    this.entries.push({ type: "message", value: message });
    return message;
  }
  public async addRoll(
    campaignId: string,
    sceneId: string,
    draft: PersistedRollDraft,
  ): Promise<DiceRoll> {
    const roll = {
      id: "roll-1",
      campaignId,
      sceneId,
      characterId: draft.input.characterId,
      action: draft.input.action,
      difficulty: draft.input.difficulty,
      ...draft,
      createdAt: new Date(),
    };
    this.entries.push({ type: "roll", value: roll });
    return roll;
  }
  public async list() { return this.entries; }
}

describe("SceneJournalService", () => {
  it("stores a manual scene message", async () => {
    const repository = new InMemoryJournalRepository();
    const service = new SceneJournalService(
      repository,
      new D6PoolRuleEngine(new FixedRandomSource([5])),
      coreAdventureRuleset,
    );
    const message = await service.addMessage("campaign-1", "scene-1", {
      role: "narrator",
      content: "Die Tür öffnet sich knarrend.",
    });
    expect(message.role).toBe("narrator");
    expect(message.source).toBe("manual");
    expect(repository.entries[0]?.type).toBe("message");
  });

  it("stores a scene note", async () => {
    const repository = new InMemoryJournalRepository();
    const service = new SceneJournalService(
      repository,
      new D6PoolRuleEngine(new FixedRandomSource([5])),
      coreAdventureRuleset,
    );
    const note = await service.addNote("campaign-1", "scene-1", {
      kind: "observation",
      content: "Im Staub sind frische Spuren.",
    });
    expect(note.kind).toBe("observation");
    expect(repository.entries).toHaveLength(1);
  });

  it("evaluates and stores a fully explained deterministic check", async () => {
    const repository = new InMemoryJournalRepository();
    const service = new SceneJournalService(
      repository,
      new D6PoolRuleEngine(new FixedRandomSource([5, 6, 2])),
      coreAdventureRuleset,
    );
    const roll = await service.roll("campaign-1", "scene-1", {
      characterId: "character-1",
      action: "Die Runen entziffern",
      difficulty: "normal",
      archetypeMatches: true,
      matchingTrait: "Arkane Wahrnehmung",
      advantage: null,
      disadvantage: null,
    });
    expect(roll.result.dice).toEqual([5, 6, 2]);
    expect(roll.result.degree).toBe("strong_success");
    expect(roll.result.explanation.requestedDiceCount).toBe(3);
    expect(roll.rulesetVersion).toBe(1);
  });

  it("rejects a trait that does not belong to the character before rolling", async () => {
    const service = new SceneJournalService(
      new InMemoryJournalRepository(),
      new D6PoolRuleEngine(new FixedRandomSource([6])),
      coreAdventureRuleset,
    );
    await expect(service.roll("campaign-1", "scene-1", {
      characterId: "character-1",
      action: "Eine Tür aufbrechen",
      difficulty: "normal",
      archetypeMatches: false,
      matchingTrait: "Bärenstark",
      advantage: null,
      disadvantage: null,
    })).rejects.toBeInstanceOf(SceneTraitMismatchError);
  });
});
