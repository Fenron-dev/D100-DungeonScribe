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
  campaigns: {
    eyebrow: string;
    title: string;
    description: string;
    newCampaign: string;
    emptyTitle: string;
    emptyDescription: string;
    activeSection: string;
    archivedSection: string;
    activeStatus: string;
    archivedStatus: string;
    premiseLabel: string;
    nameLabel: string;
    genreLabel: string;
    moodLabel: string;
    optionalHint: string;
    createTitle: string;
    createDescription: string;
    createAction: string;
    creatingAction: string;
    editTitle: string;
    editDescription: string;
    editAction: string;
    savingAction: string;
    openAction: string;
    archiveAction: string;
    editLink: string;
    backToList: string;
    validationMessage: string;
    saveError: string;
    updatedLabel: string;
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
  campaigns: {
    eyebrow: "Kampagnenbibliothek",
    title: "Deine Kampagnen",
    description:
      "Jede Geschichte bleibt als eigener, nachvollziehbarer Kampagnenzustand erhalten.",
    newCampaign: "Neue Kampagne",
    emptyTitle: "Noch keine Kampagne",
    emptyDescription:
      "Lege deine erste Kampagne an und gib ihrer Welt einen Namen und eine Prämisse.",
    activeSection: "Aktive Kampagnen",
    archivedSection: "Archivierte Kampagnen",
    activeStatus: "Aktiv",
    archivedStatus: "Archiviert",
    premiseLabel: "Kampagnenidee",
    nameLabel: "Name",
    genreLabel: "Genre",
    moodLabel: "Stimmung",
    optionalHint: "optional",
    createTitle: "Eine neue Geschichte beginnen",
    createDescription:
      "Die Grundidee lässt sich später jederzeit weiterentwickeln.",
    createAction: "Kampagne erstellen",
    creatingAction: "Kampagne wird erstellt …",
    editTitle: "Kampagne bearbeiten",
    editDescription: "Passe die grundlegende Ausrichtung der Kampagne an.",
    editAction: "Änderungen speichern",
    savingAction: "Änderungen werden gespeichert …",
    openAction: "Kampagne öffnen",
    archiveAction: "Kampagne archivieren",
    editLink: "Bearbeiten",
    backToList: "Zur Kampagnenliste",
    validationMessage: "Bitte prüfe die markierten Felder.",
    saveError: "Die Kampagne konnte nicht gespeichert werden.",
    updatedLabel: "Aktualisiert",
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
  campaigns: {
    eyebrow: "Campaign library",
    title: "Your campaigns",
    description:
      "Every story remains available as its own traceable campaign state.",
    newCampaign: "New campaign",
    emptyTitle: "No campaigns yet",
    emptyDescription:
      "Create your first campaign and give its world a name and premise.",
    activeSection: "Active campaigns",
    archivedSection: "Archived campaigns",
    activeStatus: "Active",
    archivedStatus: "Archived",
    premiseLabel: "Campaign premise",
    nameLabel: "Name",
    genreLabel: "Genre",
    moodLabel: "Mood",
    optionalHint: "optional",
    createTitle: "Begin a new story",
    createDescription: "You can refine the premise at any time later.",
    createAction: "Create campaign",
    creatingAction: "Creating campaign …",
    editTitle: "Edit campaign",
    editDescription: "Adjust the campaign's fundamental direction.",
    editAction: "Save changes",
    savingAction: "Saving changes …",
    openAction: "Open campaign",
    archiveAction: "Archive campaign",
    editLink: "Edit",
    backToList: "Back to campaigns",
    validationMessage: "Please check the highlighted fields.",
    saveError: "The campaign could not be saved.",
    updatedLabel: "Updated",
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
