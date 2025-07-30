import * as React from 'react';
import { Checkbox } from "components/Checkbox";
import { styled } from '@stitches/react';
import ReplacePlayers from './ReplacePlayers';
import AddNewSchedule from './AddNewSchedule';
import CsvUploadButton from './CsvButtonUpload';
import { TournamentsType } from 'types/game.types';

const Panel = styled('div', {
  padding: '16px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
  marginBottom: '8px'
});

interface ScheduleFilterProps {
  userAdminTournaments: TournamentsType | null
}

export const ScheduleFilter: React.FC<ScheduleFilterProps> = ({ userAdminTournaments }) => {
  const [checked, setChecked] = React.useState(true);

  return (
    <div>
      <Checkbox text="Show Admin Options" checked={checked} onCheckedChange={setChecked} />
      {checked && (
        <Panel>
          <CsvUploadButton tournament={userAdminTournaments} />
          <ReplacePlayers tournament={userAdminTournaments} />
          <AddNewSchedule tournament={userAdminTournaments} />
        </Panel>
      )}
    </div>
  );
};

// SUPER ADMIN 
// all tournaments with a schedule
// upload csv. I can see the option if I'm admin of the tournament (or super admin), and the tournament is still "registering"
// replace players -> old player, new player, tournament filter selected

// ADMIN
  // admin view: I can see my tournament schedules with a tournament filter,
      // I can update due date,
      // I can replace players,
      // I can add a scheduleI can reset a game

// PLAYER VIEW
// tournament filter should display only the allowed tournaments

// add new schedule -> players, tournament, due date
// super admin view: I can see everything with a tournament filter, and do everything
// // player view. I can only see submit option and the tournament filter with my open tournaments