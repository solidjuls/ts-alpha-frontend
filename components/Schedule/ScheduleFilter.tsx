import * as React from 'react';
import { Checkbox } from "components/Checkbox";
import UserTypeahead from 'components/UserTypeahead';

interface ScheduleFilterProps {
  onPlayerSelect?: (playerId: string) => void;
  onShowFullScheduleChange?: (showFull: boolean) => void;
  showFullSchedule?: boolean;
}

const ScheduleFilter: React.FC<ScheduleFilterProps> = ({
  onPlayerSelect,
  onShowFullScheduleChange,
  showFullSchedule = false
}) => {
  const [selectedPlayer, setSelectedPlayer] = React.useState("");

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", flexWrap: "wrap" }}>
      <Checkbox
        text="Show Full Schedule"
        checked={showFullSchedule}
        onCheckedChange={(checked) => onShowFullScheduleChange?.(checked)}
      />
      <UserTypeahead
        labelText="Filter by Player"
        selectedItem={selectedPlayer}
        placeholder="Type the Player Name..."
        width="175px"
        onBlur={() => {
          setSelectedPlayer("");
          onPlayerSelect?.("");
        }}
        onSelect={(item) => {
          setSelectedPlayer(item?.value || "");
          onPlayerSelect?.(item?.value || "");
        }}
      />
    </div>
  );
};

export default ScheduleFilter
