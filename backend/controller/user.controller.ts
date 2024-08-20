import { compare } from "bcryptjs";
import { prisma } from "backend/utils/prisma";

export const authorize = async ({ email, pwd }: { email: string; pwd: string }) => {
  const user = await prisma.users.findFirst({
    where: {
      email,
    },
  });

  if (!user) return null;
  if (!user.password) {
    return false;
  }
  const checkPassword = await compare(pwd, user.password as string);

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
