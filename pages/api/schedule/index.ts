import { getSchedules, updateSchedule } from 'backend/controller/schedules.controller';
import { submit } from "backend/controller/game.controller";
import { NextApiRequest, NextApiResponse } from 'next';
// export const zGameAPI = z.object({
//   gameWinner: z.enum(["1", "2", "3"]),
//   gameCode: z.string(),
//   gameType: z.string(),
//   usaPlayerId: z.string(),
//   ussrPlayerId: z.string(),
//   endTurn: z.string(),
//   endMode: z.string(),
//   video1: z.optional(z.string()),
// });

// export const zGameRecreateAPI = zGameAPI.extend({
//   oldId: z.string(),
//   gameDate: z.string(),
// });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
  
    try {
      const schedules: {
        tournaments_id: number;
        game_code: string;
        usa_player_id: bigint;
        ussr_player_id: bigint;
        due_date: string;
        game_results_id?: bigint | null;
      }[] = req.body;

      // if (!Array.isArray(schedules) || schedules.length === 0) {
      //   return res.status(400).json({ message: 'No schedule data provided' });
      // }
      console.log("req.body.data", req.body.data)
      const submitResponse = await submit(req.body.data)
      // await updateSchedule(schedules.)
      console.log("submitResponse", submitResponse, schedules)
    
      res.status(200).json({ message: 'Schedules inserted successfully' });
    } catch (error) {
      console.error('[Schedule Bulk Insert]', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
   const response = await getSchedules()
   res.status(200).json(response);
  }
}