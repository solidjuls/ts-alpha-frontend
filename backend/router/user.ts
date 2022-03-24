import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "backend/utils/prisma";
import crypto from "crypto";
import { UserType } from "types/user.types";
import jwt from "next-auth/jwt"

const nodemailer = require("nodemailer");

const generateHash = (mail: string) => {
  let data = `${mail}#${new Date().toString()}`;
  let buff = Buffer.from(data);
  return buff.toString("base64");
};

const getUrl = () =>
  process.env.NEXT_PUBLIC_URL
    ? process.env.NEXT_PUBLIC_URL
    : "http://localhost:3000";

async function sendEmail(
  mail: string,
  firstName: string | null,
  hashedUrl: string
) {
  const message = {
    from: "juli.arnalot@gmail.com",
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
      host: "smtp-relay.sendinblue.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "juli.arnalot@gmail.com",
        pass: "rLaHcORsXkSpnBtF",
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

export const userRouter = trpc
  .router()
  .query("get", {
    input: z.object({ mail: z.string(), pwd: z.string() }),
    async resolve({ input }) {
      const user = await prisma.users.findFirst({
        where: {
          email: input.mail,
        },
      });
      const userParsed = JSON.stringify(user, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      );
      return JSON.parse(userParsed);
    },
  })
  .query("get-all", {
    async resolve() {
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
    },
  })
  .mutation("update", {
    input: z.object({
      mail: z.string(),
      password: z.string(),
    }),
    async resolve({ input, ...rest }) {
      console.log("ddd", rest)
      // const token = await jwt.getToken({ req, secret })
      // console.log("JSON Web Token", token)

      const updateUser = await prisma.users.update({
        where: {
          email: input.mail,
        },
        data: {
          password: input.password,
        },
      });
      return { success: true };
    },
  })
  .mutation("update-all", {
    input: z.object({
      password: z.string(),
    }),
    async resolve({ input }) {
      const updateUser = await prisma.users.updateMany({
        data: {
          password: input.password,
        },
      });
      return { success: true };
    },
  })
  .mutation("reset-pwd", {
    input: z.object({
      mail: z.string(),
    }),
    async resolve({ input }) {
      const user = await prisma.users.findFirst({
        select: {
          id: true,
          first_name: true,
        },
        where: {
          email: input.mail,
        },
      });

      if (user) {
        const hash = generateHash(input.mail);
        console.log("hash", hash);
        // const decrypted = decryptHash(hash);
        // console.log("hash", decrypted);
        const aver = await sendEmail(
          input.mail,
          user.first_name,
          `${getUrl()}/reset-password/${hash}`
        );
        //console.log("checking", aver, hash);
      }
      return { success: true };
    },
  });

export type UserRouter = typeof userRouter;
