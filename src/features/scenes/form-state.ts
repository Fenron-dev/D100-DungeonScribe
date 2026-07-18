export interface SceneFormErrors {
  title: string[];
  locationId: string[];
  expectedSetup: string[];
  actualSetup: string[];
  objective: string[];
  participantCharacterIds: string[];
  participantEntityIds: string[];
  relevantThreadIds: string[];
}

export interface SceneFormState {
  message: "validation" | "save_error" | "active_exists" | null;
  errors: SceneFormErrors;
}

export const initialSceneFormState: SceneFormState = {
  message: null,
  errors: {
    title: [],
    locationId: [],
    expectedSetup: [],
    actualSetup: [],
    objective: [],
    participantCharacterIds: [],
    participantEntityIds: [],
    relevantThreadIds: [],
  },
};

export type SceneFormAction = (
  state: SceneFormState,
  formData: FormData,
) => Promise<SceneFormState>;

export interface SceneCompletionState {
  message: "validation" | "save_error" | null;
  errors: string[];
}

export const initialSceneCompletionState: SceneCompletionState = {
  message: null,
  errors: [],
};

export type SceneCompletionAction = (
  state: SceneCompletionState,
  formData: FormData,
) => Promise<SceneCompletionState>;

export interface SceneJournalFormState {
  message: "validation" | "save_error" | "trait_mismatch" | null;
  errors: string[];
}

export const initialSceneJournalFormState: SceneJournalFormState = {
  message: null,
  errors: [],
};

export type SceneJournalFormAction = (
  state: SceneJournalFormState,
  formData: FormData,
) => Promise<SceneJournalFormState>;
