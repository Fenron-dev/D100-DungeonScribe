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
    };
  }
}
