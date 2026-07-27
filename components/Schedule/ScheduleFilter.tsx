import * as React from 'react';
import { Checkbox } from "components/Checkbox";
import UserTypeahead from 'components/UserTypeahead';

import { Flex } from 'components/Atoms';
import { useRemovePlayer } from 'hooks/useSchedule';
import { Spinner } from '@radix-ui/themes';
import {
  Panel,
  ScheduleSection,
  SectionTitle,
  FormRow,
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

  // Hook for removing player
  const removePlayerMutation = useRemovePlayer();

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

      setSelectedPlayerToRemove("");
      onPlayerRemove?.(selectedPlayerToRemove);
    } catch (error: any) {
      console.error("Failed to remove player:", error);
    }
  };

  return (
    <div>
      <Checkbox text="Show Admin Options" checked={checked} onCheckedChange={setChecked} />
      {checked && (
        <Panel>
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
            </Flex>
          </ScheduleSection>
          <ScheduleSection>
            <SectionTitle>Remove Player</SectionTitle>
            <FormRow>
              <RemovePlayerContainer>
                <UserTypeahead
                  labelText=""
                  selectedItem={selectedPlayerToRemove}
                  placeholder="Player to Remove..."
                  width='150px'
                  onBlur={() => {}}
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
          </ScheduleSection>
        </Panel>
      )}
    </div>
  );
};

export default ScheduleFilter
