import { prisma } from "backend/utils/prisma";

export const get = async () => {
  const countries = await prisma.countries.findMany({
    select: {
      id: true,
      country_name: true,
      tld_code: true,
    },
  });
  const countriesParsed = JSON.stringify([...countries], (key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );

  return JSON.parse(countriesParsed);
};
