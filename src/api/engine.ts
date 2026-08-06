const BASE_URL = "http://localhost:3000";

export const startEngine = async (id: number) => {
  const response = await fetch(`${BASE_URL}/engine?id=${id}&status=started`, {
    method: "PATCH",
  });
  return response.json();
};

export const driveCar = async (id: number) => {
  const response = await fetch(`${BASE_URL}/engine?id=${id}&status=drive`, {
    method: "PATCH",
  });
  return response.status === 200;
};
