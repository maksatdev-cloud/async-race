export interface Car {
  name: string;
  color: string;
  id: number;
}

export interface CarsResponse {
  items: Car[];
  totalCount: number;
}

export type EngineStatus = "started" | "stopped" | "drive";

export interface EngineStartResponse {
  velocity: number;
  distance: number;
}

export interface DriveResponse {
  success: boolean;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface WinnersResponse {
  items: Winner[];
  totalCount: number;
}

export type SortBy = "id" | "wins" | "time";
export type SortOrder = "ASC" | "DESC";
