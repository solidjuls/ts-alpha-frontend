import * as React from 'react';
import { Checkbox } from "components/Checkbox";
import ReplacePlayers from './ReplacePlayers';
import CsvUploadButton from './CsvButtonUpload';
import UserTypeahead from 'components/UserTypeahead';
// DropdownItemType is now used internally by UserTypeahead

import { Flex, Box } from 'components/Atoms';
import { useQuery } from '@tanstack/react-query';
import { usersService } from 'services/users.service';
import DateComponent from 'components/EditFormComponents/DateComponent';
import { Button } from 'components/Button';
import { useAddSchedule, useRemovePlayer } from 'hooks/useSchedule';
import { Spinner } from '@radix-ui/themes';
import Text from 'components/Text';
import { 
  Panel,
  ScheduleSection,
  SectionTitle,
  FormRow,
  GameCodeInput,
  RemoveButton,
  RemovePlayerContainer
 } from './ScheduleFilter.styled';

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

  // Hook for removing player
  const removePlayerMutation = useRemovePlayer();

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

  // Handle player removal
  const handleRemovePlayer = async () => {
    if (!selectedPlayerToRemove || !tournament) {
      return;
    }

    try {
      await removePlayerMutation.mutateAsync({
        tournamentId: tournament,
        playerId: selectedPlayerToRemove,
      });

      // Reset the selected player
      setSelectedPlayerToRemove("");

      // Call the parent callback if provided
      onPlayerRemove?.(selectedPlayerToRemove);
    } catch (error: any) {
      console.error("Failed to remove player:", error);
    }
  };

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
          <ScheduleSection>
            <SectionTitle>Filter Schedule</SectionTitle>
            <Checkbox
              text="Show Full Schedule"
              checked={showFullSchedule}
              onCheckedChange={(checked) => onShowFullScheduleChange?.(checked)}
            />
            <Checkbox
              text="Show Only Pending Games"
              checked={showOnlyPending}
              onCheckedChange={(checked) => onShowOnlyPendingChange?.(checked)}
            />
            <Flex>
              <>
                <UserTypeahead
                  labelText="Filter by Player"
                  selectedItem={selectedPlayer}
                  placeholder="Type the Player Name..."
                  width="175px;"
                  onBlur={() => {
                    setSelectedPlayer("");
                    onPlayerSelect?.("");
                  }}
                  onSelect={(item) => {
                    setSelectedPlayer(item?.value || "");
                    onPlayerSelect?.(item?.value || "");
                  }}
                />
                
              </>
            </Flex>
          </ScheduleSection>
          <ScheduleSection>
            <SectionTitle>Update Schedule</SectionTitle>

            <FormRow>
              <UserTypeahead
                labelText="USA Player"
                selectedItem={usaPlayer}
                placeholder="Select USA Player..."
                width='150px'
                css={{color:"red"}}
                onBlur={() => {}}
                onSelect={(item) => {
                  setUsaPlayer(item?.value || "");
                  setScheduleMessage(""); // Clear any error messages
                }}
              />

              <UserTypeahead
                labelText="USSR Player"
                selectedItem={ussrPlayer}
                placeholder="Select USSR Player..."
                width='150px'
                onBlur={() => {}}
                onSelect={(item) => {
                  setUssrPlayer(item?.value || "");
                  setScheduleMessage(""); // Clear any error messages
                }}
              />

              <Box>
                <Text>
                  Game Code
                </Text>
                <GameCodeInput
                  type="text"
                  placeholder="Code"
                  value={gameCode}
                  maxLength={4}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setGameCode(e.target.value);
                    setScheduleMessage("");
                  }}
                />
              </Box>

              <DateComponent
                labelText="Due Date"
                inputValue={dueDate}
                onInputValueChange={(value: Date) => {
                  setDueDate(value);
                  setScheduleMessage("");
                }}
              />

              <Button
                onClick={handleCreateSchedule}
                disabled={isCreatingSchedule || !usaPlayer || !ussrPlayer || !dueDate}
              >
                {isCreatingSchedule ? <Spinner size="2" /> : "Create Schedule"}
              </Button>
            </FormRow>
            <FormRow>
              <ReplacePlayers tournament={tournament} />
            </FormRow>
            <SectionTitle>Remove Player</SectionTitle>
            <FormRow>
              <RemovePlayerContainer>
                <UserTypeahead
                  labelText=""
                  selectedItem={selectedPlayerToRemove}
                  placeholder="Player to Remove..."
                  width='150px'
                  onBlur={() => {
                    // Handle blur if needed
                  }}
                  onSelect={(item) => {
                    setSelectedPlayerToRemove(item?.value || "");
                  }}
                />
                <RemoveButton
                  onClick={handleRemovePlayer}
                  disabled={!selectedPlayerToRemove || removePlayerMutation.isPending}
                >
                  {removePlayerMutation.isPending ? <Spinner size="2" /> : "Remove Player"}
                </RemoveButton>
              </RemovePlayerContainer>
            </FormRow>
            {scheduleMessage && (
              <Text
                fontSize="small"
                css={{
                  color: scheduleMessage.includes('success') ? 'var(--usa)' : 'var(--ussr)',
                  marginTop: '8px'
                }}
              >
                {scheduleMessage}
              </Text>
            )}
          </ScheduleSection>
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
