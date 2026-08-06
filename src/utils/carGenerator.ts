const BRANDS = [
  "Tesla",
  "BMW",
  "Audi",
  "Ford",
  "Chevrolet",
  "Toyota",
  "Honda",
  "Porsche",
  "Mercedes",
  "Nissan",
];

const MODELS = [
  "Model S",
  "X5",
  "A8",
  "Mustang",
  "Camaro",
  "Camry",
  "Civic",
  "911",
  "C-Class",
  "Skyline",
];

export const getRandomName = (): string => {
  const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
  const model = MODELS[Math.floor(Math.random() * MODELS.length)];
  return `${brand} ${model}`;
};

export const getRandomColor = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
