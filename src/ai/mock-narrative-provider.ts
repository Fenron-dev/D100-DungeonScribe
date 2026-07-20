import type {
  NarrativeProvider,
  NarrationRequest,
  NarrationResult,
} from "@/ai/narrative-provider";

export class MockNarrativeProvider implements NarrativeProvider {
  public async generateNarration(request: NarrationRequest): Promise<NarrationResult> {
    const prefix =
      request.locale === "de"
        ? `Die Szene nimmt die Richtung „${request.direction}“ auf.`
        : `The scene follows the direction “${request.direction}”.`;
    const atmosphere =
      request.locale === "de"
        ? "Ein verborgener Durchgang tritt hervor und lädt zu einer Entscheidung ein, ohne die Handlung des Spielercharakters vorwegzunehmen."
        : "A hidden passage emerges and invites a decision without taking control of the player character.";
    return {
      narration: `${prefix} ${atmosphere}`,
      worldSuggestions: [{
        type: "location",
        name: request.locale === "de" ? "Der verborgene Durchgang" : "The hidden passage",
        summary: request.locale === "de"
          ? "Ein neu entdeckter Weg, dessen Ziel noch unbekannt ist."
          : "A newly discovered route whose destination remains unknown.",
      }],
      stateSuggestions: [
        {
          kind: "knowledge",
          title: request.locale === "de" ? "Der verborgene Durchgang" : "The hidden passage",
          content: request.locale === "de"
            ? "Ein bislang unbekannter Durchgang ist an diesem Ort sichtbar geworden."
            : "A previously unknown passage has become visible at this location.",
        },
        {
          kind: "thread",
          title: request.locale === "de" ? "Wohin führt der Durchgang?" : "Where does the passage lead?",
          content: request.locale === "de"
            ? "Das unbekannte Ziel des neu entdeckten Weges bleibt offen."
            : "The destination of the newly discovered route remains unresolved.",
        },
      ],
    };
  }
}
