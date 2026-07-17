export interface RelationFormErrors {
  targetEntityId: string[];
  type: string[];
  description: string[];
  status: string[];
}

export interface RelationFormState {
  message: "validation" | "save_error" | null;
  errors: RelationFormErrors;
}

export const initialRelationFormState: RelationFormState = {
  message: null,
  errors: { targetEntityId: [], type: [], description: [], status: [] },
};

export type RelationFormAction = (
  state: RelationFormState,
  formData: FormData,
) => Promise<RelationFormState>;
