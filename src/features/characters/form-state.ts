export interface CharacterFormErrors {
  name: string[];
  concept: string[];
  archetype: string[];
  traits: string[];
  flaw: string[];
  notes: string[];
}

export interface CharacterFormState {
  message: "validation" | "save_error" | null;
  errors: CharacterFormErrors;
}

export const initialCharacterFormState: CharacterFormState = {
  message: null,
  errors: {
    name: [],
    concept: [],
    archetype: [],
    traits: [],
    flaw: [],
    notes: [],
  },
};

export type CharacterFormAction = (
  state: CharacterFormState,
  formData: FormData,
) => Promise<CharacterFormState>;
