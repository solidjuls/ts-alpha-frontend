import { compare } from "bcryptjs";
import { prisma } from "backend/utils/prisma";
import { UserType } from "types/user.types";
import { getRatingByPlayer } from "./rating.controller";
const nodemailer = require("nodemailer");

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

  const updateUser = await prisma.users.update({
    where: {
      email,
    },
    data: {
      last_login_at: new Date(),
    },
  });
  console.log("updateUser on login", updateUser);
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
};

export const get = async (id) => {
  const user = await prisma.users.findFirst({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      name: true,
      email: true,
      last_login_at: true,
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
  return JSON.parse(userParsed);
};

export const update = async (input) => {
  const updateUser = await prisma.users.update({
    where: {
      email: input.email,
    },
    data: {
      first_name: input.firstName,
      last_name: input.lastName,
      name: input.name,
      email: input.email,
      last_login_at: new Date(),
      preferred_gaming_platform: input.preferredGamingPlatform,
      preferred_game_duration: input.preferredGameDuration,
      timezone_id: input.timeZoneId,
    },
  });
  console.log("update did happen", updateUser);
  return { success: true };
};

const decryptHash = (hash: any) => {
  let buff = Buffer.from(hash, "base64");
  return buff.toString("ascii");
};

const generateHash = (mail: string) => {
  let buff = Buffer.from(mail);
  return buff.toString("base64");
};

const getUrl = () =>
  !!process.env.NEXT_PUBLIC_URL ? process.env.NEXT_PUBLIC_URL : "http://localhost:3000";

async function sendEmail(mail: string, firstName: string | null, hashedUrl: string) {
  const message = {
    from: process.env.SMTP_FROM,
    // to: toUser.email // in production uncomment this
    to: mail,
    subject: "Twilight Struggle - Reset Password",
    html: `
      <h3> Hello ${firstName} </h3>
      <p>Click this link ${hashedUrl} within the next hour to reset your password. </p>
      
      <p>Regards</p>
      <p>ITS Junta</p>
    `,
  };

  return await new Promise((res, rej) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PWD,
      },
    });

    transporter.sendMail(message, function (err: any, info: any) {
      if (err) {
        rej(err);
      } else {
        res(info);
      }
    });
  });
}
export const resetPasswordMail = async ({ mail }) => {
  const user = await prisma.users.findFirst({
    select: {
      id: true,
      first_name: true,
      email: true,
    },
    where: {
      email: mail,
    },
  });

  if (!user) return { success: false };
  const hash = generateHash(mail);

  const mailOutput = await sendEmail(mail, user.first_name, `https://${getUrl()}/reset-password/${hash}`);
  console.log("sendEmail output", mailOutput);

  return { success: true };
};

export const resetPassword = async ({ token, pwd }) => {
  // const cookies = new Cookies(ctx.req, ctx.res);
  // cookies.set("token");
  const decrypted = decryptHash(token);
  const values = decrypted.split("#");
  const mail = values[0];
  const updateUser = await prisma.users.update({
    where: {
      email: mail,
    },
    data: {
      password: pwd,
    },
  });
  console.log("update did happen", updateUser);
  return { success: true };
};
