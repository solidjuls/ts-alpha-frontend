import { addSchedulePlayers, deleteSchedulePlayer, getSchedules, replaceSchedulePlayers, updateSchedule, validateScheduleIntegrity } from 'backend/controller/schedules.controller';
import { submit } from "backend/controller/game.controller";
import { NextApiRequest, NextApiResponse } from 'next';

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
        id: number
      } = req.body.data;

      // if (!Array.isArray(schedules) || schedules.length === 0) {
      //   return res.status(400).json({ message: 'No schedule data provided' });
      // }
      
      if (schedules.due_date) {
        const scheduleResponse = await updateSchedule({ dueDate: new Date(schedules.due_date), scheduleId: Number(schedules.id) })
        console.log("scheduleResponse", scheduleResponse)
        res.status(200).json({ message: `Due date for schedule ${schedules.id} updated successfully` });
        return
      } else {
        const validateSchedule = await validateScheduleIntegrity({ usaPlayerId: Number(req.body.data.usaPlayerId), id: Number(req.body.data.id), ussrPlayerId: Number(req.body.data.ussrPlayerId), gameCode: req.body.data.gameCode, gameType: Number(req.body.data.gameType) })

        if (validateSchedule?.game_results_id) {
          res.status(400).json({ message: `Schedule ${schedules.id} already submitted` });
          return
        }
        if (!validateSchedule?.id) {
          res.status(400).json({ message: `Schedule not found` });
          return
        }
        const submitResponse = await submit(req.body.data)
        const scheduleResponse = await updateSchedule({gameResultId: submitResponse.id, scheduleId: Number(schedules.id)})
        console.log("submitResponse", scheduleResponse)

        
      }
    
      res.status(200).json({ message: 'Schedules updated successfully' });
    } catch (error) {
      console.error('[Schedule Bulk Insert]', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT') {
    const {usa, ussr, t, d, gc} = req.body.data;
    console.log("usa, ussr, t, d", usa, ussr, t, d, gc)
    const updated = await addSchedulePlayers(usa, ussr, Number(t), d, gc)
    res.status(200).json(updated);
  } else if (req.method === 'PATCH') {
    const {pold, pnew, t, u} = req.body.data;

    if (u) {
      const updated = await deleteSchedulePlayer(Number(u), Number(t))
      res.status(200).json(`${updated}`);
      return
    }

    const updated = await replaceSchedulePlayers(pold, pnew, Number(t))
    res.status(200).json(updated);
  } else if (req.method === 'GET') {
    const { p = 1, pso = 20, a } = req.query;
    const userId = req.query?.uid as string
    const tournament = req.query?.t
    const userFilter = req.query?.u ? Number(req.query.u) : null
console.log("user", userFilter)
    const { results, totalRows } = await getSchedules({ userId: Number(userId), tournament: tournament?.split(','), userFilter, page: Number(p), pageSize: Number(pso), adminView: a === '1' })
    res.status(200).json({
      results,
      totalRows
    });
  }
}