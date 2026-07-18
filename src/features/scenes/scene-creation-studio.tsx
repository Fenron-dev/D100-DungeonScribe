"use client";

import type { Character } from "@/domain/character";
import type { StoryThread } from "@/domain/story-thread";
import type { WorldEntity } from "@/domain/world-entity";
import { generateSceneDraftAction } from "@/features/ai/creative-draft-actions";
import { CreativeDraftPanel } from "@/features/ai/creative-draft-panel";
import type { SceneFormAction } from "@/features/scenes/form-state";
import { SceneForm } from "@/features/scenes/scene-form";
import type { getMessages } from "@/i18n/messages";

export function SceneCreationStudio({
  action,
  campaignId,
  characters,
  entities,
  messages,
  providerMode,
  threads,
}: {
  action: SceneFormAction;
  campaignId: string;
  characters: Character[];
  entities: WorldEntity[];
  messages: ReturnType<typeof getMessages>;
  providerMode: "openai" | "demo";
  threads: StoryThread[];
}) {
  const generator = generateSceneDraftAction.bind(null, campaignId);
  return (
    <CreativeDraftPanel
      action={generator}
      messages={messages}
      mode={providerMode}
      renderForm={(draft, revision) => (
        <SceneForm
          key={revision}
          action={action}
          characters={characters}
          entities={entities}
          messages={messages}
          {...(draft ? { scene: draft } : {})}
          threads={threads}
        />
      )}
    />
  );
}
