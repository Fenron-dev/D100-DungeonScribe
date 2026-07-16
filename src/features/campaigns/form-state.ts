export interface CampaignFormErrors {
  name: string[];
  premise: string[];
  genre: string[];
  mood: string[];
}

export interface CampaignFormState {
  message: string | null;
  errors: CampaignFormErrors;
}

export const initialCampaignFormState: CampaignFormState = {
  message: null,
  errors: {
    name: [],
    premise: [],
    genre: [],
    mood: [],
  },
};

export type CampaignFormAction = (
  state: CampaignFormState,
  formData: FormData,
) => Promise<CampaignFormState>;
