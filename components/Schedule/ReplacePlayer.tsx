import { useState } from "react";
import { useReplacePlayer } from "hooks/useSchedule";
import UserTypeahead from "components/UserTypeahead";

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
  gap: "8px",
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

const ReplacePlayer = ({ tournamentId }: { tournamentId: string }) => {
  const replacePlayerMutation = useReplacePlayer();
  const [oldUser, setOldUser] = useState("");
  const [newUser, setNewUser] = useState("");
  const [replaceMessage, setReplaceMessage] = useState("");

  const handleReplacePlayer = async () => {
    if (!tournamentId || !oldUser || !newUser) return;
    try {
      const result = await replacePlayerMutation.mutateAsync({
        tournamentId,
        oldPlayerId: oldUser,
        newPlayerId: newUser,
      });
      const totalUpdated = (result.updatedUSA?.count || 0) + (result.updatedUSSR?.count || 0);
      setReplaceMessage(`${totalUpdated} schedule entries have been updated`);
    } catch {
      setReplaceMessage("Error updating players. Please try again.");
    }
  };

  return (
    <div style={sectionStyle}>
      <h4 style={sectionTitleStyle}>Replace Player</h4>
      <div style={formRowStyle}>
        <UserTypeahead
          labelText="Old Player"
          selectedItem={oldUser}
          placeholder="Player to Replace..."
          width="150px"
          onBlur={() => setOldUser("")}
          onSelect={(value) => setOldUser(value?.value as string)}
        />
        <UserTypeahead
          labelText="New Player"
          selectedItem={newUser}
          placeholder="Type the New Player..."
          width="150px"
          onBlur={() => setNewUser("")}
          onSelect={(value) => setNewUser(value?.value as string)}
        />
        <button
          onClick={handleReplacePlayer}
          disabled={!oldUser || !newUser || replacePlayerMutation.isPending}
          style={{ ...btnStyle, opacity: !oldUser || !newUser || replacePlayerMutation.isPending ? 0.5 : 1 }}
        >
          {replacePlayerMutation.isPending ? "Updating..." : "Replace Player"}
        </button>
      </div>
      {replaceMessage && <span style={{ fontSize: "13px" }}>{replaceMessage}</span>}
    </div>
  );
};

export default ReplacePlayer;
