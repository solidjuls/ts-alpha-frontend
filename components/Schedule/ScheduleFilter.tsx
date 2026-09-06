import React from "react";
import CsvUpload from "./CsvUpload";
import CreateSchedule from "./CreateSchedule";
import ReplacePlayer from "./ReplacePlayer";
import RemovePlayer from "./RemovePlayer";

interface ScheduleFilterProps {
  tournamentId: string;
}

const ScheduleFilter: React.FC<ScheduleFilterProps> = ({ tournamentId }) => {
  return (
    <div style={{ marginTop: "12px", marginBottom: "12px" }}>
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
