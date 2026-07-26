import { describe, expect, it } from "vitest";
import type {
  CampaignStylePreset,
  CampaignStylePresetDraft,
} from "@/domain/campaign-style-preset";
import { campaignStyleTemplates } from "@/domain/campaign-style";
import type { CampaignStylePresetRepository } from "@/repositories/campaign-style-preset-repository";
import {
  CampaignStylePresetNotFoundError,
  CampaignStylePresetService,
} from "@/services/campaign-style-preset-service";

const now = new Date("2026-07-26T10:00:00.000Z");

class MemoryCampaignStylePresetRepository
  implements CampaignStylePresetRepository
{
  public preset: CampaignStylePreset | null = null;

  public async create(
    draft: CampaignStylePresetDraft,
  ): Promise<CampaignStylePreset> {
    this.preset = {
      id: "preset-1",
      ...draft,
      createdAt: now,
      updatedAt: now,
    };
    return this.preset;
  }

  public async list(): Promise<CampaignStylePreset[]> {
    return this.preset ? [this.preset] : [];
  }

  public async remove(id: string): Promise<boolean> {
    if (this.preset?.id !== id) return false;
    this.preset = null;
    return true;
  }
}

describe("CampaignStylePresetService", () => {
  it("creates and lists a validated personal style preset", async () => {
    const service = new CampaignStylePresetService(
      new MemoryCampaignStylePresetRepository(),
    );
    await expect(
      service.create({
        name: "Düstere Schatzjagd",
        description: "Viele Funde, aber jeder Weg bleibt gefährlich.",
        baseTemplateId: "loot",
        style: { ...campaignStyleTemplates.loot, lootAmount: 4 },
      }),
    ).resolves.toMatchObject({
      id: "preset-1",
      name: "Düstere Schatzjagd",
      style: { lootAmount: 4 },
    });
    await expect(service.list()).resolves.toHaveLength(1);
  });

  it("rejects invalid styles and missing presets", async () => {
    const service = new CampaignStylePresetService(
      new MemoryCampaignStylePresetRepository(),
    );
    await expect(
      service.create({
        name: "Ungültig",
        description: null,
        baseTemplateId: "balanced",
        style: { ...campaignStyleTemplates.balanced, danger: 8 },
      }),
    ).rejects.toThrow();
    await expect(service.remove("preset-missing")).rejects.toBeInstanceOf(
      CampaignStylePresetNotFoundError,
    );
  });
});
