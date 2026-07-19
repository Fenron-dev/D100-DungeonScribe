import type { NarrationRequest, NarrationResult } from "@/ai/narrative-provider";
import type { SceneMessage } from "@/domain/scene-journal";

export interface NarrativeRepository {
  loadContext(
    campaignId: string,
    sceneId: string,
    direction: string,
    locale: "de" | "en",
    excludedMessageId?: string,
  ): Promise<NarrationRequest | null>;
  saveNarration(
    campaignId: string,
    sceneId: string,
    result: NarrationResult,
  ): Promise<SceneMessage | null>;
  replaceNarration(
    campaignId: string,
    sceneId: string,
    messageId: string,
    result: NarrationResult,
  ): Promise<SceneMessage | null>;
}
