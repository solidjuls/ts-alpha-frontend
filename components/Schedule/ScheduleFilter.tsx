import * as React from 'react';
import { Checkbox } from "components/Checkbox";
import { styled } from '@stitches/react';
import ReplacePlayers from './ReplacePlayers';
import AddNewSchedule from './AddNewSchedule';
import CsvUploadButton from './CsvButtonUpload';
import { TournamentsType } from 'types/game.types';
import UserTypeahead from 'pages/submitform/UserTypeahead';
import { DropdownItemType } from 'types/types';
import { UserType } from 'types/user.types';
import { Flex } from 'components/Atoms';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Panel = styled('div', {
  padding: '16px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
  marginBottom: '8px'
});

interface ScheduleFilterProps {
  noSchedule: boolean;
  tournament: string;
  onPlayerSelect?: (playerId: string) => void;
  onPlayerRemove?: (playerId: string) => void;
  onShowFullScheduleChange?: (showFull: boolean) => void;
  onShowOnlyPendingChange?: (showPending: boolean) => void;
  showFullSchedule?: boolean;
  showOnlyPending?: boolean;
}

const ScheduleFilter: React.FC<ScheduleFilterProps> = ({
  tournament,
  onPlayerSelect,
  onPlayerRemove,
  onShowFullScheduleChange,
  onShowOnlyPendingChange,
  showFullSchedule = false,
  showOnlyPending = false
}) => {
  const [checked, setChecked] = React.useState(true);
  const [selectedPlayer, setSelectedPlayer] = React.useState("");
  const [selectedPlayerToRemove, setSelectedPlayerToRemove] = React.useState("");

  // Fetch users for the tournament using React Query
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users', tournament],
    queryFn: async () => {
      const response = await axios.get(`/api/user?t=${tournament}`, {
        withCredentials: true
      });
      return response.data as UserType[];
    },
    enabled: !!tournament,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const usersFilter: DropdownItemType[] = users?.map((item: UserType) => ({
    value: item.id,
    text: item.name,
  })) || []

  return (
    <div>
      <Checkbox text="Show Admin Options" checked={checked} onCheckedChange={setChecked} />
      {checked && (
        <Panel>
          <CsvUploadButton tournament={tournament} />
          <Checkbox
            text="Show full schedule"
            checked={showFullSchedule}
            onCheckedChange={(checked) => onShowFullScheduleChange?.(checked)}
          />
          <Checkbox
            text="Show only pending games (without results)"
            checked={showOnlyPending}
            onCheckedChange={(checked) => onShowOnlyPendingChange?.(checked)}
          />
          <Flex>
            <>
              <UserTypeahead
                labelText="Filter by Player"
                users={usersFilter}
                selectedItem={selectedPlayer}
                placeholder="Type the player name to filter schedule..."
                css={{ width: '320px', marginRight: "8px" }}
                onBlur={() => {
                  // Handle blur if needed
                }}
                onSelect={(item: DropdownItemType) => {
                  setSelectedPlayer(item.value || "");
                  onPlayerSelect?.(item.value || "");
                }}
              />
              <UserTypeahead
                labelText="Remove Player"
                users={usersFilter}
                selectedItem={selectedPlayerToRemove}
                placeholder="Type the player name to remove..."
                css={{ width: '320px' }}
                onBlur={() => {
                  // Handle blur if needed
                }}
                onSelect={(item: DropdownItemType) => {
                  setSelectedPlayerToRemove(item.value || "");
                  onPlayerRemove?.(item.value || "");
                }}
              />
            </>
          </Flex>
          <ReplacePlayers tournament={tournament} />
        </Panel>
      )}
    </div>
  );
};
// {!noSchedule && <AddNewSchedule tournament={userAdminTournaments} />}
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

export default ScheduleFilter
