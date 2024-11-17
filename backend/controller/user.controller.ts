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

  await prisma.users.update({
    where: {
      email,
    },
    data: {
      last_login_at: new Date(),
    },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.first_name,
    // @ts-ignore
    role: user.role_id,
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
  return { success: true };
};

export const create = async (input) => {
  const existingUser = await prisma.users.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    return { error: `User with email ${input.email} already exists` };
  }
  await prisma.users.create({
    data: {
      first_name: input.first_name,
      last_name: input.last_name,
      name: input.name,
      email: input.email,
      // phone_number: input.phone,
      preferred_gaming_platform: input.preferredGamingPlatform,
      preferred_game_duration: input.preferredGameDuration,
      city_id: input.city,
      country_id: input.country,
    },
  });
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
    to: mail,
    subject: "Twilight Struggle - Reset Password",
    html: mailBody({ firstName, hashedUrl }),
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

  const mailOutput = await sendEmail(mail, user.first_name, `${getUrl()}/reset-password/${hash}`);
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

const mailBody = ({ firstName, hashedUrl }) => {
  const body = `<table style="box-sizing:border-box;border-collapse:separate!important;width:100%;background-color:#fff;border-spacing:0;vertical-align:top;text-align:left;height:100%;color:#222222;font-family:&quot;Helvetica&quot;,&quot;Arial&quot;,sans-serif;font-weight:normal;line-height:19px;font-size:14px;margin:0;padding:10px" width="100%" bgcolor="#fff">
                        <tbody>
                            <tr style="vertical-align:top;text-align:left;padding:0" align="left">
                                <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;vertical-align:top;word-break:break-word;border-collapse:collapse!important;text-align:left;color:#222222;font-weight:normal;line-height:19px;margin:0;padding:0" valign="top" align="left"></td>
                                <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;vertical-align:top;display:block;max-width:580px;width:580px;word-break:break-word;border-collapse:collapse!important;text-align:left;color:#222222;font-weight:normal;line-height:19px;margin:0 auto;padding:24px" width="580" valign="top" align="left">
                                    <div style="box-sizing:border-box;display:block;max-width:580px;margin:0 auto">
                                        <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.5;color:#222222;text-align:left;margin:0 0 15px;padding:0" align="left">
                                            Hi, <strong style="color:#24292e!important">${firstName}</strong>,
                                        </p>

                                        <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.5;color:#222222;text-align:left;margin:0 0 15px;padding:0" align="left">
                                            You are receiving this because you (or someone else) requested the reset of your <a href="http://twilight-struggle.com" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://twilight-struggle.com&amp;source=gmail&amp;ust=1725443360407000&amp;usg=AOvVaw2AAo74hiOc71SWQPgzNyjA">twilight-struggle.com</a> account. Click the button below to reset your <span class="il">password</span>.
                                        </p>

                                        <button style="box-sizing:border-box;display:flex;padding:8px 16px;background:linear-gradient(180deg,rgba(255,255,255,0.13) 0%,rgba(17,184,15,0.1) 100%),#ffffff;border:1px solid rgba(75,173,58,0.5);border-radius:4px" align="left" type="button">
                                            <a href="${hashedUrl}" style="text-decoration:none;color:#262626" rel=" noopener noreferrer" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://twilight-struggle.com/account/password/set?token%3Dn9Dpc6tKy2qAjqEd9VEmdmnyittwCZyJcbtl5H5LaGfXLJubkOKhqw5z7aKnFRLcFcc7UGti0DWAzsz1CGSdsQ&amp;source=gmail&amp;ust=1725443360407000&amp;usg=AOvVaw09gQmBXlbA7AyqMyP3d1nG">Reset <span class="il">Password</span></a>
                                        </button>

                                        <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.5;color:#222222;text-align:left" align="left">
                                            If you did not request a <span class="il">password</span> reset, you can safely ignore this.<br>
                                            If you have questions, please reach out to us by replying to this email.<br>
                                        </p>
                                        <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.5;color:#222222;text-align:left" align="left">
                                            Thanks,<br>
                                            ITS Junta
                                        </p>

                                        <div style="box-sizing:border-box;clear:both;width:100%">
                                            <hr style="height:0;overflow:visible;border-top-color:#e1e4e8;color:#4d4d4d;font-size:12px;line-height:18px;background-color:#d9d9d9;margin:24px 0 30px;border-style:solid none none;border-width:1px 0 0">
                                            <div style="box-sizing:border-box;color:#4d4d4d;font-size:12px;line-height:18px">
                                                <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-weight:normal;color:#4d4d4d;font-size:12px;line-height:18px;text-align:left;margin:0 0 15px;padding:0" align="center">
                                                    Use this link if the button is not working<br>
                                                    <a href="${hashedUrl}" style="color:#4d4d4d" rel=" noopener noreferrer" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://twilight-struggle.com/account/password/set?token%3Dn9Dpc6tKy2qAjqEd9VEmdmnyittwCZyJcbtl5H5LaGfXLJubkOKhqw5z7aKnFRLcFcc7UGti0DWAzsz1CGSdsQ&amp;source=gmail&amp;ust=1725443360407000&amp;usg=AOvVaw09gQmBXlbA7AyqMyP3d1nG">https://twilight-struggle.com/<wbr>account/<span class="il">password</span>/set?token=<wbr>n9Dpc6tKy2qAjqEd9VEmdmnyittwCZ<wbr>yJcbtl5H5LaGfXLJubkOKhqw5z7aKn<wbr>FRLcFcc7UGti0DWAzsz1CGSdsQ</a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </td>
                                <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;vertical-align:top;word-break:break-word;border-collapse:collapse!important;text-align:left;color:#222222;font-weight:normal;line-height:19px;margin:0;padding:0" valign="top" align="left"></td>
                            </tr>
                        </tbody>
                    </table>`;

  return body;
};
