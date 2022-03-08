import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "backend/utils/prisma";
import { isJSDocPublicTag } from "typescript";
const nodemailer = require('nodemailer');
//<p>To activate your account please follow this link: <a target="_" href="${process.env.DOMAIN}/api/activate/user/${hash}">${process.env.DOMAIN}/activate </a></p>
async function sendEmail(mail: string) {
  const message = {
    from: 'itsjunta2022@gmail.com',
    // to: toUser.email // in production uncomment this
    to: 'itsjunta2022@gmail.com',
    subject: 'Your App - Activate Account',
    html: `
      <h3> Hello tester </h3>
      <p>Thank you for registering into our Application. Much Appreciated! Just one last step is laying ahead of you...</p>
      
      <p>Cheers</p>
      <p>Your Application Team</p>
    `
  }

  return await new Promise((res, rej) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'itsjunta2022@gmail.com',
        pass: 'AskNot666'
      }
    })

    transporter.sendMail(message, function(err:any, info: any) {
      if (err) {
        rej(err)
      } else {
        res(info)
      }
    })
  })
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
      const user = await prisma.users.findMany({
        select: {
          id: true,
          first_name: true,
          last_name: true,
        },
      });
      const userParsed = JSON.stringify(user, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      );
      return JSON.parse(userParsed).map((user: any) => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
      }));
    },
  })
  .mutation("update", {
    input: z.object({
      mail: z.string(),
      password: z.string(),
    }),
    async resolve({ input }) {
      const updateUser = await prisma.users.update({
        where: {
          email: input.mail,
        },
        data: {
          password: input.password,
        },
      });
      console.log("really", updateUser);
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
      console.log("really", updateUser);
      return { success: true };
    },
  })
  .mutation("reset-pwd", {
    input: z.object({
      mail: z.string(),
    }),
    async resolve({ input }) {
      // get mail
      // create a hash with expiring date with  user id as payload
      // send an email with a link
      console.log("checking", input)
      await sendEmail(input.mail)
    }
  })

export type UserRouter = typeof userRouter;
