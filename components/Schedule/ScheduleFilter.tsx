import React from "react";
import CsvUpload from "./CsvUpload";
import CreateSchedule from "./CreateSchedule";
import ReplacePlayer from "./ReplacePlayer";
import RemovePlayer from "./RemovePlayer";
import { Checkbox } from "components/Checkbox";

interface ScheduleFilterProps {
  tournamentId: string;
  showMissingGames?: boolean;
  onShowMissingGamesChange?: (value: boolean) => void;
}

const ScheduleFilter: React.FC<ScheduleFilterProps> = ({ tournamentId, showMissingGames, onShowMissingGamesChange }) => {
  return (
    <div style={{ marginTop: "12px", marginBottom: "12px" }}>
      {onShowMissingGamesChange && (
        <div style={{ marginBottom: "12px" }}>
          <Checkbox
            checked={showMissingGames || false}
            text="See missing games"
            onCheckedChange={onShowMissingGamesChange}
          />
        </div>
      )}
      <CsvUpload tournamentId={tournamentId} />
      <CreateSchedule tournamentId={tournamentId} />
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <ReplacePlayer tournamentId={tournamentId} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <RemovePlayer tournamentId={tournamentId} />
        </div>
      </div>
    </div>
  );
};

export default ScheduleFilter;
