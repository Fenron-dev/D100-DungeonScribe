export interface HttpResponse {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}

export type HttpClient = (url: string, init: RequestInit) => Promise<HttpResponse>;
