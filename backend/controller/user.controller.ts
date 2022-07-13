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

  // user not found
  console.log("user", user);
  console.log("pwd", pwd);
  if (!user) return null;
//
  // const checkPassword = await compare(pwd, user.password as string);
  // console.log("checkPassword", checkPassword);
  // if (!checkPassword) return null;

  return {
    email: 'juli.arnalot@gmail.com',//user.email,
    name: 'Juli',// user.first_name,
    role: "admin"
  };
};
