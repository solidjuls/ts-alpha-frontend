import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "backend/utils/prisma";
import crypto from "crypto";

const nodemailer = require("nodemailer");

const algorithm = "aes-256-ctr";
const secretKey = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
const iv = Buffer.from("aldrich");

const generateHash = (mail: string) => {
  try {
    var cipher = crypto.createCipher("aes-256-cbc", "d6F3Efeq");
    var crypted = cipher.update(mail, "utf8", "hex");
    crypted += cipher.final("hex");
    return crypted;
  } catch (e) {
    console.log("error", e);
  }
};
const decryptHash = (hash: any) => {
  try {
    var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
  var dec = decipher.update(hash,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
  } catch (e) {
    console.log("error", e);
  }
};

async function sendEmail(mail: string, hashedUrl: string) {
  const message = {
    from: "juli.arnalot@gmail.com",
    // to: toUser.email // in production uncomment this
    to: mail,
    subject: "Twilight Struggle - Reset Password",
    html: `
      <h3> Hello username </h3>
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
      // validate email
      // create a hash with expiring date as payload
      // send an email with a link
      const user = await prisma.users.findFirst({
        select: {
          id: true,
        },
        where: {
          email: input.mail,
        },
      });

      console.log("user", user);
      if (user) {
        const hash = generateHash(input.mail);
        console.log("hash", hash);
        const decrypted = decryptHash(hash);
        console.log("hash", decrypted);
        // const aver = await sendEmail(
        //   input.mail,
        //   `http://localhost:3000/${hash}`
        // );
        //console.log("checking", aver, hash);
      }
      return { success: true };
    },
  });

export type UserRouter = typeof userRouter;
