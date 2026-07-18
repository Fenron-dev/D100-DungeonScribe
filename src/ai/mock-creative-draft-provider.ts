import type {
  CreativeDraftProvider,
  CreativeDraftRequest,
} from "@/ai/creative-draft-provider";
import type { CampaignDraft } from "@/domain/campaign";
import type { CharacterDraft } from "@/domain/character";
import type { WorldEntityDraft } from "@/domain/world-entity";

const campaignDrafts: CampaignDraft[] = [
  {
    name: "Die Glocken unter dem Moor",
    premise: "Versunkene Glocken rufen jede Nacht Menschen in ein Moor, das sich an ihre verlorenen Erinnerungen erinnert.",
    genre: "Düstere Fantasy",
    mood: "Melancholisch und unheimlich",
  },
  {
    name: "Archiv der letzten Sterne",
    premise: "Eine wandernde Bibliothek bewahrt Sternkarten zu Orten, die am nächsten Morgen aus der Welt verschwinden.",
    genre: "Mystery-Fantasy",
    mood: "Staunend und angespannt",
  },
  {
    name: "Der Zug ohne Fahrplan",
    premise: "Ein verlassener Nachtzug hält nur für Menschen, die eine unmögliche Entscheidung rückgängig machen wollen.",
    genre: "Urban Fantasy",
    mood: "Traumartig und geheimnisvoll",
  },
];

const characterDrafts: CharacterDraft[] = [
  {
    name: "Mara Vey",
    concept: "Eine ehemalige Glockengießerin, die Stimmen aus Metall hören kann und nach ihrer verschwundenen Schwester sucht.",
    archetype: "insightful",
    traits: ["Aufmerksames Gehör", "Altes Handwerk", "Beharrlich"],
    flaw: "Vertraut unheimlichen Stimmen zu schnell",
    notes: "",
  },
  {
    name: "Tarin Kest",
    concept: "Ein ruheloser Kurier, der geheime Wege kennt, aber niemals zweimal denselben Pfad nehmen kann.",
    archetype: "agile",
    traits: ["Schnell", "Orientierungssinn", "Unauffällig"],
    flaw: "Kann keine Herausforderung unbeantwortet lassen",
    notes: "",
  },
  {
    name: "Iven Dorn",
    concept: "Ein ehemaliger Wächter, dessen gebrochener Eid als leuchtende Narbe sichtbar wird, sobald Gefahr naht.",
    archetype: "powerful",
    traits: ["Standhaft", "Einschüchternd", "Beschützend"],
    flaw: "Übernimmt Verantwortung für jedes Scheitern",
    notes: "",
  },
];

const worldDrafts: WorldEntityDraft[] = [
  {
    type: "location",
    name: "Das Haus der rückwärts gehenden Uhren",
    summary: "Ein schmales Stadthaus, in dem jede Uhr auf einen anderen verlorenen Augenblick zuläuft.",
    description: "Hinter beschlagenen Fenstern ticken hunderte Uhren gegeneinander. Wer eine davon anhält, hört für einen Moment eine Stimme aus seiner Vergangenheit.",
    tags: ["Uhren", "Erinnerung", "Geheimnis"],
    status: "active",
    details: { type: "location", region: "Altes Hafenviertel", atmosphere: "Gedämpft und zeitlos" },
  },
  {
    type: "npc",
    name: "Sera ohne Schatten",
    summary: "Eine höfliche Händlerin, die Erinnerungen gegen ungewöhnliche Gefallen tauscht.",
    description: "Sera erscheint stets kurz vor Sonnenuntergang. Ihr Schatten fehlt, doch fremde Schatten wenden sich ihr zu, wenn sie spricht.",
    tags: ["Händlerin", "Erinnerung", "Zwielichtig"],
    status: "active",
    details: { type: "npc", role: "Informationshändlerin", motivation: "Den eigenen Schatten zurückgewinnen" },
  },
  {
    type: "faction",
    name: "Die Kartografen des Regens",
    summary: "Ein verschlossener Bund, der Wege kartiert, die nur während eines Unwetters existieren.",
    description: "Ihre Karten werden mit Regenwasser gezeichnet und verblassen bei klarem Himmel. Niemand weiß, wohin ihr letzter Weg führte.",
    tags: ["Kartografie", "Regen", "Geheimbund"],
    status: "active",
    details: { type: "faction", goal: "Vergängliche Wege bewahren", influence: "Küstenstädte und Passstraßen" },
  },
];

function choose<T>(values: readonly T[], variation: number): T {
  const value = values[variation % values.length];
  if (!value) throw new Error("Mock draft collection is empty");
  return structuredClone(value);
}

export class MockCreativeDraftProvider implements CreativeDraftProvider {
  public async generateCampaign(request: CreativeDraftRequest): Promise<CampaignDraft> {
    return choose(campaignDrafts, request.variation);
  }

  public async generateCharacter(request: CreativeDraftRequest): Promise<CharacterDraft> {
    return choose(characterDrafts, request.variation);
  }

  public async generateWorldEntity(request: CreativeDraftRequest): Promise<WorldEntityDraft> {
    return choose(worldDrafts, request.variation);
  }
}
