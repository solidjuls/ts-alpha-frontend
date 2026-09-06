import { useState } from "react";
import { Spinner } from "@radix-ui/themes";
import { useRemovePlayer } from "hooks/useSchedule";
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

const RemovePlayer = ({ tournamentId }: { tournamentId: string }) => {
  const removePlayerMutation = useRemovePlayer();
  const [playerToRemove, setPlayerToRemove] = useState("");
  const [removeMessage, setRemoveMessage] = useState("");

  const handleRemovePlayer = async () => {
    if (!tournamentId || !playerToRemove) return;
    setRemoveMessage("");
    try {
      await removePlayerMutation.mutateAsync({
        tournamentId,
        playerId: playerToRemove,
      });
      setRemoveMessage("Player removed successfully");
      setPlayerToRemove("");
    } catch (err: any) {
      setRemoveMessage(err?.response?.data?.message || "Error removing player. Please try again.");
    }
    setTimeout(() => setRemoveMessage(""), 3000);
  };

  return (
    <div style={sectionStyle}>
      <h4 style={sectionTitleStyle}>Remove Player</h4>
      <div style={formRowStyle}>
        <UserTypeahead
          labelText="Player"
          selectedItem={playerToRemove}
          placeholder="Player to Remove..."
          width="150px"
          onBlur={() => {}}
          onSelect={(item) => setPlayerToRemove(item?.value || "")}
        />
        <button
          onClick={handleRemovePlayer}
          disabled={!playerToRemove || removePlayerMutation.isPending}
          style={{ ...btnStyle, opacity: !playerToRemove || removePlayerMutation.isPending ? 0.5 : 1 }}
        >
          {removePlayerMutation.isPending ? <Spinner size="2" /> : "Remove Player"}
        </button>
      </div>
      {removeMessage && (
        <span style={{ fontSize: "13px", color: removeMessage.includes("success") ? "var(--usa)" : "var(--ussr)" }}>
          {removeMessage}
        </span>
      )}
    </div>
  );
};

export default RemovePlayer;
