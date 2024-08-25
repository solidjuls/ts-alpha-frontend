import { compare } from "bcryptjs";
import { prisma } from "backend/utils/prisma";
import { UserType } from "types/user.types";
import { getRatingByPlayer } from "./rating.controller";

export const authorize = async ({ email, pwd }: { email: string; pwd: string }) => {
  const user = await prisma.users.findFirst({
    where: {
      email,
    },
  });

  // if (!user) return null;

  // if (!user.password) {
  //   return false;
  // }

  const checkPassword = true; // await compare(pwd, user.password as string);

  if (!checkPassword) {
    return false;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.first_name,
    // @ts-ignore
    role: user.role,
  };
};

export const getAll = async () => {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      countries: {
        select: {
          tld_code: true,
        },
      },
    },
  });

  return users.map((user) => ({
    id: user.id.toString(),
    name: `${user.first_name} ${user.last_name}`,
    countryCode: user.countries?.tld_code,
  })) as UserType[];
}

export const get = async (id) => {
  const user = await prisma.users.findFirst({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      name: true,
      email: true,
      preferred_gaming_platform: true,
      preferred_game_duration: true,
      timezone_id: true,
      cities: {
        select: {
          name: true,
        },
      },
      countries: {
        select: {
          country_name: true,
        },
      },
    },
    where: {
      id: Number(id),
    },
  });
  const { rating } = await getRatingByPlayer({ playerId: user?.id });
  const userParsed = JSON.stringify({ ...user, rating }, (key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );
  console.log("user", userParsed);
  return JSON.parse(userParsed);
}