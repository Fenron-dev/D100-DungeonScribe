import type {
  CampaignStylePreset,
  CampaignStylePresetDraft,
} from "@/domain/campaign-style-preset";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import type { CampaignStylePresetRepository } from "@/repositories/campaign-style-preset-repository";
import { campaignStylePresetDraftSchema } from "@/schemas/campaign-style-preset";

type PresetRow = Awaited<
  ReturnType<PrismaClient["campaignStylePreset"]["findUnique"]>
>;

function toPrismaJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function mapPreset(row: NonNullable<PresetRow>): CampaignStylePreset {
  const draft = campaignStylePresetDraftSchema.parse({
    name: row.name,
    description: row.description,
    baseTemplateId: row.baseTemplateId,
    style: row.style,
  });
  return {
    id: row.id,
    ...draft,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaCampaignStylePresetRepository
  implements CampaignStylePresetRepository
{
  public constructor(private readonly client: PrismaClient) {}

  public async create(
    draft: CampaignStylePresetDraft,
  ): Promise<CampaignStylePreset> {
    const row = await this.client.campaignStylePreset.create({
      data: {
        name: draft.name,
        description: draft.description,
        baseTemplateId: draft.baseTemplateId,
        style: toPrismaJson(draft.style),
      },
    });
    return mapPreset(row);
  }

  public async list(): Promise<CampaignStylePreset[]> {
    const rows = await this.client.campaignStylePreset.findMany({
      orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
    });
    return rows.map(mapPreset);
  }

  public async remove(id: string): Promise<boolean> {
    const result = await this.client.campaignStylePreset.deleteMany({
      where: { id },
    });
    return result.count > 0;
  }
}
