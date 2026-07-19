import { narrationResultSchema, type NarrativeProvider } from "@/ai/narrative-provider";
import type { SceneMessage } from "@/domain/scene-journal";
import type { NarrativeRepository } from "@/repositories/narrative-repository";

export class NarrativeService {
  public constructor(
    private readonly repository: NarrativeRepository,
    private readonly provider: NarrativeProvider,
  ) {}

  public async narrate(
    campaignId: string,
    sceneId: string,
    direction: string,
    locale: "de" | "en" = "de",
  ): Promise<SceneMessage | null> {
    const request = await this.repository.loadContext(campaignId, sceneId, direction, locale);
    if (!request) return null;
    const result = narrationResultSchema.parse(await this.provider.generateNarration(request));
    return this.repository.saveNarration(campaignId, sceneId, result);
  }

  public async regenerate(
    campaignId: string,
    sceneId: string,
    messageId: string,
    direction: string,
    locale: "de" | "en" = "de",
  ): Promise<SceneMessage | null> {
    const request = await this.repository.loadContext(
      campaignId,
      sceneId,
      direction,
      locale,
      messageId,
    );
    if (!request) return null;
    const result = narrationResultSchema.parse(await this.provider.generateNarration(request));
    return this.repository.replaceNarration(campaignId, sceneId, messageId, result);
  }
}
