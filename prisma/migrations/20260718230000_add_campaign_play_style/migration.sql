ALTER TABLE "Campaign" ADD COLUMN "templateId" TEXT NOT NULL DEFAULT 'balanced';
ALTER TABLE "Campaign" ADD COLUMN "futureIdeas" TEXT;
ALTER TABLE "Campaign" ADD COLUMN "style" JSONB NOT NULL DEFAULT '{"seriousness":3,"groundedness":3,"action":3,"combat":3,"sliceOfLife":3,"rulesDensity":3,"danger":3,"lootAmount":3,"lootSignificance":3}';
