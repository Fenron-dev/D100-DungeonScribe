import type {
  CreativeDraftProvider,
  CreativeDraftRequest,
} from "@/ai/creative-draft-provider";
import type { CampaignDraft } from "@/domain/campaign";
import type { CharacterDraft } from "@/domain/character";
import type { WorldEntityDraft } from "@/domain/world-entity";
import type { SceneDraft } from "@/domain/scene";
import { campaignStyleTemplates } from "@/domain/campaign-style";

const campaignDrafts: CampaignDraft[] = [
  {
    name: "Die Glocken unter dem Moor",
    premise: "Versunkene Glocken rufen jede Nacht Menschen in ein Moor, das sich an ihre verlorenen Erinnerungen erinnert.",
    genre: "Düstere Fantasy",
    mood: "Melancholisch und unheimlich",
    templateId: "survival",
    futureIdeas: null,
    style: campaignStyleTemplates.survival,
  },
  {
    name: "Archiv der letzten Sterne",
    premise: "Eine wandernde Bibliothek bewahrt Sternkarten zu Orten, die am nächsten Morgen aus der Welt verschwinden.",
    genre: "Mystery-Fantasy",
    mood: "Staunend und angespannt",
    templateId: "mythic",
    futureIdeas: null,
    style: campaignStyleTemplates.mythic,
  },
  {
    name: "Der Zug ohne Fahrplan",
    premise: "Ein verlassener Nachtzug hält nur für Menschen, die eine unmögliche Entscheidung rückgängig machen wollen.",
    genre: "Urban Fantasy",
    mood: "Traumartig und geheimnisvoll",
    templateId: "balanced",
    futureIdeas: null,
    style: campaignStyleTemplates.balanced,
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

const sceneDrafts: SceneDraft[] = [
  {
    title: "Das Läuten im Nebel",
    locationId: null,
    expectedSetup: "Der Charakter folgt einem fernen Glockenton bis an den Rand eines Ortes, den niemand betreten will.",
    actualSetup: "Als der Nebel für einen Atemzug aufreißt, liegt im feuchten Boden eine frische Spur, die direkt auf den Charakter zuläuft.",
    objective: "Herausfinden, wer oder was die Spur hinterlassen hat.",
    participantCharacterIds: [],
    participantEntityIds: [],
    relevantThreadIds: [],
  },
  {
    title: "Eine Karte mit leerer Stelle",
    locationId: null,
    expectedSetup: "Ein scheinbar gewöhnlicher Auftrag soll den Charakter zu einem sicheren Treffpunkt führen.",
    actualSetup: "Am Treffpunkt wartet niemand. Auf dem Tisch liegt nur eine Karte, auf der sich langsam ein bislang unbekannter Weg einzeichnet.",
    objective: "Entscheiden, ob der unbekannte Weg verfolgt werden soll.",
    participantCharacterIds: [],
    participantEntityIds: [],
    relevantThreadIds: [],
  },
  {
    title: "Der Gast vor Sonnenaufgang",
    locationId: null,
    expectedSetup: "Ein ruhiger Morgen bietet Gelegenheit, sich mit der Umgebung vertraut zu machen.",
    actualSetup: "Noch vor Sonnenaufgang klopft ein erschöpfter Fremder an die Tür und behauptet, den Charakter aus einem Traum zu kennen.",
    objective: "Die Absicht des unerwarteten Gastes einschätzen.",
    participantCharacterIds: [],
    participantEntityIds: [],
    relevantThreadIds: [],
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

  public async generateScene(request: CreativeDraftRequest): Promise<SceneDraft> {
    return choose(sceneDrafts, request.variation);
  }
}
