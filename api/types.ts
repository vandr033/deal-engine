export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

export type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";

export type Location = {
  latitude: number;
  longitude: number;
};

export interface OriginsDestinations {
  origins: string[];
  destinations: string[];
}
