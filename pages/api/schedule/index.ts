import { getSchedules } from 'backend/controller/schedules.controller';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // this is added from the tournament app
  if (req.method === 'POST') {
    // return res.status(405).json({ message: 'Method Not Allowed' });
  
  //   try {
  //     const schedules: {
  //       tournaments_id: number;
  //       game_code: string;
  //       usa_player_id: bigint;
  //       ussr_player_id: bigint;
  //       due_date: string;
  //       game_results_id?: bigint | null;
  //     }[] = req.body;

  //     if (!Array.isArray(schedules) || schedules.length === 0) {
  //       return res.status(400).json({ message: 'No schedule data provided' });
  //     }
  // console.log("schedules", schedules)
  //     await insertSchedule(schedules)
    
  //     res.status(200).json({ message: 'Schedules inserted successfully' });
  //   } catch (error) {
  //     console.error('[Schedule Bulk Insert]', error);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  } else if (req.method === 'GET') {
   const response = await getSchedules()
   res.status(200).json(response);
  }
}