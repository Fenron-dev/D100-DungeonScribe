export const supportedLocales = ["de", "en"] as const;

export type Locale = (typeof supportedLocales)[number];

export interface MessageCatalog {
  appName: string;
  skipToContent: string;
  navigationLabel: string;
  navigation: {
    play: string;
    campaigns: string;
    library: string;
    settings: string;
  };
  home: {
    eyebrow: string;
    title: string;
    description: string;
    lastCampaign: string;
    continueTitle: string;
    continueDescription: string;
    newCampaign: string;
    openCampaigns: string;
    foundationsTitle: string;
    foundations: readonly string[];
  };
  placeholders: {
    playTitle: string;
    campaignsTitle: string;
    libraryTitle: string;
    settingsTitle: string;
    description: string;
    backHome: string;
  };
}

const germanMessages = {
  appName: "D100 DungeonScribe",
  skipToContent: "Zum Inhalt springen",
  navigationLabel: "Hauptnavigation",
  navigation: {
    play: "Spielen",
    campaigns: "Kampagnen",
    library: "Bibliothek",
    settings: "Einstellungen",
  },
  home: {
    eyebrow: "Deine Chronik. Deine Regeln. Deine Welt.",
    title: "Willkommen bei D100 DungeonScribe",
    description:
      "Eine private Werkbank für Solo-Rollenspiele – lokal gedacht, nachvollziehbar und ohne Cloudzwang.",
    lastCampaign: "Letzte Kampagne",
    continueTitle: "Noch ruht die erste Geschichte",
    continueDescription:
      "Sobald du eine Kampagne beginnst, kannst du sie an dieser Stelle direkt fortsetzen.",
    newCampaign: "Neue Kampagne",
    openCampaigns: "Kampagnen ansehen",
    foundationsTitle: "Das Fundament steht",
    foundations: [
      "Kampagnenzustand statt vergänglichem Chatverlauf",
      "Deterministische Regeln und Orakel ohne KI-Abhängigkeit",
      "Prüfbare Änderungen und vollständig exportierbare Daten",
    ],
  },
  placeholders: {
    playTitle: "Spielen",
    campaignsTitle: "Kampagnen",
    libraryTitle: "Bibliothek",
    settingsTitle: "Einstellungen",
    description: "Dieser Bereich wird in einem kommenden Arbeitspaket aufgebaut.",
    backHome: "Zur Startseite",
  },
} as const satisfies MessageCatalog;

const englishMessages = {
  appName: "D100 DungeonScribe",
  skipToContent: "Skip to content",
  navigationLabel: "Main navigation",
  navigation: {
    play: "Play",
    campaigns: "Campaigns",
    library: "Library",
    settings: "Settings",
  },
  home: {
    eyebrow: "Your chronicle. Your rules. Your world.",
    title: "Welcome to D100 DungeonScribe",
    description:
      "A private workbench for solo role-playing games – local-first, traceable, and without a cloud requirement.",
    lastCampaign: "Latest campaign",
    continueTitle: "The first story is still waiting",
    continueDescription:
      "Once you begin a campaign, you can continue it directly from here.",
    newCampaign: "New campaign",
    openCampaigns: "View campaigns",
    foundationsTitle: "The foundation is ready",
    foundations: [
      "Campaign state instead of an ephemeral chat history",
      "Deterministic rules and oracles without an AI dependency",
      "Reviewable changes and fully exportable data",
    ],
  },
  placeholders: {
    playTitle: "Play",
    campaignsTitle: "Campaigns",
    libraryTitle: "Library",
    settingsTitle: "Settings",
    description: "This area will be built in a future work package.",
    backHome: "Back to home",
  },
} as const satisfies MessageCatalog;

const messagesByLocale: Record<Locale, MessageCatalog> = {
  de: germanMessages,
  en: englishMessages,
};

export function getMessages(locale: Locale = "de"): MessageCatalog {
  return messagesByLocale[locale];
}
