import type { SceneJournalEntry } from "@/domain/scene-journal";
import {
  deleteSceneMessageAction,
  regenerateSceneMessageAction,
  selectSceneMessageVersionAction,
  updateSceneMessageAction,
  updateSceneNoteAction,
} from "@/features/scenes/actions";
import { SceneEntryEditForm } from "@/features/scenes/scene-journal-forms";
import { AiMessageControls } from "@/features/scenes/ai-message-controls";
import type { SceneAiProfileOption } from "@/features/scenes/scene-composer";
import type { getMessages } from "@/i18n/messages";

interface SceneJournalViewProps {
  campaignId: string;
  sceneId: string;
  journal: SceneJournalEntry[];
  characterNames: Map<string, string>;
  messages: ReturnType<typeof getMessages>;
  mode: "all" | "messages" | "narrator";
  profiles?: SceneAiProfileOption[];
  activeProfileId?: string;
}

export function SceneJournalView({
  campaignId,
  sceneId,
  journal,
  characterNames,
  messages,
  mode,
  profiles = [],
  activeProfileId = "",
}: SceneJournalViewProps) {
  const copy = messages.scenes;
  const entriesAscending = mode === "all"
    ? journal
    : journal.filter((entry) => entry.type === "message" && (
      mode === "messages" || entry.value.role === "narrator"
    ));
  const entries = entriesAscending.toReversed();
  if (entries.length === 0) return <p className="empty-copy">{copy.journalEmpty}</p>;
  return (
    <ol className="scene-journal-list">
      {entries.map((entry) => {
        if (entry.type === "random_event") {
          return (
            <li className="scene-journal-entry random-event-entry" key={entry.value.id}>
              <span className="journal-entry-kind">{messages.oracle.randomEventResultTitle}</span>
              <small className="random-event-trigger">
                {messages.oracle.randomEventTriggerLabel}: {messages.oracle.randomEventTriggers[entry.value.trigger]}
              </small>
              {entry.value.context ? <p className="oracle-question">{entry.value.context}</p> : null}
              <strong className="random-event-focus">{messages.oracle.eventFocuses[entry.value.focus]}</strong>
              <p className="random-event-prompt">
                <span>{messages.oracle.eventActions[entry.value.actionId]}</span>
                {" · "}
                <span>{messages.oracle.eventSubjects[entry.value.subjectId]}</span>
              </p>
              <small>{messages.oracle.randomEventInterpretationHint}</small>
            </li>
          );
        }
        if (entry.type === "inspiration") {
          return (
            <li className="scene-journal-entry inspiration-entry" key={entry.value.id}>
              <span className="journal-entry-kind">{messages.oracle.inspirationResultTitle}</span>
              {entry.value.question ? <p className="oracle-question">{entry.value.question}</p> : null}
              <div className="inspiration-terms">
                <div>
                  <small>{messages.oracle.categories[entry.value.primaryCategory]}</small>
                  <strong>{messages.oracle.terms[entry.value.primaryTermId]}</strong>
                </div>
                <span aria-hidden="true">+</span>
                <div>
                  <small>{messages.oracle.categories[entry.value.secondaryCategory]}</small>
                  <strong>{messages.oracle.terms[entry.value.secondaryTermId]}</strong>
                </div>
              </div>
            </li>
          );
        }
        if (entry.type === "oracle") {
          const modifier = entry.value.modifier >= 0 ? `+${entry.value.modifier}` : String(entry.value.modifier);
          return (
            <li className="scene-journal-entry oracle-entry" key={entry.value.id}>
              <div className="scene-roll-heading">
                <span className="journal-entry-kind">{messages.oracle.resultTitle}</span>
                {entry.value.isDouble ? <span className="oracle-double">{messages.oracle.doubleBadge}</span> : null}
                {entry.value.randomEventTriggered ? (
                  <span className="oracle-event-triggered">{messages.oracle.eventTriggeredBadge}</span>
                ) : null}
              </div>
              <p className="oracle-question">{entry.value.question}</p>
              <strong className="oracle-answer">{messages.oracle.answers[entry.value.answer]}</strong>
              <dl className="roll-facts">
                <div><dt>{messages.oracle.diceLabel}</dt><dd>{entry.value.dice.join(" + ")}</dd></div>
                <div><dt>{messages.oracle.calculationLabel}</dt><dd>{entry.value.rawTotal} {modifier} = {entry.value.adjustedTotal}</dd></div>
                <div><dt>{messages.oracle.tensionAtRollLabel}</dt><dd>{entry.value.tensionAtRoll} / 6</dd></div>
              </dl>
              {entry.value.isDouble ? <small>{messages.oracle.doubleTriggerRule}</small> : null}
            </li>
          );
        }
        if (entry.type === "message") {
          const action = updateSceneMessageAction.bind(null, campaignId, sceneId, entry.value.id);
          const regenerateAction = regenerateSceneMessageAction.bind(
            null,
            campaignId,
            sceneId,
            entry.value.id,
          );
          const selectVersionAction = selectSceneMessageVersionAction.bind(
            null,
            campaignId,
            sceneId,
            entry.value.id,
          );
          const deleteAction = deleteSceneMessageAction.bind(
            null,
            campaignId,
            sceneId,
            entry.value.id,
          );
          return (
            <li
              className={`scene-journal-entry scene-message-entry message-${entry.value.role} source-${entry.value.source}`}
              key={entry.value.id}
            >
              <span className="journal-entry-kind">{copy.messageRoles[entry.value.role]}</span>
              <small className={`message-source source-${entry.value.source}`}>
                {copy.messageSources[entry.value.source]}
              </small>
              <p>{entry.value.content}</p>
              <SceneEntryEditForm
                action={action}
                content={entry.value.content}
                entryId={entry.value.id}
                maxLength={8_000}
                messages={messages}
              />
              {entry.value.source === "ai" ? (
                <AiMessageControls
                  activeProfileId={activeProfileId}
                  content={entry.value.content}
                  deleteAction={deleteAction}
                  messages={messages}
                  profiles={profiles}
                  regenerateAction={regenerateAction}
                  selectVersionAction={selectVersionAction}
                  versions={entry.value.versions}
                />
              ) : null}
            </li>
          );
        }
        if (entry.type === "note") {
          const action = updateSceneNoteAction.bind(null, campaignId, sceneId, entry.value.id);
          return (
            <li className="scene-journal-entry" key={entry.value.id}>
              <span className="journal-entry-kind">{copy.noteKinds[entry.value.kind]}</span>
              <p>{entry.value.content}</p>
              <SceneEntryEditForm
                action={action}
                content={entry.value.content}
                entryId={entry.value.id}
                maxLength={4_000}
                messages={messages}
              />
            </li>
          );
        }
        const characterName = characterNames.get(entry.value.characterId) ?? copy.rollCharacterLabel;
        return (
          <li className="scene-journal-entry scene-roll-entry" key={entry.value.id}>
            <div className="scene-roll-heading">
              <span className="journal-entry-kind">{copy.rollResultTitle} · {characterName}</span>
              <strong className={`roll-outcome outcome-${entry.value.result.degree}`}>
                {copy.outcomes[entry.value.result.degree]}
              </strong>
            </div>
            <p>{entry.value.action}</p>
            <dl className="roll-facts">
              <div><dt>{copy.diceLabel}</dt><dd>{entry.value.result.dice.join(", ")}</dd></div>
              <div><dt>{copy.successesLabel}</dt><dd>{entry.value.result.successes}</dd></div>
              <div><dt>{copy.thresholdLabel}</dt><dd>{entry.value.result.threshold}</dd></div>
              <div><dt>{copy.rulesetLabel}</dt><dd>{entry.value.rulesetId} v{entry.value.rulesetVersion}</dd></div>
            </dl>
          </li>
        );
      })}
    </ol>
  );
}
