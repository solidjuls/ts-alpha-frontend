import * as React from 'react';
import { Checkbox } from "components/Checkbox";
import styled from 'styled-components';
import ReplacePlayers from './ReplacePlayers';
import CsvUploadButton from './CsvButtonUpload';
import UserTypeahead from 'components/UserTypeahead';
// DropdownItemType is now used internally by UserTypeahead

import { Flex, Box } from 'components/Atoms';
import { useQuery } from '@tanstack/react-query';
import { usersService } from 'services/users.service';
import DateComponent from 'components/EditFormComponents/DateComponent';
import { Input } from 'components/Input';
import { Button } from 'components/Button';
import { useAddSchedule } from 'hooks/useSchedule';
import { Spinner } from '@radix-ui/themes';
import Text from 'components/Text';

const Panel = styled.div`
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 8px;
`;

const ManualScheduleSection = styled.div`
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f8f9fa;
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
`;

const FormRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const GameCodeInput = styled(Input)`
  width: 80px;
  height: 35px;
`;

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

  // Manual schedule creation state
  const [usaPlayer, setUsaPlayer] = React.useState("");
  const [ussrPlayer, setUssrPlayer] = React.useState("");
  const [gameCode, setGameCode] = React.useState("");
  const [dueDate, setDueDate] = React.useState<Date>(new Date());
  const [isCreatingSchedule, setIsCreatingSchedule] = React.useState(false);
  const [scheduleMessage, setScheduleMessage] = React.useState("");

  // Hook for adding schedule
  const addScheduleMutation = useAddSchedule();

  // Fetch users for the tournament using React Query and NestJS backend
  const { data: users } = useQuery({
    queryKey: ['users', tournament],
    queryFn: async () => {
      if (!tournament) return [];
      return await usersService.getUsersByTournament(tournament);
    },
    enabled: !!tournament,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Users are now fetched directly by the UserTypeahead components

  // Handle manual schedule creation
  const handleCreateSchedule = async () => {
    if (!usaPlayer || !ussrPlayer || !dueDate) {
      setScheduleMessage("Please fill in all required fields");
      return;
    }

    if (usaPlayer === ussrPlayer) {
      setScheduleMessage("USA and USSR players must be different");
      return;
    }

    setIsCreatingSchedule(true);
    setScheduleMessage("");

    try {
      await addScheduleMutation.mutateAsync({
        tournamentId: tournament,
        usaPlayerId: usaPlayer,
        ussrPlayerId: ussrPlayer,
        dueDate: dueDate.toISOString(),
        gameCode: gameCode || "", // Optional field
      });

      // Reset form on success
      setUsaPlayer("");
      setUssrPlayer("");
      setGameCode("");
      setDueDate(new Date());
      setScheduleMessage("Schedule created successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setScheduleMessage(""), 3000);
    } catch (error: any) {
      console.error("Failed to create schedule:", error);
      setScheduleMessage(error?.response?.data?.message || "Failed to create schedule");
    } finally {
      setIsCreatingSchedule(false);
    }
  };

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
                selectedItem={selectedPlayer}
                placeholder="Type the player name to filter schedule..."
                css={{ width: '320px', marginRight: "8px" }}
                onBlur={() => {
                  setSelectedPlayer("");
                  onPlayerSelect?.("");
                }}
                onSelect={(item) => {
                  setSelectedPlayer(item?.value || "");
                  onPlayerSelect?.(item?.value || "");
                }}
              />
              <UserTypeahead
                labelText="Remove Player"
                selectedItem={selectedPlayerToRemove}
                placeholder="Type the player name to remove..."
                css={{ width: '320px' }}
                onBlur={() => {
                  // Handle blur if needed
                }}
                onSelect={(item) => {
                  setSelectedPlayerToRemove(item?.value || "");
                  onPlayerRemove?.(item?.value || "");
                }}
              />
            </>
          </Flex>
          <ReplacePlayers tournament={tournament} />

          {/* Manual Schedule Creation Section */}
          <ManualScheduleSection>
            <SectionTitle>Create New Schedule</SectionTitle>

            <FormRow>
              <UserTypeahead
                labelText="USA Player"
                selectedItem={usaPlayer}
                placeholder="Select USA player..."
                css={{ width: '200px' }}
                onBlur={() => {}}
                onSelect={(item) => {
                  setUsaPlayer(item?.value || "");
                  setScheduleMessage(""); // Clear any error messages
                }}
              />

              <UserTypeahead
                labelText="USSR Player"
                selectedItem={ussrPlayer}
                placeholder="Select USSR player..."
                css={{ width: '200px' }}
                onBlur={() => {}}
                onSelect={(item) => {
                  setUssrPlayer(item?.value || "");
                  setScheduleMessage(""); // Clear any error messages
                }}
              />

              <Box>
                <Text fontSize="small" css={{ marginBottom: '4px', display: 'block' }}>
                  Game Code (Optional)
                </Text>
                <GameCodeInput
                  type="text"
                  placeholder="Code"
                  value={gameCode}
                  maxLength={4}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setGameCode(e.target.value);
                    setScheduleMessage(""); // Clear any error messages
                  }}
                />
              </Box>

              <DateComponent
                labelText="Due Date"
                inputValue={dueDate}
                onInputValueChange={(value: Date) => {
                  setDueDate(value);
                  setScheduleMessage(""); // Clear any error messages
                }}
              />

              <Button
                onClick={handleCreateSchedule}
                disabled={isCreatingSchedule || !usaPlayer || !ussrPlayer || !dueDate}
                css={{
                  height: '35px',
                  backgroundColor: '#10b981',
                  '&:hover': { backgroundColor: '#059669' },
                  '&:disabled': { backgroundColor: '#9ca3af' }
                }}
              >
                {isCreatingSchedule ? <Spinner size="2" /> : "Create Schedule"}
              </Button>
            </FormRow>

            {scheduleMessage && (
              <Text
                fontSize="small"
                css={{
                  color: scheduleMessage.includes('success') ? '#10b981' : '#dc2626',
                  marginTop: '8px'
                }}
              >
                {scheduleMessage}
              </Text>
            )}
          </ManualScheduleSection>
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
