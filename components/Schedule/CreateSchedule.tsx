import { useState } from "react";
import { Spinner } from "@radix-ui/themes";
import { useAddSchedule } from "hooks/useSchedule";
import UserTypeahead from "components/UserTypeahead";
import DateComponent from "components/EditFormComponents/DateComponent";
import { Checkbox } from "components/Checkbox";
import { Input } from "components/Input";

const sectionStyle: React.CSSProperties = {
  marginTop: "16px",
  padding: "16px",
  border: "1px solid var(--border)",
  borderRadius: "6px",
  background: "var(--bg-card)",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: "0 0 12px 0",
  color: "var(--primary-text)",
};

const formRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  alignItems: "flex-end",
  marginBottom: "12px",
  flexWrap: "wrap",
};

const btnStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "1px solid var(--border)",
  fontWeight: 600,
  color: "var(--primary-text)",
  backgroundColor: "var(--bg-card)",
  cursor: "pointer",
};

const CreateSchedule = ({ tournamentId }: { tournamentId: string }) => {
  const addScheduleMutation = useAddSchedule();
  const [usaPlayer, setUsaPlayer] = useState("");
  const [ussrPlayer, setUssrPlayer] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [bestOf, setBestOf] = useState<number | null>(null);
  const [random, setRandom] = useState(false);
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [scheduleMessage, setScheduleMessage] = useState("");

  const handleCreateSchedule = async () => {
    if (!usaPlayer || !ussrPlayer || !dueDate) {
      setScheduleMessage("Please fill in all required fields");
      return;
    }
    if (usaPlayer === ussrPlayer) {
      setScheduleMessage("USA and USSR players must be different");
      return;
    }
    if (bestOf !== null && ![1, 3, 5, 7].includes(bestOf)) {
      setScheduleMessage("Best Of must be 1, 3, 5, or 7");
      return;
    }
    setScheduleMessage("");
    try {
      await addScheduleMutation.mutateAsync({
        tournamentId,
        usaPlayerId: usaPlayer,
        ussrPlayerId: ussrPlayer,
        randomSides: random,
        dueDate: dueDate.toISOString(),
        gameCode: gameCode || "",
        bestOf,
      });
      setScheduleMessage("Schedule created successfully!");
      setTimeout(() => setScheduleMessage(""), 3000);
    } catch (err: any) {
      setScheduleMessage(err?.response?.data?.message || "Failed to create schedule");
    }
  };

  return (
    <div style={sectionStyle}>
      <h4 style={sectionTitleStyle}>Create Schedule</h4>
      <div style={formRowStyle}>
        <UserTypeahead
          labelText="USA Player"
          selectedItem={usaPlayer}
          placeholder="Select USA Player..."
          width="150px"
          onBlur={() => {}}
          onSelect={(item) => { setUsaPlayer(item?.value || ""); setScheduleMessage(""); }}
        />
        <UserTypeahead
          labelText="USSR Player"
          selectedItem={ussrPlayer}
          placeholder="Select USSR Player..."
          width="150px"
          onBlur={() => {}}
          onSelect={(item) => { setUssrPlayer(item?.value || ""); setScheduleMessage(""); }}
        />
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 600 }}>Game Code</label>
          <Input
            type="text"
            placeholder="Code"
            value={gameCode}
            maxLength={4}
            width="80px"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setGameCode(e.target.value); setScheduleMessage(""); }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 600 }}>Best Of</label>
          <Input
            type="text"
            placeholder="1|3|5|7"
            value={bestOf !== null ? String(bestOf) : ""}
            width="80px"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value.replace(/[^1357]/g, "");
              setBestOf(val ? Number(val) : null);
              setScheduleMessage("");
            }}
          />
        </div>
        <DateComponent
          labelText="Due Date"
          inputValue={dueDate}
          onInputValueChange={(value: Date) => { setDueDate(value); setScheduleMessage(""); }}
        />
        <Checkbox text="Random" checked={random} onCheckedChange={() => setRandom(!random)} />
        <button
          onClick={handleCreateSchedule}
          disabled={!usaPlayer || !ussrPlayer || !dueDate || addScheduleMutation.isPending}
          style={{ ...btnStyle, opacity: !usaPlayer || !ussrPlayer || !dueDate || addScheduleMutation.isPending ? 0.5 : 1 }}
        >
          {addScheduleMutation.isPending ? <Spinner size="2" /> : "Create Schedule"}
        </button>
      </div>
      {scheduleMessage && (
        <span style={{ fontSize: "13px", color: scheduleMessage.includes("success") ? "var(--usa)" : "var(--ussr)" }}>
          {scheduleMessage}
        </span>
      )}
    </div>
  );
};

export default CreateSchedule;
