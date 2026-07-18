export interface NarrativeFormState {
  message:
    | "validation"
    | "save_error"
    | "rate_limit"
    | "credits"
    | "model_unavailable"
    | "model_incompatible"
    | "provider_error"
    | null;
  errors: string[];
}

export const initialNarrativeFormState: NarrativeFormState = {
  message: null,
  errors: [],
};

export type NarrativeFormAction = (
  state: NarrativeFormState,
  formData: FormData,
) => Promise<NarrativeFormState>;
