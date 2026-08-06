const BASE_URL = "http://localhost:3000";

export interface WinnerPayload {
  id: number;
  wins: number;
  time: number;
}

export interface WinnerData {
  id: number;
  wins: number;
  time: number;
  car?: {
    name: string;
    color: string;
  };
}

export interface GetWinnersResponse {
  items: WinnerData[];
  totalCount: number;
}

export const getWinner = async (id: number): Promise<WinnerPayload> => {
  const response = await fetch(`${BASE_URL}/winners/${id}`);
  if (!response.ok) {
    throw new Error("Winner not found");
  }
  return response.json();
};

export const createWinner = async (
  winner: WinnerPayload,
): Promise<WinnerPayload> => {
  const response = await fetch(`${BASE_URL}/winners`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(winner),
  });
  return response.json();
};

export const updateWinner = async (
  id: number,
  winner: Omit<WinnerPayload, "id">,
): Promise<WinnerPayload> => {
  const response = await fetch(`${BASE_URL}/winners/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(winner),
  });
  return response.json();
};

export const deleteWinner = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/winners/${id}`, {
      method: "DELETE",
    });
    if (!response.ok && response.status !== 404) {
      throw new Error("Failed to delete winner");
    }
  } catch (error) {
    console.warn(`Winner ${id} not found or could not be deleted`);
  }
};

export const getWinners = async (
  page: number = 1,
  limit: number = 10,
  sort?: "id" | "wins" | "time",
  order?: "ASC" | "DESC",
): Promise<GetWinnersResponse> => {
  const params = new URLSearchParams({
    _page: String(page),
    _limit: String(limit),
  });

  if (sort && order) {
    params.append("_sort", sort);
    params.append("_order", order);
  }

  const response = await fetch(`${BASE_URL}/winners?${params.toString()}`);
  const totalCount = Number(response.headers.get("X-Total-Count") || 0);
  const winnersList: WinnerPayload[] = await response.json();

  const items = await Promise.all(
    winnersList.map(async (winner) => {
      try {
        const carRes = await fetch(`${BASE_URL}/garage/${winner.id}`);
        const carData = await carRes.json();
        return {
          ...winner,
          car: {
            name: carData.name,
            color: carData.color,
          },
        };
      } catch {
        return {
          ...winner,
          car: { name: "Unknown Car", color: "#888888" },
        };
      }
    }),
  );

  return { items, totalCount };
};
