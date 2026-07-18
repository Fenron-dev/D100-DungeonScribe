export interface OracleFormState {
  message: "validation" | "save_error" | null;
  errors: string[];
}

export const initialOracleFormState: OracleFormState = {
  message: null,
  errors: [],
};

export type OracleFormAction = (
  state: OracleFormState,
  formData: FormData,
) => Promise<OracleFormState>;
