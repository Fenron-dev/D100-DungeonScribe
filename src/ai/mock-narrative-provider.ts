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
        ? "Ein neues Detail tritt hervor und lädt zu einer Entscheidung ein, ohne die Handlung des Spielercharakters vorwegzunehmen."
        : "A new detail emerges and invites a decision without taking control of the player character.";
    return { narration: `${prefix} ${atmosphere}` };
  }
}
