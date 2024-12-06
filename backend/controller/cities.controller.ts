import { prisma } from "backend/utils/prisma";

export const get = async (input) => {
  console.log(input);
  const cities = await prisma.cities.findMany({
    select: {
      id: true,
      name: true,
      timeZoneId: true
    },
    where: {
      name: {
        startsWith: input,
      },
    },
  });
  const citiesWithTZ = cities.map(({id, name, timeZoneId}) => ({ id, name: `${name} - ${timeZoneId}`}) )
  const citiesParsed = JSON.stringify([...citiesWithTZ], (key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );

  return JSON.parse(citiesParsed);
};
