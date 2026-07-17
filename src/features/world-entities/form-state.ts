export interface WorldEntityFormErrors {
  type: string[];
  name: string[];
  summary: string[];
  description: string[];
  tags: string[];
  status: string[];
  details: string[];
}

export interface WorldEntityFormState {
  message: "validation" | "save_error" | null;
  errors: WorldEntityFormErrors;
}

export const initialWorldEntityFormState: WorldEntityFormState = {
  message: null,
  errors: {
    type: [],
    name: [],
    summary: [],
    description: [],
    tags: [],
    status: [],
    details: [],
  },
};

export type WorldEntityFormAction = (
  state: WorldEntityFormState,
  formData: FormData,
) => Promise<WorldEntityFormState>;
