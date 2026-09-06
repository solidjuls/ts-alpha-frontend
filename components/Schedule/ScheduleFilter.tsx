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
    <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", marginTop: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
      <UserTypeahead
        selectedItem={selectedPlayer}
        placeholder="Filter by Player"
        width="275px"
        onBlur={() => {
          setSelectedPlayer("");
          onPlayerSelect?.("");
        }}
        onSelect={(item) => {
          setSelectedPlayer(item?.value || "");
          onPlayerSelect?.(item?.value || "");
        }}
      />
      <Checkbox
        text="Show Full Schedule"
        checked={showFullSchedule}
        onCheckedChange={(checked) => onShowFullScheduleChange?.(checked)}
      />
    </div>
  );
};

export default ScheduleFilter
