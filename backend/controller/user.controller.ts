import { compare } from "bcryptjs";
import { prisma } from "backend/utils/prisma";

export const authorize = async ({
  email,
  pwd,
}: {
  email: string;
  pwd: string;
}) => {
  const user = await prisma.users.findFirst({
    where: {
      email,
    },
  });

  if (!user) return null;

  const checkPassword = await compare(pwd, user.password as string);
  if (!checkPassword) return null;

  return {
    email: user.email,
    name: user.first_name,
    role: user.role
  };
};
