import { insertSchedule } from "backend/controller/schedules.controller";
import { getUserIdByEmails } from "backend/controller/user.controller";
import { NextApiRequest, NextApiResponse } from "next";
import { ScheduleDBType, ScheduleType } from "types/types";

type Game = {
  due_date: string;
  game_code: string;
  tournaments_id: string;
  usa_player_email: string;
  ussr_player_email: string;
};

type UserEmailMapType = {
  id: bigint | number;
  email: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");
  try {
    const { file, tournament } = req.body?.data
    
    const allEmails = file.flatMap(item => [item.usa_player_email, item.ussr_player_email].filter(Boolean));
    const uniqueEmails = Array.from(new Set(allEmails));

    
    const userIdsWithEmail: UserEmailMapType[] = await getUserIdByEmails(uniqueEmails)

    const emailToIdMap = new Map<string, number | bigint>(
        userIdsWithEmail.map(user => [user.email.toLowerCase(), user.id])
    );

    const convertedSchedules: ScheduleDBType[] = file.map(schedule => {
        return {
            due_date: schedule.due_date,
            game_code: schedule.game_code,
            tournaments_id: tournament,
            usa_player_id: emailToIdMap.get(schedule.usa_player_email.toLowerCase()) ?? -1,
            ussr_player_id: emailToIdMap.get(schedule.ussr_player_email.toLowerCase()) ?? -1
        }
    });

    await insertSchedule(convertedSchedules)

    return res.status(200).json({})
  } catch(e) {
    return res.status(500).json({})
  }
}
