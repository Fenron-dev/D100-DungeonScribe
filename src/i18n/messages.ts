import type {
  EventFocus,
  InspirationCategory,
  InspirationTermId,
  RandomEventActionId,
  RandomEventSubjectId,
} from "@/oracle/types";

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
    tensionLabel: string;
    tensionDescription: string;
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
  scenes: {
    sectionTitle: string;
    sectionDescription: string;
    openScenes: string;
    title: string;
    description: string;
    activeTitle: string;
    completedTitle: string;
    emptyTitle: string;
    emptyDescription: string;
    newScene: string;
    createTitle: string;
    createDescription: string;
    titleLabel: string;
    locationLabel: string;
    noLocation: string;
    expectedSetupLabel: string;
    actualSetupLabel: string;
    actualSetupHint: string;
    objectiveLabel: string;
    optionalHint: string;
    charactersLabel: string;
    charactersHint: string;
    entitiesLabel: string;
    entitiesHint: string;
    threadsLabel: string;
    threadsHint: string;
    noCharacters: string;
    noEntities: string;
    noThreads: string;
    startAction: string;
    startingAction: string;
    openAction: string;
    activeStatus: string;
    completedStatus: string;
    expectedSetupTitle: string;
    actualSetupTitle: string;
    objectiveTitle: string;
    participantsTitle: string;
    relatedThreadsTitle: string;
    completeTitle: string;
    completeDescription: string;
    summaryLabel: string;
    tensionAdjustmentLabel: string;
    tensionAdjustmentHint: string;
    tensionAdjustments: Record<"decrease" | "steady" | "increase", string>;
    completeAction: string;
    completingAction: string;
    summaryTitle: string;
    backToCampaign: string;
    backToScenes: string;
    validationMessage: string;
    saveError: string;
    activeExistsError: string;
    journalTitle: string;
    journalDescription: string;
    journalEmpty: string;
    messageTitle: string;
    messageDescription: string;
    messageRoleLabel: string;
    messageRoles: Record<"player" | "narrator", string>;
    messageContentLabel: string;
    sendMessageAction: string;
    sendingMessageAction: string;
    noteTitle: string;
    noteKindLabel: string;
    noteKinds: Record<"action" | "observation", string>;
    noteContentLabel: string;
    saveNoteAction: string;
    savingNoteAction: string;
    rollTitle: string;
    rollDescription: string;
    rollCharacterLabel: string;
    rollCharacterPlaceholder: string;
    rollActionLabel: string;
    difficultyLabel: string;
    difficulties: Record<"easy" | "normal" | "hard", string>;
    matchingTraitLabel: string;
    archetypeMatchesLabel: string;
    archetypeMatchesHint: string;
    advantageLabel: string;
    disadvantageLabel: string;
    rollAction: string;
    rollingAction: string;
    journalSaveError: string;
    traitMismatchError: string;
    rollResultTitle: string;
    outcomes: Record<
      "critical_failure" | "failure" | "success_with_cost" | "success" | "strong_success",
      string
    >;
    diceLabel: string;
    successesLabel: string;
    thresholdLabel: string;
    rulesetLabel: string;
  };
  oracle: {
    formTitle: string;
    formDescription: string;
    questionLabel: string;
    likelihoodLabel: string;
    likelihoods: Record<
      "nearly_impossible" | "unlikely" | "even" | "likely" | "nearly_certain",
      string
    >;
    askAction: string;
    askingAction: string;
    validationMessage: string;
    saveError: string;
    resultTitle: string;
    answers: Record<
      "no_and" | "no" | "no_but" | "uncertain" | "yes_but" | "yes" | "yes_and",
      string
    >;
    diceLabel: string;
    calculationLabel: string;
    doubleBadge: string;
    tensionAtRollLabel: string;
    doubleTriggerRule: string;
    eventTriggeredBadge: string;
    inspirationTitle: string;
    inspirationDescription: string;
    detailQuestionLabel: string;
    detailQuestionHint: string;
    primaryCategoryLabel: string;
    secondaryCategoryLabel: string;
    categories: Record<InspirationCategory, string>;
    drawAction: string;
    drawingAction: string;
    inspirationResultTitle: string;
    terms: Record<InspirationTermId, string>;
    randomEventTitle: string;
    randomEventDescription: string;
    randomEventContextLabel: string;
    randomEventContextHint: string;
    generateEventAction: string;
    generatingEventAction: string;
    randomEventResultTitle: string;
    randomEventInterpretationHint: string;
    randomEventTriggerLabel: string;
    randomEventTriggers: Record<"manual" | "double", string>;
    eventFocuses: Record<EventFocus, string>;
    eventActions: Record<RandomEventActionId, string>;
    eventSubjects: Record<RandomEventSubjectId, string>;
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
      | "all"
      | "campaign"
      | "characters"
      | "world"
      | "knowledge"
      | "threads"
      | "scenes",
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
      | "THREAD_UPDATED"
      | "SCENE_STARTED"
      | "SCENE_NOTE_ADDED"
      | "SCENE_MESSAGE_ADDED"
      | "DICE_ROLLED"
      | "ORACLE_ANSWERED"
      | "ORACLE_INSPIRATION_DRAWN"
      | "ORACLE_RANDOM_EVENT_GENERATED"
      | "TENSION_CHANGED"
      | "SCENE_COMPLETED",
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
    tensionLabel: "Spannung",
    tensionDescription: "Beeinflusst, welche Pasche unerwartete Ereignisse auslösen.",
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
  scenes: {
    sectionTitle: "Szenen",
    sectionDescription:
      "Beginne eine konkrete Spielsituation und schließe sie mit einer dauerhaften Zusammenfassung ab.",
    openScenes: "Szenen öffnen",
    title: "Szenen der Kampagne",
    description:
      "Eine Kampagne besitzt höchstens eine aktive Szene; abgeschlossene Szenen bleiben als Verlauf erhalten.",
    activeTitle: "Aktive Szene",
    completedTitle: "Abgeschlossene Szenen",
    emptyTitle: "Noch keine Szenen",
    emptyDescription: "Beginne die erste konkrete Spielsituation dieser Kampagne.",
    newScene: "Neue Szene beginnen",
    createTitle: "Eine Szene beginnen",
    createDescription:
      "Lege Ausgangssituation, tatsächlichen Beginn, Ort, Beteiligte und relevante Handlungsstränge fest.",
    titleLabel: "Szenentitel",
    locationLabel: "Ort",
    noLocation: "Kein fester Ort",
    expectedSetupLabel: "Erwartete Ausgangssituation",
    actualSetupLabel: "Tatsächlicher Szenenbeginn",
    actualSetupHint: "Ohne Orakel kann der tatsächliche Beginn der erwarteten Situation entsprechen.",
    objectiveLabel: "Szenenziel",
    optionalHint: "optional",
    charactersLabel: "Beteiligte Charaktere",
    charactersHint: "Wähle die Spielfiguren, die an dieser Szene teilnehmen.",
    entitiesLabel: "Beteiligte Weltobjekte",
    entitiesHint: "Wähle wichtige Personen, Orte, Fraktionen oder Gegenstände.",
    threadsLabel: "Relevante Handlungsstränge",
    threadsHint: "Diese Auswahl stellt einen Bezug her und verändert den Handlungsstrang nicht.",
    noCharacters: "In dieser Kampagne gibt es noch keine Charaktere.",
    noEntities: "Im Weltregister gibt es noch keine Objekte.",
    noThreads: "Es gibt noch keine Handlungsstränge.",
    startAction: "Szene beginnen",
    startingAction: "Szene wird begonnen …",
    openAction: "Szene öffnen",
    activeStatus: "Aktiv",
    completedStatus: "Abgeschlossen",
    expectedSetupTitle: "Erwartete Situation",
    actualSetupTitle: "Aktueller Szenenbeginn",
    objectiveTitle: "Ziel",
    participantsTitle: "Beteiligte",
    relatedThreadsTitle: "Relevante Handlungsstränge",
    completeTitle: "Szene abschließen",
    completeDescription:
      "Fasse die wichtigsten Geschehnisse zusammen. Einzelne Weltänderungen bleiben weiterhin eigene, nachvollziehbare Aktionen.",
    summaryLabel: "Szenenzusammenfassung",
    tensionAdjustmentLabel: "Spannung nach der Szene",
    tensionAdjustmentHint:
      "Sinkt oder steigt höchstens um eine Stufe und bleibt zwischen 1 und 6.",
    tensionAdjustments: {
      decrease: "Ruhiger (−1)",
      steady: "Unverändert (±0)",
      increase: "Angespannter (+1)",
    },
    completeAction: "Szene abschließen",
    completingAction: "Szene wird abgeschlossen …",
    summaryTitle: "Zusammenfassung",
    backToCampaign: "Zur Kampagne",
    backToScenes: "Zu den Szenen",
    validationMessage: "Bitte prüfe die markierten Felder.",
    saveError: "Die Szene konnte nicht gespeichert werden.",
    activeExistsError: "Diese Kampagne besitzt bereits eine aktive Szene.",
    journalTitle: "Spielprotokoll",
    journalDescription:
      "Handlungen, Beobachtungen und Proben bleiben in ihrer zeitlichen Reihenfolge erhalten.",
    journalEmpty: "Für diese Szene gibt es noch keinen Protokolleintrag.",
    messageTitle: "Szenendialog",
    messageDescription:
      "Halte Spielerhandlungen und manuelle Erzählantworten als fortlaufenden Dialog fest.",
    messageRoleLabel: "Beitrag von",
    messageRoles: { player: "Spieler", narrator: "Erzähler" },
    messageContentLabel: "Nachricht",
    sendMessageAction: "Nachricht speichern",
    sendingMessageAction: "Nachricht wird gespeichert …",
    noteTitle: "Eintrag festhalten",
    noteKindLabel: "Eintragsart",
    noteKinds: { action: "Handlung", observation: "Beobachtung" },
    noteContentLabel: "Eintrag",
    saveNoteAction: "Eintrag speichern",
    savingNoteAction: "Eintrag wird gespeichert …",
    rollTitle: "Probe auswerten",
    rollDescription:
      "Die Regel-Engine bildet den Würfelpool aus Archetyp, Eigenschaft sowie Vor- und Nachteilen.",
    rollCharacterLabel: "Handelnder Charakter",
    rollCharacterPlaceholder: "Charakter auswählen",
    rollActionLabel: "Beabsichtigte Handlung",
    difficultyLabel: "Schwierigkeit",
    difficulties: { easy: "Leicht", normal: "Normal", hard: "Schwer" },
    matchingTraitLabel: "Passende Eigenschaft (optional)",
    archetypeMatchesLabel: "Archetyp passt zur Handlung",
    archetypeMatchesHint: "Gibt einen zusätzlichen Würfel.",
    advantageLabel: "Vorteil (optional)",
    disadvantageLabel: "Nachteil (optional)",
    rollAction: "Würfeln",
    rollingAction: "Probe wird ausgewertet …",
    journalSaveError: "Der Protokolleintrag konnte nicht gespeichert werden.",
    traitMismatchError: "Die Eigenschaft gehört nicht zum ausgewählten Charakter.",
    rollResultTitle: "Probe",
    outcomes: {
      critical_failure: "Kritischer Fehlschlag",
      failure: "Fehlschlag",
      success_with_cost: "Erfolg mit Kosten",
      success: "Erfolg",
      strong_success: "Starker Erfolg",
    },
    diceLabel: "Würfel",
    successesLabel: "Erfolge",
    thresholdLabel: "Erfolg ab",
    rulesetLabel: "Regelwerk",
  },
  oracle: {
    formTitle: "Ja-Nein-Orakel",
    formDescription:
      "Stelle eine eindeutige Frage und schätze ein, wie wahrscheinlich ein Ja ist.",
    questionLabel: "Orakelfrage",
    likelihoodLabel: "Wahrscheinlichkeit für Ja",
    likelihoods: {
      nearly_impossible: "Nahezu unmöglich (−4)",
      unlikely: "Unwahrscheinlich (−2)",
      even: "Ausgeglichen (±0)",
      likely: "Wahrscheinlich (+2)",
      nearly_certain: "Nahezu sicher (+4)",
    },
    askAction: "Orakel befragen",
    askingAction: "Orakel wird befragt …",
    validationMessage: "Bitte prüfe die Orakelfrage.",
    saveError: "Das Orakelergebnis konnte nicht gespeichert werden.",
    resultTitle: "Orakel",
    answers: {
      no_and: "Nein, und zusätzlich …",
      no: "Nein",
      no_but: "Nein, aber …",
      uncertain: "Ungewiss oder situationsabhängig",
      yes_but: "Ja, aber …",
      yes: "Ja",
      yes_and: "Ja, und zusätzlich …",
    },
    diceLabel: "2W6",
    calculationLabel: "Auswertung",
    doubleBadge: "Pasch",
    tensionAtRollLabel: "Spannung beim Wurf",
    doubleTriggerRule: "Ein Pasch löst aus, wenn sein Würfelwert höchstens der Spannung entspricht.",
    eventTriggeredBadge: "Ereignis ausgelöst",
    inspirationTitle: "Offene Inspiration",
    inspirationDescription:
      "Ziehe zwei Begriffe für eine offene Idee oder als Antwort auf eine optionale Detailfrage.",
    detailQuestionLabel: "Detailfrage (optional)",
    detailQuestionHint: "Zum Beispiel: Was ist an diesem Ort ungewöhnlich?",
    primaryCategoryLabel: "Erster Begriff",
    secondaryCategoryLabel: "Zweiter Begriff",
    categories: {
      action: "Handlung",
      theme: "Thema",
      mood: "Stimmung",
      person: "Person",
      item: "Gegenstand",
      location: "Ort",
      danger: "Gefahr",
      discovery: "Entdeckung",
      complication: "Komplikation",
    },
    drawAction: "Inspiration ziehen",
    drawingAction: "Inspiration wird gezogen …",
    inspirationResultTitle: "Inspiration",
    terms: {
      "action.reveal": "Enthüllen", "action.protect": "Beschützen",
      "action.transform": "Verwandeln", "action.pursue": "Verfolgen",
      "action.betray": "Verraten", "theme.debt": "Schuld",
      "theme.freedom": "Freiheit", "theme.loss": "Verlust",
      "theme.legacy": "Vermächtnis", "theme.trust": "Vertrauen",
      "mood.uneasy": "Unbehaglich", "mood.hopeful": "Hoffnungsvoll",
      "mood.solemn": "Feierlich", "mood.urgent": "Dringlich",
      "mood.mysterious": "Rätselhaft", "person.stranger": "Fremder",
      "person.rival": "Rivale", "person.witness": "Zeuge",
      "person.guide": "Wegweiser", "person.outcast": "Ausgestoßener",
      "item.key": "Schlüssel", "item.letter": "Brief",
      "item.relic": "Relikt", "item.map": "Karte", "item.tool": "Werkzeug",
      "location.threshold": "Schwelle", "location.ruin": "Ruine",
      "location.refuge": "Zuflucht", "location.crossroads": "Kreuzung",
      "location.depths": "Tiefe", "danger.ambush": "Hinterhalt",
      "danger.collapse": "Einsturz", "danger.deception": "Täuschung",
      "danger.pursuit": "Verfolgung", "danger.exposure": "Entlarvung",
      "discovery.trace": "Spur", "discovery.secret": "Geheimnis",
      "discovery.connection": "Verbindung", "discovery.opportunity": "Gelegenheit",
      "discovery.warning": "Warnung", "complication.delay": "Verzögerung",
      "complication.price": "Preis", "complication.mistake": "Irrtum",
      "complication.attention": "Aufmerksamkeit", "complication.shortage": "Mangel",
    },
    randomEventTitle: "Unerwartetes Ereignis",
    randomEventDescription:
      "Erzeuge einen Schwerpunkt sowie zwei Deutungsbegriffe für eine überraschende Wendung.",
    randomEventContextLabel: "Ereigniskontext (optional)",
    randomEventContextHint: "Zum Beispiel: Was unterbricht die Suche?",
    generateEventAction: "Ereignis erzeugen",
    generatingEventAction: "Ereignis wird erzeugt …",
    randomEventResultTitle: "Unerwartetes Ereignis",
    randomEventInterpretationHint:
      "Deute das Ergebnis passend zur Szene. Es verändert die Kampagne nicht automatisch.",
    randomEventTriggerLabel: "Auslöser",
    randomEventTriggers: { manual: "Manuell", double: "Pasch und Spannung" },
    eventFocuses: {
      distant_threat: "Entfernte Bedrohung",
      new_person: "Neue Person",
      existing_person: "Bestehende Person",
      faction_acts: "Fraktion handelt",
      thread_progresses: "Handlungsstrang schreitet fort",
      thread_escalates: "Handlungsstrang verschärft sich",
      positive_opportunity: "Positive Gelegenheit",
      resource_loss: "Verlust einer Ressource",
      unusual_discovery: "Ungewöhnliche Entdeckung",
    },
    eventActions: {
      "event_action.advance": "Vorantreiben", "event_action.hinder": "Behindern",
      "event_action.reveal": "Enthüllen", "event_action.protect": "Beschützen",
      "event_action.demand": "Fordern", "event_action.abandon": "Aufgeben",
      "event_action.transform": "Verwandeln", "event_action.pursue": "Verfolgen",
      "event_action.divide": "Trennen",
    },
    eventSubjects: {
      "event_subject.alliance": "Bündnis", "event_subject.secret": "Geheimnis",
      "event_subject.passage": "Durchgang", "event_subject.resource": "Ressource",
      "event_subject.promise": "Versprechen", "event_subject.authority": "Autorität",
      "event_subject.refuge": "Zuflucht", "event_subject.evidence": "Beweis",
      "event_subject.stranger": "Fremder",
    },
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
      scenes: "Szenen",
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
      SCENE_STARTED: "Szene begonnen",
      SCENE_NOTE_ADDED: "Szeneneintrag festgehalten",
      SCENE_MESSAGE_ADDED: "Szenennachricht festgehalten",
      DICE_ROLLED: "Probe ausgewertet",
      ORACLE_ANSWERED: "Orakelfrage beantwortet",
      ORACLE_INSPIRATION_DRAWN: "Orakelinspiration gezogen",
      ORACLE_RANDOM_EVENT_GENERATED: "Zufallsereignis erzeugt",
      TENSION_CHANGED: "Spannung angepasst",
      SCENE_COMPLETED: "Szene abgeschlossen",
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
    tensionLabel: "Tension",
    tensionDescription: "Determines which doubles trigger unexpected events.",
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
  scenes: {
    sectionTitle: "Scenes",
    sectionDescription:
      "Begin a concrete play situation and finish it with a persistent summary.",
    openScenes: "Open scenes",
    title: "Campaign scenes",
    description:
      "A campaign has at most one active scene; completed scenes remain as history.",
    activeTitle: "Active scene",
    completedTitle: "Completed scenes",
    emptyTitle: "No scenes yet",
    emptyDescription: "Begin this campaign's first concrete play situation.",
    newScene: "Begin new scene",
    createTitle: "Begin a scene",
    createDescription:
      "Define the expected and actual setup, location, participants, and relevant story threads.",
    titleLabel: "Scene title",
    locationLabel: "Location",
    noLocation: "No fixed location",
    expectedSetupLabel: "Expected setup",
    actualSetupLabel: "Actual scene opening",
    actualSetupHint: "Without an oracle, the actual opening can match the expected setup.",
    objectiveLabel: "Scene objective",
    optionalHint: "optional",
    charactersLabel: "Participating characters",
    charactersHint: "Select the player characters taking part in this scene.",
    entitiesLabel: "Participating world entities",
    entitiesHint: "Select important people, locations, factions, or items.",
    threadsLabel: "Relevant story threads",
    threadsHint: "This creates a reference and does not alter the story thread.",
    noCharacters: "This campaign has no characters yet.",
    noEntities: "The world registry has no entities yet.",
    noThreads: "There are no story threads yet.",
    startAction: "Begin scene",
    startingAction: "Beginning scene …",
    openAction: "Open scene",
    activeStatus: "Active",
    completedStatus: "Completed",
    expectedSetupTitle: "Expected situation",
    actualSetupTitle: "Current scene opening",
    objectiveTitle: "Objective",
    participantsTitle: "Participants",
    relatedThreadsTitle: "Relevant story threads",
    completeTitle: "Complete scene",
    completeDescription:
      "Summarize the important events. Individual world changes remain separate, traceable actions.",
    summaryLabel: "Scene summary",
    tensionAdjustmentLabel: "Tension after the scene",
    tensionAdjustmentHint:
      "Changes by at most one level and remains between 1 and 6.",
    tensionAdjustments: {
      decrease: "Calmer (−1)",
      steady: "Unchanged (±0)",
      increase: "More tense (+1)",
    },
    completeAction: "Complete scene",
    completingAction: "Completing scene …",
    summaryTitle: "Summary",
    backToCampaign: "Back to campaign",
    backToScenes: "Back to scenes",
    validationMessage: "Please check the highlighted fields.",
    saveError: "The scene could not be saved.",
    activeExistsError: "This campaign already has an active scene.",
    journalTitle: "Play log",
    journalDescription:
      "Actions, observations, and checks remain in their chronological order.",
    journalEmpty: "This scene has no log entries yet.",
    messageTitle: "Scene dialogue",
    messageDescription:
      "Record player actions and manual narration as an ongoing dialogue.",
    messageRoleLabel: "Contribution by",
    messageRoles: { player: "Player", narrator: "Narrator" },
    messageContentLabel: "Message",
    sendMessageAction: "Save message",
    sendingMessageAction: "Saving message …",
    noteTitle: "Record an entry",
    noteKindLabel: "Entry type",
    noteKinds: { action: "Action", observation: "Observation" },
    noteContentLabel: "Entry",
    saveNoteAction: "Save entry",
    savingNoteAction: "Saving entry …",
    rollTitle: "Resolve a check",
    rollDescription:
      "The rules engine builds the dice pool from archetype, trait, advantages, and disadvantages.",
    rollCharacterLabel: "Acting character",
    rollCharacterPlaceholder: "Choose a character",
    rollActionLabel: "Intended action",
    difficultyLabel: "Difficulty",
    difficulties: { easy: "Easy", normal: "Normal", hard: "Hard" },
    matchingTraitLabel: "Matching trait (optional)",
    archetypeMatchesLabel: "Archetype matches the action",
    archetypeMatchesHint: "Adds one die.",
    advantageLabel: "Advantage (optional)",
    disadvantageLabel: "Disadvantage (optional)",
    rollAction: "Roll",
    rollingAction: "Resolving check …",
    journalSaveError: "The log entry could not be saved.",
    traitMismatchError: "The trait does not belong to the selected character.",
    rollResultTitle: "Check",
    outcomes: {
      critical_failure: "Critical failure",
      failure: "Failure",
      success_with_cost: "Success with a cost",
      success: "Success",
      strong_success: "Strong success",
    },
    diceLabel: "Dice",
    successesLabel: "Successes",
    thresholdLabel: "Success on",
    rulesetLabel: "Ruleset",
  },
  oracle: {
    formTitle: "Yes-no oracle",
    formDescription:
      "Ask a clear question and estimate how likely a yes answer is.",
    questionLabel: "Oracle question",
    likelihoodLabel: "Likelihood of yes",
    likelihoods: {
      nearly_impossible: "Nearly impossible (−4)",
      unlikely: "Unlikely (−2)",
      even: "Even odds (±0)",
      likely: "Likely (+2)",
      nearly_certain: "Nearly certain (+4)",
    },
    askAction: "Ask oracle",
    askingAction: "Asking oracle …",
    validationMessage: "Please check the oracle question.",
    saveError: "The oracle result could not be saved.",
    resultTitle: "Oracle",
    answers: {
      no_and: "No, and furthermore …",
      no: "No",
      no_but: "No, but …",
      uncertain: "Uncertain or context-dependent",
      yes_but: "Yes, but …",
      yes: "Yes",
      yes_and: "Yes, and furthermore …",
    },
    diceLabel: "2d6",
    calculationLabel: "Evaluation",
    doubleBadge: "Double",
    tensionAtRollLabel: "Tension at roll",
    doubleTriggerRule: "A double triggers when its die value is at most the current tension.",
    eventTriggeredBadge: "Event triggered",
    inspirationTitle: "Open inspiration",
    inspirationDescription:
      "Draw two terms for an open idea or as an answer to an optional detail question.",
    detailQuestionLabel: "Detail question (optional)",
    detailQuestionHint: "For example: What is unusual about this place?",
    primaryCategoryLabel: "First term",
    secondaryCategoryLabel: "Second term",
    categories: {
      action: "Action",
      theme: "Theme",
      mood: "Mood",
      person: "Person",
      item: "Item",
      location: "Location",
      danger: "Danger",
      discovery: "Discovery",
      complication: "Complication",
    },
    drawAction: "Draw inspiration",
    drawingAction: "Drawing inspiration …",
    inspirationResultTitle: "Inspiration",
    terms: {
      "action.reveal": "Reveal", "action.protect": "Protect",
      "action.transform": "Transform", "action.pursue": "Pursue",
      "action.betray": "Betray", "theme.debt": "Debt",
      "theme.freedom": "Freedom", "theme.loss": "Loss",
      "theme.legacy": "Legacy", "theme.trust": "Trust",
      "mood.uneasy": "Uneasy", "mood.hopeful": "Hopeful",
      "mood.solemn": "Solemn", "mood.urgent": "Urgent",
      "mood.mysterious": "Mysterious", "person.stranger": "Stranger",
      "person.rival": "Rival", "person.witness": "Witness",
      "person.guide": "Guide", "person.outcast": "Outcast",
      "item.key": "Key", "item.letter": "Letter", "item.relic": "Relic",
      "item.map": "Map", "item.tool": "Tool",
      "location.threshold": "Threshold", "location.ruin": "Ruin",
      "location.refuge": "Refuge", "location.crossroads": "Crossroads",
      "location.depths": "Depths", "danger.ambush": "Ambush",
      "danger.collapse": "Collapse", "danger.deception": "Deception",
      "danger.pursuit": "Pursuit", "danger.exposure": "Exposure",
      "discovery.trace": "Trace", "discovery.secret": "Secret",
      "discovery.connection": "Connection", "discovery.opportunity": "Opportunity",
      "discovery.warning": "Warning", "complication.delay": "Delay",
      "complication.price": "Price", "complication.mistake": "Mistake",
      "complication.attention": "Attention", "complication.shortage": "Shortage",
    },
    randomEventTitle: "Unexpected event",
    randomEventDescription:
      "Generate a focus and two prompts for a surprising turn.",
    randomEventContextLabel: "Event context (optional)",
    randomEventContextHint: "For example: What interrupts the search?",
    generateEventAction: "Generate event",
    generatingEventAction: "Generating event …",
    randomEventResultTitle: "Unexpected event",
    randomEventInterpretationHint:
      "Interpret the result for the current scene. It does not change the campaign automatically.",
    randomEventTriggerLabel: "Trigger",
    randomEventTriggers: { manual: "Manual", double: "Double and tension" },
    eventFocuses: {
      distant_threat: "Distant threat",
      new_person: "New person",
      existing_person: "Existing person",
      faction_acts: "Faction acts",
      thread_progresses: "Story thread progresses",
      thread_escalates: "Story thread escalates",
      positive_opportunity: "Positive opportunity",
      resource_loss: "Loss of a resource",
      unusual_discovery: "Unusual discovery",
    },
    eventActions: {
      "event_action.advance": "Advance", "event_action.hinder": "Hinder",
      "event_action.reveal": "Reveal", "event_action.protect": "Protect",
      "event_action.demand": "Demand", "event_action.abandon": "Abandon",
      "event_action.transform": "Transform", "event_action.pursue": "Pursue",
      "event_action.divide": "Divide",
    },
    eventSubjects: {
      "event_subject.alliance": "Alliance", "event_subject.secret": "Secret",
      "event_subject.passage": "Passage", "event_subject.resource": "Resource",
      "event_subject.promise": "Promise", "event_subject.authority": "Authority",
      "event_subject.refuge": "Refuge", "event_subject.evidence": "Evidence",
      "event_subject.stranger": "Stranger",
    },
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
      scenes: "Scenes",
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
      SCENE_STARTED: "Scene started",
      SCENE_NOTE_ADDED: "Scene entry recorded",
      SCENE_MESSAGE_ADDED: "Scene message recorded",
      DICE_ROLLED: "Check resolved",
      ORACLE_ANSWERED: "Oracle question answered",
      ORACLE_INSPIRATION_DRAWN: "Oracle inspiration drawn",
      ORACLE_RANDOM_EVENT_GENERATED: "Random event generated",
      TENSION_CHANGED: "Tension adjusted",
      SCENE_COMPLETED: "Scene completed",
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
