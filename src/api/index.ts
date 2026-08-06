import type {
  Car,
  CarsResponse,
  EngineStartResponse,
  DriveResponse,
  Winner,
  WinnersResponse,
  SortBy,
  SortOrder,
} from "../types";

const BASE_URL = "http://127.0.0.1:3000";

// ===== GARAGE API =====
export const getCars = async (
  page: number,
  limit = 7,
): Promise<CarsResponse> => {
  const response = await fetch(
    `${BASE_URL}/garage?_page=${page}&_limit=${limit}`,
  );
  const totalCount = Number(response.headers.get("X-Total-Count") || 0);
  const items: Car[] = await response.json();
  return { items, totalCount };
};

export const getCar = async (id: number): Promise<Car> => {
  const response = await fetch(`${BASE_URL}/garage/${id}`);
  return response.json();
};

export const createCar = async (car: Omit<Car, "id">): Promise<Car> => {
  const response = await fetch(`${BASE_URL}/garage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(car),
  });
  return response.json();
};

export const updateCar = async (
  id: number,
  car: Omit<Car, "id">,
): Promise<Car> => {
  const response = await fetch(`${BASE_URL}/garage/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(car),
  });
  return response.json();
};

export const deleteCar = async (id: number): Promise<void> => {
  await fetch(`${BASE_URL}/garage/${id}`, { method: "DELETE" });
};

// ===== ENGINE API =====
export const startEngine = async (id: number): Promise<EngineStartResponse> => {
  const response = await fetch(`${BASE_URL}/engine?id=${id}&status=started`, {
    method: "PATCH",
  });
  return response.json();
};

export const stopEngine = async (id: number): Promise<EngineStartResponse> => {
  const response = await fetch(`${BASE_URL}/engine?id=${id}&status=stopped`, {
    method: "PATCH",
  });
  return response.json();
};

export const driveMode = async (id: number): Promise<DriveResponse> => {
  const response = await fetch(`${BASE_URL}/engine?id=${id}&status=drive`, {
    method: "PATCH",
  });
  if (response.status === 500) {
    throw new Error("Engine broke down");
  }
  return response.json();
};

// ===== WINNERS API =====
export const getWinners = async (
  page: number,
  limit = 10,
  sort?: SortBy,
  order?: SortOrder,
): Promise<WinnersResponse> => {
  let url = `${BASE_URL}/winners?_page=${page}&_limit=${limit}`;
  if (sort && order) {
    url += `&_sort=${sort}&_order=${order}`;
  }
  const response = await fetch(url);
  const totalCount = Number(response.headers.get("X-Total-Count") || 0);
  const items: Winner[] = await response.json();
  return { items, totalCount };
};

export const deleteWinner = async (id: number): Promise<void> => {
  await fetch(`${BASE_URL}/winners/${id}`, { method: "DELETE" });
};

export const getAllCars = async (): Promise<Car[]> => {
  const response = await fetch(`${BASE_URL}/garage`);
  return await response.json();
};
