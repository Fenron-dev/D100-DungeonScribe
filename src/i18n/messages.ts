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
  characters: {
    sectionTitle: string;
    sectionDescription: string;
    emptyTitle: string;
    emptyDescription: string;
    newCharacter: string;
    createTitle: string;
    createDescription: string;
    editTitle: string;
    editDescription: string;
    nameLabel: string;
    conceptLabel: string;
    archetypeLabel: string;
    archetypePlaceholder: string;
    archetypes: {
      powerful: string;
      agile: string;
      insightful: string;
    };
    traitsLabel: string;
    traitsHint: string;
    traitLabel: string;
    flawLabel: string;
    notesLabel: string;
    optionalHint: string;
    createAction: string;
    creatingAction: string;
    editAction: string;
    savingAction: string;
    editLink: string;
    backToCampaign: string;
    validationMessage: string;
    saveError: string;
  };
  worldEntities: {
    sectionTitle: string;
    sectionDescription: string;
    openRegistry: string;
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    noResults: string;
    newEntity: string;
    createTitle: string;
    createDescription: string;
    editTitle: string;
    editDescription: string;
    typeLabel: string;
    typePlaceholder: string;
    types: { npc: string; location: string; faction: string; item: string };
    nameLabel: string;
    summaryLabel: string;
    descriptionLabel: string;
    tagsLabel: string;
    tagsHint: string;
    statusLabel: string;
    statuses: {
      active: string;
      inactive: string;
      destroyed: string;
      unknown: string;
    };
    detailsTitle: string;
    detailsHint: string;
    detailFields: Record<"npc" | "location" | "faction" | "item", {
      primary: string;
      secondary: string;
    }>;
    relationsTitle: string;
    relationsDescription: string;
    relationTargetLabel: string;
    relationTargetPlaceholder: string;
    relationTypeLabel: string;
    relationTypes: Record<
      "located_at" | "member_of" | "owns" | "allied_with" | "hostile_to" | "connected_to",
      string
    >;
    relationDescriptionLabel: string;
    relationStatusLabel: string;
    relationStatuses: { active: string; inactive: string };
    relationCreateAction: string;
    relationCreatingAction: string;
    relationRemoveAction: string;
    relationIncoming: string;
    relationOutgoing: string;
    relationEmpty: string;
    relationValidationMessage: string;
    relationSaveError: string;
    optionalHint: string;
    searchLabel: string;
    searchPlaceholder: string;
    allTypes: string;
    filterAction: string;
    resetFilter: string;
    createAction: string;
    creatingAction: string;
    editAction: string;
    savingAction: string;
    editLink: string;
    backToCampaign: string;
    backToRegistry: string;
    validationMessage: string;
    saveError: string;
  };
  knowledge: {
    sectionTitle: string;
    sectionDescription: string;
    openRegistry: string;
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    newEntry: string;
    createTitle: string;
    createDescription: string;
    editTitle: string;
    editDescription: string;
    titleLabel: string;
    contentLabel: string;
    typeLabel: string;
    typePlaceholder: string;
    types: Record<
      "fact" | "character_knowledge" | "rumor" | "secret" | "assumption" | "memory",
      string
    >;
    truthStatusLabel: string;
    truthStatuses: Record<"true" | "false" | "partially_true" | "unknown", string>;
    knownByLabel: string;
    knownByHint: string;
    knownByNobody: string;
    relatedEntitiesLabel: string;
    relatedEntitiesHint: string;
    noCharacters: string;
    noEntities: string;
    lockedLabel: string;
    lockedHint: string;
    lockedBadge: string;
    createAction: string;
    creatingAction: string;
    editAction: string;
    savingAction: string;
    editLink: string;
    backToCampaign: string;
    backToRegistry: string;
    validationMessage: string;
    saveError: string;
  };
  storyThreads: {
    sectionTitle: string;
    sectionDescription: string;
    openRegistry: string;
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    newThread: string;
    createTitle: string;
    createDescription: string;
    editTitle: string;
    editDescription: string;
    titleLabel: string;
    premiseLabel: string;
    descriptionLabel: string;
    optionalHint: string;
    statusLabel: string;
    statuses: Record<"open" | "dormant" | "resolved" | "failed", string>;
    urgencyLabel: string;
    urgencyHint: string;
    progressTitle: string;
    progressCurrentLabel: string;
    progressTargetLabel: string;
    progressDisplay: string;
    relatedEntitiesLabel: string;
    relatedEntitiesHint: string;
    noEntities: string;
    developmentsLabel: string;
    developmentsHint: string;
    developmentLabel: string;
    createAction: string;
    creatingAction: string;
    editAction: string;
    savingAction: string;
    editLink: string;
    backToCampaign: string;
    backToRegistry: string;
    validationMessage: string;
    saveError: string;
  };
  chronicle: {
    sectionTitle: string;
    sectionDescription: string;
    openChronicle: string;
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    filterLabel: string;
    filterAction: string;
    resetFilter: string;
    resultLabel: string;
    backToCampaign: string;
    categories: Record<
      "all" | "campaign" | "characters" | "world" | "knowledge" | "threads",
      string
    >;
    eventTypes: Record<
      | "CAMPAIGN_CREATED"
      | "CAMPAIGN_UPDATED"
      | "CAMPAIGN_ARCHIVED"
      | "CHARACTER_CREATED"
      | "CHARACTER_UPDATED"
      | "ENTITY_CREATED"
      | "ENTITY_UPDATED"
      | "ENTITY_RELATION_CREATED"
      | "ENTITY_RELATION_REMOVED"
      | "KNOWLEDGE_DISCOVERED"
      | "KNOWLEDGE_UPDATED"
      | "THREAD_CREATED"
      | "THREAD_UPDATED",
      string
    >;
    sources: Record<"player" | "rule_engine" | "oracle" | "ai" | "manual", string>;
    reversibleBadge: string;
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
  characters: {
    sectionTitle: "Charaktere",
    sectionDescription:
      "Die Figuren dieser Kampagne mit Konzept, Archetyp und prägenden Eigenschaften.",
    emptyTitle: "Noch kein Charakter",
    emptyDescription:
      "Erschaffe die erste Spielfigur und halte fest, was sie besonders macht.",
    newCharacter: "Charakter erstellen",
    createTitle: "Eine Spielfigur erschaffen",
    createDescription:
      "Ein klares Konzept, ein breiter Archetyp und wenige Eigenschaften genügen für den Einstieg.",
    editTitle: "Charakter bearbeiten",
    editDescription: "Passe das Kernprofil der Spielfigur an.",
    nameLabel: "Name",
    conceptLabel: "Konzept",
    archetypeLabel: "Archetyp",
    archetypePlaceholder: "Archetyp auswählen",
    archetypes: {
      powerful: "Kraftvoll",
      agile: "Beweglich",
      insightful: "Scharfsinnig",
    },
    traitsLabel: "Eigenschaften",
    traitsHint: "Eine bis drei frei formulierte Stärken oder Kompetenzen.",
    traitLabel: "Eigenschaft",
    flawLabel: "Schwäche",
    notesLabel: "Notizen",
    optionalHint: "optional",
    createAction: "Charakter speichern",
    creatingAction: "Charakter wird gespeichert …",
    editAction: "Änderungen speichern",
    savingAction: "Änderungen werden gespeichert …",
    editLink: "Charakter bearbeiten",
    backToCampaign: "Zur Kampagne",
    validationMessage: "Bitte prüfe die markierten Felder.",
    saveError: "Der Charakter konnte nicht gespeichert werden.",
  },
  worldEntities: {
    sectionTitle: "Weltregister",
    sectionDescription:
      "Personen, Orte, Fraktionen und Gegenstände bilden den dauerhaften Zustand der Spielwelt.",
    openRegistry: "Weltregister öffnen",
    title: "Die Welt dieser Kampagne",
    description:
      "Durchsuche und pflege die bekannten Bausteine der Spielwelt an einem zentralen Ort.",
    emptyTitle: "Das Weltregister ist noch leer",
    emptyDescription:
      "Lege eine wichtige Person, einen Ort, eine Fraktion oder einen Gegenstand an.",
    noResults: "Keine Weltobjekte entsprechen diesem Filter.",
    newEntity: "Weltobjekt erstellen",
    createTitle: "Ein Weltobjekt anlegen",
    createDescription:
      "Halte die gemeinsame Basis und die passenden typspezifischen Details fest.",
    editTitle: "Weltobjekt bearbeiten",
    editDescription: "Aktualisiere den bekannten Zustand dieses Weltobjekts.",
    typeLabel: "Typ",
    typePlaceholder: "Typ auswählen",
    types: {
      npc: "Person",
      location: "Ort",
      faction: "Fraktion",
      item: "Gegenstand",
    },
    nameLabel: "Name",
    summaryLabel: "Kurzfassung",
    descriptionLabel: "Beschreibung",
    tagsLabel: "Tags",
    tagsHint: "Bis zu acht Begriffe, durch Kommas getrennt.",
    statusLabel: "Status",
    statuses: {
      active: "Aktiv",
      inactive: "Inaktiv",
      destroyed: "Zerstört",
      unknown: "Unbekannt",
    },
    detailsTitle: "Typspezifische Angaben",
    detailsHint: "Diese Angaben bleiben strukturiert und können später gezielt verwendet werden.",
    detailFields: {
      npc: { primary: "Rolle", secondary: "Motivation" },
      location: { primary: "Region", secondary: "Atmosphäre" },
      faction: { primary: "Ziel", secondary: "Einfluss" },
      item: { primary: "Zweck", secondary: "Seltenheit" },
    },
    relationsTitle: "Beziehungen",
    relationsDescription: "Verknüpfe dieses Weltobjekt gerichtet mit einem anderen Objekt der Kampagne.",
    relationTargetLabel: "Zielobjekt",
    relationTargetPlaceholder: "Ziel auswählen",
    relationTypeLabel: "Beziehungstyp",
    relationTypes: {
      located_at: "befindet sich bei",
      member_of: "gehört zu",
      owns: "besitzt",
      allied_with: "ist verbündet mit",
      hostile_to: "ist verfeindet mit",
      connected_to: "ist verbunden mit",
    },
    relationDescriptionLabel: "Beziehungsnotiz",
    relationStatusLabel: "Status",
    relationStatuses: { active: "Aktiv", inactive: "Inaktiv" },
    relationCreateAction: "Beziehung anlegen",
    relationCreatingAction: "Beziehung wird angelegt …",
    relationRemoveAction: "Beziehung entfernen",
    relationIncoming: "Eingehend",
    relationOutgoing: "Ausgehend",
    relationEmpty: "Noch keine Beziehungen vorhanden.",
    relationValidationMessage: "Bitte prüfe die Beziehungsangaben.",
    relationSaveError: "Die Beziehung konnte nicht gespeichert werden.",
    optionalHint: "optional",
    searchLabel: "Weltregister durchsuchen",
    searchPlaceholder: "Name, Kurzfassung oder Tag",
    allTypes: "Alle Typen",
    filterAction: "Filtern",
    resetFilter: "Filter zurücksetzen",
    createAction: "Weltobjekt speichern",
    creatingAction: "Weltobjekt wird gespeichert …",
    editAction: "Änderungen speichern",
    savingAction: "Änderungen werden gespeichert …",
    editLink: "Bearbeiten",
    backToCampaign: "Zur Kampagne",
    backToRegistry: "Zum Weltregister",
    validationMessage: "Bitte prüfe die markierten Felder.",
    saveError: "Das Weltobjekt konnte nicht gespeichert werden.",
  },
  knowledge: {
    sectionTitle: "Kampagnenwissen",
    sectionDescription:
      "Fakten, Charakterwissen, Gerüchte, Geheimnisse, Vermutungen und Erinnerungen bleiben sauber getrennt.",
    openRegistry: "Wissen öffnen",
    title: "Wissen dieser Kampagne",
    description:
      "Halte fest, was wahr ist, wer davon weiß und welche Informationen verborgen bleiben müssen.",
    emptyTitle: "Noch kein Kampagnenwissen",
    emptyDescription:
      "Lege den ersten Fakt, ein Gerücht, ein Geheimnis oder eine Erinnerung an.",
    newEntry: "Wissenseintrag erstellen",
    createTitle: "Wissen festhalten",
    createDescription:
      "Die Wissensart und der Wahrheitsstatus bestimmen, wie dieser Eintrag später verwendet werden darf.",
    editTitle: "Wissenseintrag bearbeiten",
    editDescription: "Aktualisiere Inhalt, Zuordnung und Schutzstatus des Eintrags.",
    titleLabel: "Titel",
    contentLabel: "Inhalt",
    typeLabel: "Wissensart",
    typePlaceholder: "Wissensart auswählen",
    types: {
      fact: "Objektiver Fakt",
      character_knowledge: "Charakterwissen",
      rumor: "Gerücht",
      secret: "Geheimnis",
      assumption: "Vermutung",
      memory: "Erinnerung",
    },
    truthStatusLabel: "Wahrheitsstatus",
    truthStatuses: {
      true: "Wahr",
      false: "Falsch",
      partially_true: "Teilweise wahr",
      unknown: "Unbekannt",
    },
    knownByLabel: "Bekannt bei Charakteren",
    knownByHint:
      "Nicht ausgewählte Charaktere erhalten diesen Eintrag später nicht als bekanntes Wissen.",
    knownByNobody: "Keinem Charakter bekannt",
    relatedEntitiesLabel: "Verknüpfte Weltobjekte",
    relatedEntitiesHint: "Optionaler Bezug zu Personen, Orten, Fraktionen oder Gegenständen.",
    noCharacters: "In dieser Kampagne gibt es noch keine Charaktere.",
    noEntities: "Im Weltregister gibt es noch keine Objekte.",
    lockedLabel: "Eintrag fixieren",
    lockedHint:
      "Fixierte Einträge dürfen später nicht durch automatische Vorschläge überschrieben werden.",
    lockedBadge: "Fixiert",
    createAction: "Wissenseintrag speichern",
    creatingAction: "Wissenseintrag wird gespeichert …",
    editAction: "Änderungen speichern",
    savingAction: "Änderungen werden gespeichert …",
    editLink: "Bearbeiten",
    backToCampaign: "Zur Kampagne",
    backToRegistry: "Zum Kampagnenwissen",
    validationMessage: "Bitte prüfe die markierten Felder.",
    saveError: "Der Wissenseintrag konnte nicht gespeichert werden.",
  },
  storyThreads: {
    sectionTitle: "Handlungsstränge",
    sectionDescription:
      "Offene Fragen und drohende Entwicklungen geben der Kampagne Richtung und Bewegung.",
    openRegistry: "Handlungsstränge öffnen",
    title: "Handlungsstränge der Kampagne",
    description:
      "Verfolge offene, ruhende, gelöste und gescheiterte Entwicklungen samt Dringlichkeit und Fortschritt.",
    emptyTitle: "Noch keine Handlungsstränge",
    emptyDescription:
      "Lege die erste offene Frage, Bedrohung oder Entwicklung dieser Kampagne an.",
    newThread: "Handlungsstrang erstellen",
    createTitle: "Einen Handlungsstrang anlegen",
    createDescription:
      "Beschreibe die Ausgangslage, ihre Dringlichkeit und mögliche nächste Entwicklungen.",
    editTitle: "Handlungsstrang bearbeiten",
    editDescription: "Aktualisiere Status, Fortschritt und mögliche Entwicklungen.",
    titleLabel: "Titel",
    premiseLabel: "Ausgangslage",
    descriptionLabel: "Beschreibung",
    optionalHint: "optional",
    statusLabel: "Status",
    statuses: {
      open: "Offen",
      dormant: "Ruhend",
      resolved: "Gelöst",
      failed: "Gescheitert",
    },
    urgencyLabel: "Dringlichkeit",
    urgencyHint: "1 steht für gering, 5 für unmittelbar.",
    progressTitle: "Fortschritt",
    progressCurrentLabel: "Aktueller Fortschritt",
    progressTargetLabel: "Fortschrittsziel",
    progressDisplay: "Fortschritt",
    relatedEntitiesLabel: "Verknüpfte Weltobjekte",
    relatedEntitiesHint: "Optionaler Bezug zu wichtigen Personen, Orten, Fraktionen oder Gegenständen.",
    noEntities: "Im Weltregister gibt es noch keine Objekte.",
    developmentsLabel: "Mögliche nächste Entwicklungen",
    developmentsHint: "Bis zu fünf Ideen; sie sind Möglichkeiten und noch keine Fakten.",
    developmentLabel: "Entwicklung",
    createAction: "Handlungsstrang speichern",
    creatingAction: "Handlungsstrang wird gespeichert …",
    editAction: "Änderungen speichern",
    savingAction: "Änderungen werden gespeichert …",
    editLink: "Bearbeiten",
    backToCampaign: "Zur Kampagne",
    backToRegistry: "Zu den Handlungssträngen",
    validationMessage: "Bitte prüfe die markierten Felder.",
    saveError: "Der Handlungsstrang konnte nicht gespeichert werden.",
  },
  chronicle: {
    sectionTitle: "Chronik",
    sectionDescription:
      "Alle verbindlichen Änderungen dieser Kampagne bleiben zeitlich geordnet und nachvollziehbar.",
    openChronicle: "Chronik öffnen",
    title: "Chronik der Kampagne",
    description:
      "Die Chronik zeigt gespeicherte Zustandsänderungen, ohne technische Rohdaten offenzulegen.",
    emptyTitle: "Keine Ereignisse in dieser Auswahl",
    emptyDescription: "Wähle eine andere Kategorie oder setze den Filter zurück.",
    filterLabel: "Chronik filtern",
    filterAction: "Filtern",
    resetFilter: "Filter zurücksetzen",
    resultLabel: "Ereignisse",
    backToCampaign: "Zur Kampagne",
    categories: {
      all: "Alle Bereiche",
      campaign: "Kampagne",
      characters: "Charaktere",
      world: "Weltregister",
      knowledge: "Wissen",
      threads: "Handlungsstränge",
    },
    eventTypes: {
      CAMPAIGN_CREATED: "Kampagne begonnen",
      CAMPAIGN_UPDATED: "Kampagne geändert",
      CAMPAIGN_ARCHIVED: "Kampagne archiviert",
      CHARACTER_CREATED: "Charakter erschaffen",
      CHARACTER_UPDATED: "Charakter geändert",
      ENTITY_CREATED: "Weltobjekt angelegt",
      ENTITY_UPDATED: "Weltobjekt geändert",
      ENTITY_RELATION_CREATED: "Beziehung angelegt",
      ENTITY_RELATION_REMOVED: "Beziehung entfernt",
      KNOWLEDGE_DISCOVERED: "Wissen festgehalten",
      KNOWLEDGE_UPDATED: "Wissen geändert",
      THREAD_CREATED: "Handlungsstrang eröffnet",
      THREAD_UPDATED: "Handlungsstrang geändert",
    },
    sources: {
      player: "Spieler",
      rule_engine: "Regel-Engine",
      oracle: "Orakel",
      ai: "Bestätigter KI-Vorschlag",
      manual: "Manuell",
    },
    reversibleBadge: "Änderbar",
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
  characters: {
    sectionTitle: "Characters",
    sectionDescription:
      "The campaign's characters with their concept, archetype, and defining traits.",
    emptyTitle: "No character yet",
    emptyDescription:
      "Create the first player character and record what makes them distinctive.",
    newCharacter: "Create character",
    createTitle: "Create a player character",
    createDescription:
      "A clear concept, one broad archetype, and a few traits are enough to begin.",
    editTitle: "Edit character",
    editDescription: "Adjust the player character's core profile.",
    nameLabel: "Name",
    conceptLabel: "Concept",
    archetypeLabel: "Archetype",
    archetypePlaceholder: "Choose an archetype",
    archetypes: {
      powerful: "Powerful",
      agile: "Agile",
      insightful: "Insightful",
    },
    traitsLabel: "Traits",
    traitsHint: "One to three freely phrased strengths or competencies.",
    traitLabel: "Trait",
    flawLabel: "Flaw",
    notesLabel: "Notes",
    optionalHint: "optional",
    createAction: "Save character",
    creatingAction: "Saving character …",
    editAction: "Save changes",
    savingAction: "Saving changes …",
    editLink: "Edit character",
    backToCampaign: "Back to campaign",
    validationMessage: "Please check the highlighted fields.",
    saveError: "The character could not be saved.",
  },
  worldEntities: {
    sectionTitle: "World registry",
    sectionDescription:
      "People, locations, factions, and items form the persistent state of the game world.",
    openRegistry: "Open world registry",
    title: "This campaign's world",
    description:
      "Search and maintain the known building blocks of the game world in one place.",
    emptyTitle: "The world registry is empty",
    emptyDescription:
      "Add an important person, location, faction, or item.",
    noResults: "No world entities match this filter.",
    newEntity: "Create world entity",
    createTitle: "Create a world entity",
    createDescription:
      "Record the shared foundation and the matching type-specific details.",
    editTitle: "Edit world entity",
    editDescription: "Update the known state of this world entity.",
    typeLabel: "Type",
    typePlaceholder: "Choose a type",
    types: {
      npc: "Person",
      location: "Location",
      faction: "Faction",
      item: "Item",
    },
    nameLabel: "Name",
    summaryLabel: "Summary",
    descriptionLabel: "Description",
    tagsLabel: "Tags",
    tagsHint: "Up to eight comma-separated terms.",
    statusLabel: "Status",
    statuses: {
      active: "Active",
      inactive: "Inactive",
      destroyed: "Destroyed",
      unknown: "Unknown",
    },
    detailsTitle: "Type-specific details",
    detailsHint: "These structured details can be used selectively in future features.",
    detailFields: {
      npc: { primary: "Role", secondary: "Motivation" },
      location: { primary: "Region", secondary: "Atmosphere" },
      faction: { primary: "Goal", secondary: "Influence" },
      item: { primary: "Purpose", secondary: "Rarity" },
    },
    relationsTitle: "Relations",
    relationsDescription: "Create a directed link from this entity to another campaign entity.",
    relationTargetLabel: "Target entity",
    relationTargetPlaceholder: "Choose a target",
    relationTypeLabel: "Relation type",
    relationTypes: {
      located_at: "is located at",
      member_of: "is a member of",
      owns: "owns",
      allied_with: "is allied with",
      hostile_to: "is hostile to",
      connected_to: "is connected to",
    },
    relationDescriptionLabel: "Relation note",
    relationStatusLabel: "Status",
    relationStatuses: { active: "Active", inactive: "Inactive" },
    relationCreateAction: "Create relation",
    relationCreatingAction: "Creating relation …",
    relationRemoveAction: "Remove relation",
    relationIncoming: "Incoming",
    relationOutgoing: "Outgoing",
    relationEmpty: "No relations yet.",
    relationValidationMessage: "Please check the relation fields.",
    relationSaveError: "The relation could not be saved.",
    optionalHint: "optional",
    searchLabel: "Search world registry",
    searchPlaceholder: "Name, summary, or tag",
    allTypes: "All types",
    filterAction: "Filter",
    resetFilter: "Reset filters",
    createAction: "Save world entity",
    creatingAction: "Saving world entity …",
    editAction: "Save changes",
    savingAction: "Saving changes …",
    editLink: "Edit",
    backToCampaign: "Back to campaign",
    backToRegistry: "Back to world registry",
    validationMessage: "Please check the highlighted fields.",
    saveError: "The world entity could not be saved.",
  },
  knowledge: {
    sectionTitle: "Campaign knowledge",
    sectionDescription:
      "Facts, character knowledge, rumors, secrets, assumptions, and memories remain clearly separated.",
    openRegistry: "Open knowledge",
    title: "This campaign's knowledge",
    description:
      "Record what is true, who knows it, and which information must remain hidden.",
    emptyTitle: "No campaign knowledge yet",
    emptyDescription: "Create the first fact, rumor, secret, or memory.",
    newEntry: "Create knowledge entry",
    createTitle: "Record knowledge",
    createDescription:
      "Knowledge type and truth status determine how this entry may be used later.",
    editTitle: "Edit knowledge entry",
    editDescription: "Update the entry's content, associations, and protection status.",
    titleLabel: "Title",
    contentLabel: "Content",
    typeLabel: "Knowledge type",
    typePlaceholder: "Choose a knowledge type",
    types: {
      fact: "Objective fact",
      character_knowledge: "Character knowledge",
      rumor: "Rumor",
      secret: "Secret",
      assumption: "Assumption",
      memory: "Memory",
    },
    truthStatusLabel: "Truth status",
    truthStatuses: {
      true: "True",
      false: "False",
      partially_true: "Partially true",
      unknown: "Unknown",
    },
    knownByLabel: "Known by characters",
    knownByHint:
      "Characters who are not selected will not receive this entry as known context later.",
    knownByNobody: "Known by no character",
    relatedEntitiesLabel: "Related world entities",
    relatedEntitiesHint: "Optional links to people, locations, factions, or items.",
    noCharacters: "This campaign has no characters yet.",
    noEntities: "The world registry has no entities yet.",
    lockedLabel: "Lock entry",
    lockedHint: "Locked entries cannot be overwritten by automatic suggestions later.",
    lockedBadge: "Locked",
    createAction: "Save knowledge entry",
    creatingAction: "Saving knowledge entry …",
    editAction: "Save changes",
    savingAction: "Saving changes …",
    editLink: "Edit",
    backToCampaign: "Back to campaign",
    backToRegistry: "Back to campaign knowledge",
    validationMessage: "Please check the highlighted fields.",
    saveError: "The knowledge entry could not be saved.",
  },
  storyThreads: {
    sectionTitle: "Story threads",
    sectionDescription:
      "Open questions and looming developments give the campaign direction and momentum.",
    openRegistry: "Open story threads",
    title: "Campaign story threads",
    description:
      "Track open, dormant, resolved, and failed developments with urgency and progress.",
    emptyTitle: "No story threads yet",
    emptyDescription: "Create the campaign's first open question, threat, or development.",
    newThread: "Create story thread",
    createTitle: "Create a story thread",
    createDescription:
      "Describe the premise, its urgency, and possible next developments.",
    editTitle: "Edit story thread",
    editDescription: "Update status, progress, and possible developments.",
    titleLabel: "Title",
    premiseLabel: "Premise",
    descriptionLabel: "Description",
    optionalHint: "optional",
    statusLabel: "Status",
    statuses: {
      open: "Open",
      dormant: "Dormant",
      resolved: "Resolved",
      failed: "Failed",
    },
    urgencyLabel: "Urgency",
    urgencyHint: "1 is low, 5 is immediate.",
    progressTitle: "Progress",
    progressCurrentLabel: "Current progress",
    progressTargetLabel: "Progress target",
    progressDisplay: "Progress",
    relatedEntitiesLabel: "Related world entities",
    relatedEntitiesHint: "Optional links to important people, locations, factions, or items.",
    noEntities: "The world registry has no entities yet.",
    developmentsLabel: "Possible next developments",
    developmentsHint: "Up to five ideas; they are possibilities, not established facts.",
    developmentLabel: "Development",
    createAction: "Save story thread",
    creatingAction: "Saving story thread …",
    editAction: "Save changes",
    savingAction: "Saving changes …",
    editLink: "Edit",
    backToCampaign: "Back to campaign",
    backToRegistry: "Back to story threads",
    validationMessage: "Please check the highlighted fields.",
    saveError: "The story thread could not be saved.",
  },
  chronicle: {
    sectionTitle: "Chronicle",
    sectionDescription:
      "Every binding campaign change remains ordered by time and traceable.",
    openChronicle: "Open chronicle",
    title: "Campaign chronicle",
    description:
      "The chronicle shows stored state changes without exposing technical raw data.",
    emptyTitle: "No events in this selection",
    emptyDescription: "Choose another category or reset the filter.",
    filterLabel: "Filter chronicle",
    filterAction: "Filter",
    resetFilter: "Reset filter",
    resultLabel: "Events",
    backToCampaign: "Back to campaign",
    categories: {
      all: "All areas",
      campaign: "Campaign",
      characters: "Characters",
      world: "World registry",
      knowledge: "Knowledge",
      threads: "Story threads",
    },
    eventTypes: {
      CAMPAIGN_CREATED: "Campaign started",
      CAMPAIGN_UPDATED: "Campaign changed",
      CAMPAIGN_ARCHIVED: "Campaign archived",
      CHARACTER_CREATED: "Character created",
      CHARACTER_UPDATED: "Character changed",
      ENTITY_CREATED: "World entity created",
      ENTITY_UPDATED: "World entity changed",
      ENTITY_RELATION_CREATED: "Relation created",
      ENTITY_RELATION_REMOVED: "Relation removed",
      KNOWLEDGE_DISCOVERED: "Knowledge recorded",
      KNOWLEDGE_UPDATED: "Knowledge changed",
      THREAD_CREATED: "Story thread opened",
      THREAD_UPDATED: "Story thread changed",
    },
    sources: {
      player: "Player",
      rule_engine: "Rules engine",
      oracle: "Oracle",
      ai: "Approved AI proposal",
      manual: "Manual",
    },
    reversibleBadge: "Changeable",
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
