export interface KnowledgeEntryFormErrors {
  title: string[];
  content: string[];
  type: string[];
  truthStatus: string[];
  knownByCharacterIds: string[];
  relatedEntityIds: string[];
  locked: string[];
}

export interface KnowledgeEntryFormState {
  message: "validation" | "save_error" | null;
  errors: KnowledgeEntryFormErrors;
}

export const initialKnowledgeEntryFormState: KnowledgeEntryFormState = {
  message: null,
  errors: {
    title: [],
    content: [],
    type: [],
    truthStatus: [],
    knownByCharacterIds: [],
    relatedEntityIds: [],
    locked: [],
  },
};

export type KnowledgeEntryFormAction = (
  state: KnowledgeEntryFormState,
  formData: FormData,
) => Promise<KnowledgeEntryFormState>;
