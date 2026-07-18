import type { DiceRoll, SceneNote } from "@/domain/scene-journal";
import type { SceneJournalRepository } from "@/repositories/scene-journal-repository";
import type { D6PoolRuleEngine } from "@/rules/rule-engine";
import type { Ruleset } from "@/rules/ruleset";
import type { CheckInput } from "@/rules/types";
import { campaignIdSchema } from "@/schemas/campaign";
import { diceRollDraftSchema, sceneNoteDraftSchema } from "@/schemas/scene-journal";
import { sceneIdSchema } from "@/schemas/scene";

export class SceneJournalNotFoundError extends Error {
  public constructor() {
    super("Active scene or participating character not found.");
    this.name = "SceneJournalNotFoundError";
  }
}

export class SceneTraitMismatchError extends Error {
  public constructor() {
    super("The selected trait does not belong to the selected character.");
    this.name = "SceneTraitMismatchError";
  }
}

export class SceneJournalService {
  public constructor(
    private readonly repository: SceneJournalRepository,
    private readonly ruleEngine: Pick<D6PoolRuleEngine, "evaluateCheck">,
    private readonly ruleset: Ruleset,
  ) {}

  public async addNote(
    campaignId: string,
    sceneId: string,
    input: unknown,
  ): Promise<SceneNote> {
    const note = await this.repository.addNote(
      campaignIdSchema.parse(campaignId),
      sceneIdSchema.parse(sceneId),
      sceneNoteDraftSchema.parse(input),
    );
    if (!note) throw new SceneJournalNotFoundError();
    return note;
  }

  public async roll(
    campaignId: string,
    sceneId: string,
    input: unknown,
  ): Promise<DiceRoll> {
    const validCampaignId = campaignIdSchema.parse(campaignId);
    const validSceneId = sceneIdSchema.parse(sceneId);
    const draft = diceRollDraftSchema.parse(input);
    const character = await this.repository.findRollCharacter(
      validCampaignId,
      validSceneId,
      draft.characterId,
    );
    if (!character) throw new SceneJournalNotFoundError();
    if (draft.matchingTrait && !character.traits.includes(draft.matchingTrait)) {
      throw new SceneTraitMismatchError();
    }
    const checkInput: CheckInput = {
      characterId: draft.characterId,
      action: draft.action,
      archetypeMatches: draft.archetypeMatches,
      matchingTraits: draft.matchingTrait ? [draft.matchingTrait] : [],
      advantages: draft.advantage ? [{ id: "advantage-1", label: draft.advantage }] : [],
      disadvantages: draft.disadvantage
        ? [{ id: "disadvantage-1", label: draft.disadvantage }]
        : [],
      difficulty: draft.difficulty,
    };
    const result = this.ruleEngine.evaluateCheck(checkInput, this.ruleset);
    const roll = await this.repository.addRoll(validCampaignId, validSceneId, {
      input: checkInput,
      result,
      rulesetId: this.ruleset.id,
      rulesetVersion: this.ruleset.version,
    });
    if (!roll) throw new SceneJournalNotFoundError();
    return roll;
  }

  public async list(campaignId: string, sceneId: string) {
    return this.repository.list(
      campaignIdSchema.parse(campaignId),
      sceneIdSchema.parse(sceneId),
    );
  }
}
