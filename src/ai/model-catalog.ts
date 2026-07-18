export interface AiModelOption {
  id: string;
  name: string;
  free: boolean;
}

export interface AiModelCatalog {
  list(apiKey: string | null): Promise<AiModelOption[]>;
}
