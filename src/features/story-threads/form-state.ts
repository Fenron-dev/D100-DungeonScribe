export interface StoryThreadFormErrors {
  title: string[];
  premise: string[];
  description: string[];
  status: string[];
  urgency: string[];
  progressCurrent: string[];
  progressTarget: string[];
  relatedEntityIds: string[];
  nextPossibleDevelopments: string[];
}

export interface StoryThreadFormState {
  message: "validation" | "save_error" | null;
  errors: StoryThreadFormErrors;
}

export const initialStoryThreadFormState: StoryThreadFormState = {
  message: null,
  errors: {
    title: [],
    premise: [],
    description: [],
    status: [],
    urgency: [],
    progressCurrent: [],
    progressTarget: [],
    relatedEntityIds: [],
    nextPossibleDevelopments: [],
  },
};

export type StoryThreadFormAction = (
  state: StoryThreadFormState,
  formData: FormData,
) => Promise<StoryThreadFormState>;
