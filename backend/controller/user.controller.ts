import { compare } from "bcryptjs";
import { prisma } from "backend/utils/prisma";
import { UserType } from "types/user.types";
import { getRatingByPlayer } from "./rating.controller";
const nodemailer = require("nodemailer");

interface UpdateUserInput {
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  phone: string;
  preferredGamingPlatform?: string;
  preferredGameDuration?: string;
  city?: number;
  country?: number;
}

interface CreateUserInput {
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  preferredGamingPlatform?: string;
  preferredGameDuration?: string;
  city?: number;
  country?: number;
}

interface ResetPasswordMailInput {
  mail: string;
}

interface ResetPasswordInput {
  token: string;
  pwd: string;
}

interface MailBodyInput {
  firstName: string | null;
  hashedUrl: string;
}

interface UserWithGameResults {
  id: bigint;
  first_name: string | null;
  last_name: string | null;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  last_login_at: Date | null;
  preferred_gaming_platform: string | null;
  preferred_game_duration: string | null;
  timezone_id: string | null;
  cities?: {
    id: bigint;
    name: string;
    timeZoneId: string | null;
  } | null;
  countries?: {
    id: bigint;
    country_name: string;
    tld_code: string;
  } | null;
  game_results_game_results_usa_player_idTousers?: Array<{ game_date: Date }>;
  game_results_game_results_ussr_player_idTousers?: Array<{ game_date: Date }>;
}

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

  const checkPassword = await compare(pwd, user.password);

  if (!checkPassword) {
    console.log("wrong password problem", pwd, user.password);
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

export const getCountryCodeById = async (id: string) =>
  await prisma.countries.findFirst({
    where: {
      id: Number(id),
    },
    select: {
      tld_code: true,
    },
  });

export const getCityIdByDescription = async (description: string) => {
  const cityId = await prisma.cities.findFirst({
    where: {
      name: description,
    },
    select: {
      id: true,
    },
  });
  return cityId;
};

export const getNonExistingEmails = async (emailArray: string[]) => {
  const existingUsers = await prisma.users.findMany({
    where: {
      email: {
        in: emailArray,
      },
    },
    select: {
      email: true,
    },
  });

  const existingEmails = existingUsers.map((user) => user.email);

  const nonExistingEmails = emailArray.filter((email) => !existingEmails.includes(email));

  return nonExistingEmails;
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

export const get = async (id: string) => {
  const user = (await prisma.users.findFirst({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      name: true,
      email: true,
      phone_number: true,
      last_login_at: true,
      preferred_gaming_platform: true,
      preferred_game_duration: true,
      timezone_id: true,
      cities: {
        select: {
          id: true,
          name: true,
          timeZoneId: true,
        },
      },
      countries: {
        select: {
          id: true,
          country_name: true,
          tld_code: true,
        },
      },
      game_results_game_results_usa_player_idTousers: {
        select: {
          game_date: true,
        },
        orderBy: {
          game_date: "desc",
        },
        take: 1,
      },
      game_results_game_results_ussr_player_idTousers: {
        select: {
          game_date: true,
        },
        orderBy: {
          game_date: "desc",
        },
        take: 1,
      },
    },
    where: {
      id: Number(id),
    },
  })) as UserWithGameResults | null;

  if (!user) return {};

  const rating = await getRatingByPlayer({ playerId: user?.id });

  // Get the most recent game date from either USA or USSR games
  const lastGameDate = [
    ...(user.game_results_game_results_usa_player_idTousers || []),
    ...(user.game_results_game_results_ussr_player_idTousers || []),
  ].sort((a, b) => new Date(b.game_date).getTime() - new Date(a.game_date).getTime())[0]?.game_date;

  const {
    game_results_game_results_usa_player_idTousers,
    game_results_game_results_ussr_player_idTousers,
    ...userWithoutGames
  } = user;

  const userNormalized = {
    ...userWithoutGames,
    cities: {
      id: user.cities?.id,
      name: user.cities ? `${user.cities.name} - ${user.cities.timeZoneId}` : "-",
    },
    rating: rating?.rating,
    last_game_at: lastGameDate || null,
  };

  const userParsed = JSON.stringify({ ...userNormalized }, (key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );
  return JSON.parse(userParsed);
};

export const update = async (input: UpdateUserInput) => {
  const updateUser = await prisma.users.update({
    where: {
      email: input.email,
    },
    data: {
      first_name: input.firstName,
      last_name: input.lastName,
      name: input.name,
      phone_number: input.phone,
      last_login_at: new Date(),
      preferred_gaming_platform: input.preferredGamingPlatform,
      preferred_game_duration: input.preferredGameDuration,
      city_id: input.city,
      country_id: input.country,
    },
  });
  return { success: true };
};

export const create = async (input: CreateUserInput) => {
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
export const resetPasswordMail = async ({ mail }: ResetPasswordMailInput) => {
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

export const resetPassword = async ({ token, pwd }: ResetPasswordInput) => {
  try {
    const decrypted = decryptHash(token);
    console.log("decrypted", decrypted);
    const values = decrypted.split("#");
    console.log("values", values);
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
  } catch (e) {
    console.log(e);
  }
  return { success: true };
};

const mailBody = ({ firstName, hashedUrl }: MailBodyInput) => {
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
                                            You are receiving this because you requested the reset of your <a href="http://twilight-struggle.com" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://twilight-struggle.com&amp;source=gmail&amp;ust=1725443360407000&amp;usg=AOvVaw2AAo74hiOc71SWQPgzNyjA">twilight-struggle.com</a> account. Click the button below to reset your <span class="il">password</span>.
                                        </p>

                                        <button style="box-sizing:border-box;display:flex;padding:8px 16px;background:linear-gradient(180deg,rgba(255,255,255,0.13) 0%,rgba(17,184,15,0.1) 100%),#ffffff;border:1px solid rgba(75,173,58,0.5);border-radius:4px" align="left" type="button">
                                            <a href="${hashedUrl}" style="text-decoration:none;color:#262626" rel=" noopener noreferrer" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://twilight-struggle.com/account/password/set?token%3Dn9Dpc6tKy2qAjqEd9VEmdmnyittwCZyJcbtl5H5LaGfXLJubkOKhqw5z7aKnFRLcFcc7UGti0DWAzsz1CGSdsQ&amp;source=gmail&amp;ust=1725443360407000&amp;usg=AOvVaw09gQmBXlbA7AyqMyP3d1nG">Reset <span class="il">Password</span></a>
                                        </button>

                                        <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.5;color:#222222;text-align:left" align="left">
                                        If the button does not work, copy this link in your browser:
                                        </p>
                                        ${hashedUrl}
                                        <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.5;color:#222222;text-align:left" align="left">
                                            If you did not request a <span class="il">password</span> reset, you can safely ignore this.<br>
                                        </p>
                                        <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.5;color:#222222;text-align:left" align="left">
                                            Thanks,<br>
                                            ITS Junta
                                        </p>
                                    </div>

                                </td>
                                <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;vertical-align:top;word-break:break-word;border-collapse:collapse!important;text-align:left;color:#222222;font-weight:normal;line-height:19px;margin:0;padding:0" valign="top" align="left"></td>
                            </tr>
                        </tbody>
                    </table>`;

  return body;
};
