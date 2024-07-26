import * as trpc from "@trpc/server";
import { z } from "zod";
import type { Context } from "../context";
import { prisma } from "backend/utils/prisma";
import crypto from "crypto";
import { hash } from "bcryptjs";
import { AuthType, UserType } from "types/user.types";
import { authorize } from "backend/controller/user.controller";
/* @ts-ignore */
import Cookies from "cookies";
/* @ts-ignore */
import jwt from "jsonwebtoken";

const nodemailer = require("nodemailer");

const decryptHash = (hash: any) => {
  let buff = Buffer.from(hash, "base64");
  return buff.toString("ascii");
};

const generateHash = (mail: string) => {
  let data = `${mail}#${new Date().toString()}`;
  let buff = Buffer.from(data);
  return buff.toString("base64");
};

const getUrl = () =>
  process.env.NEXT_PUBLIC_URL ? process.env.NEXT_PUBLIC_URL : "http://localhost:3000";

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
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_POST,
      secure: false, // true for 465, false for other ports
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

export const userRouter = trpc
  .router<Context>()
  .mutation("signin", {
    input: z.object({ mail: z.string(), pwd: z.string() }),
    async resolve({ input, ctx }) {
      if (!ctx) return null;
      const user = await authorize({
        email: input.mail,
        pwd: input.pwd,
      });
      console.log("user resolve", user);
      if (!user) {
        throw new trpc.TRPCError({
          code: "UNAUTHORIZED",
          message: "User doesn't exist",
        });
      }
      const token = jwt.sign({ mail: user.email, role: user.role }, process.env.TOKEN_SECRET, {
        expiresIn: "60d",
      });

      new Cookies(ctx.req, ctx.res).set("auth-token", token, {
        path: "/",
        httpOnly: true,
      });

      return { email: user.email, name: user.name } as AuthType;
    },
  })
  .mutation("signout", {
    async resolve({ ctx }) {
      if (!ctx) return { success: false };
      const cookies = new Cookies(ctx.req, ctx.res);
      cookies.set("auth-token");

      return { success: true };
    },
  })
  .mutation("reset", {
    input: z.object({ token: z.string(), pwd: z.string() }),
    async resolve({ input, ctx }) {
      if (!ctx) return { success: false };
      const token = input.token;

      // const cookies = new Cookies(ctx.req, ctx.res);
      // cookies.set("auth-token");
      const decrypted = decryptHash(token);
      const values = decrypted.split("#");
      const mail = values[0];
      const updateUser = await prisma.users.update({
        where: {
          email: mail,
        },
        data: {
          password: input.pwd,
        },
      });
      console.log("update did happen");
      return { success: true };
    },
  })
  .merge(
    trpc
      .router<Context>()
      .middleware(async ({ ctx, next }) => {
        if (!ctx?.user) {
          throw new trpc.TRPCError({
            code: "UNAUTHORIZED",
            message: "Not logged in",
          });
        }
        console.log("middleware user successful");
        return next();
      })
      .query("get", {
        input: z.object({ id: z.string() }),
        async resolve({ input }) {
          const user = await prisma.users.findFirst({
            where: {
              id: Number(input.id),
            },
          });
          const userParsed = JSON.stringify(user, (key, value) =>
            typeof value === "bigint" ? value.toString() : value,
          );
          console.log("user", userParsed);
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
          console.log("ddd", input.password);
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
          console.log("update did happen");
          return { success: true };
        },
      }),
  )
  .merge(
    trpc
      .router<Context>()
      .middleware(async ({ ctx, next }) => {
        // console.log("ctx.user.role === ", ctx.user.user.role);
        if (ctx?.user?.user.role === "admin") {
          throw new trpc.TRPCError({
            code: "UNAUTHORIZED",
            message: "Not admin",
          });
        }
        console.log("middleware admin successful");
        return next();
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
      }),
  )
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

        // const decrypted = decryptHash(hash);
        // console.log("hash", decrypted);
        const aver = await sendEmail(
          input.mail,
          user.first_name,
          `${getUrl()}/reset-password/${hash}`,
        );
        //console.log("checking", aver, hash);
      }
      return { success: true };
    },
  });

export type UserRouter = typeof userRouter;
