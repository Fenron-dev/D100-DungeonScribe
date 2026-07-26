export interface StylePresetFormState {
  message: "validation" | "save_error" | "saved" | null;
  errors: {
    name: string[];
    description: string[];
    baseTemplateId: string[];
    style: string[];
  };
}

export type StylePresetFormAction = (
  state: StylePresetFormState,
  formData: FormData,
) => Promise<StylePresetFormState>;

export const initialStylePresetFormState: StylePresetFormState = {
  message: null,
  errors: {
    name: [],
    description: [],
    baseTemplateId: [],
    style: [],
  },
};
