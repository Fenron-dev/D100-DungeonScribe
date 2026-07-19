"use client";

import { useActionState } from "react";
import type { SceneMessageVersion } from "@/domain/scene-journal";
import {
  initialSceneJournalFormState,
  type SceneJournalFormAction,
} from "@/features/scenes/form-state";
import type { SceneAiProfileOption } from "@/features/scenes/scene-composer";
import type { getMessages } from "@/i18n/messages";

export function AiMessageControls({
  content,
  versions,
  profiles,
  activeProfileId,
  regenerateAction,
  selectVersionAction,
  deleteAction,
  messages,
}: {
  content: string;
  versions: SceneMessageVersion[];
  profiles: SceneAiProfileOption[];
  activeProfileId: string;
  regenerateAction: SceneJournalFormAction;
  selectVersionAction: SceneJournalFormAction;
  deleteAction: SceneJournalFormAction;
  messages: ReturnType<typeof getMessages>;
}) {
  const [regenerateState, regenerateFormAction, isRegenerating] = useActionState(
    regenerateAction,
    initialSceneJournalFormState,
  );
  const [versionState, versionFormAction, isSelecting] = useActionState(
    selectVersionAction,
    initialSceneJournalFormState,
  );
  const [deleteState, deleteFormAction, isDeleting] = useActionState(
    deleteAction,
    initialSceneJournalFormState,
  );
  const copy = messages.scenes;
  const selectedVersion = versions.findLast(({ content: versionContent }) => versionContent === content);
  const failed = regenerateState.message || versionState.message || deleteState.message;
  return (
    <details className="ai-message-controls">
      <summary>{copy.aiMessageOptions}</summary>
      {failed ? <p className="form-message" role="alert">{copy.aiMessageActionError}</p> : null}
      {versions.length > 1 ? (
        <form className="ai-version-form" action={versionFormAction}>
          <label htmlFor={`version-${selectedVersion?.id ?? "current"}`}>{copy.aiVersionLabel}</label>
          <select
            id={`version-${selectedVersion?.id ?? "current"}`}
            name="versionId"
            defaultValue={selectedVersion?.id ?? versions.at(-1)?.id}
          >
            {versions.map((version, index) => (
              <option key={version.id} value={version.id}>
                {copy.aiVersionName.replace("{number}", String(index + 1))}
              </option>
            ))}
          </select>
          <button className="button button-secondary" type="submit" disabled={isSelecting}>
            {copy.aiVersionSelectAction}
          </button>
        </form>
      ) : null}
      <form className="ai-regenerate-form" action={regenerateFormAction}>
        <label htmlFor={`regenerate-${selectedVersion?.id ?? "current"}`}>{copy.aiRegenerateDirectionLabel}</label>
        <input
          id={`regenerate-${selectedVersion?.id ?? "current"}`}
          name="direction"
          maxLength={2_000}
          placeholder={copy.aiRegenerateDirectionPlaceholder}
        />
        {profiles.length > 0 ? (
          <select aria-label={copy.composerModelLabel} name="profileId" defaultValue={activeProfileId}>
            {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.label}</option>)}
          </select>
        ) : <input name="profileId" type="hidden" value="" />}
        <button className="button button-secondary" type="submit" disabled={isRegenerating}>
          {isRegenerating ? copy.aiRegeneratingAction : copy.aiRegenerateAction}
        </button>
      </form>
      <form action={deleteFormAction}>
        <button
          className="button button-danger"
          disabled={isDeleting}
          onClick={(event) => {
            if (!window.confirm(copy.aiDeleteConfirm)) event.preventDefault();
          }}
          type="submit"
        >
          {copy.aiDeleteAction}
        </button>
      </form>
    </details>
  );
}
