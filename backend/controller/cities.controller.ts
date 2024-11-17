import { prisma } from "backend/utils/prisma";

export const get = async (input) => {
  console.log(input);
  const cities = await prisma.cities.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      name: {
        startsWith: input,
      },
    },
  });
  const citiesParsed = JSON.stringify([...cities], (key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );

  return JSON.parse(citiesParsed);
};
