import { useState } from "react";
import { Box, Flex } from "components/Atoms";
import { Button } from "components/Button";
import { StyledLabel } from "components/DisplayInfo/DisplayInfo.styles";
import useFetchInitialData from "hooks/useFetchInitialData";
import getAxiosInstance from "utils/axios";
import { styled } from "stitches.config";

const PlayersContainer = styled("div", {
  marginTop: "24px",
  border: "1px solid #e9ecef",
  borderRadius: "8px",
  backgroundColor: "white",
});

const PlayersHeader = styled("div", {
  padding: "16px 20px",
  borderBottom: "1px solid #e9ecef",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px 8px 0 0",
});

const PlayerRow = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 20px",
  borderBottom: "1px solid #f1f3f4",
  
  "&:last-child": {
    borderBottom: "none",
  },
  
  "&:hover": {
    backgroundColor: "#f8f9fa",
  },
});

const PlayerInfo = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

const PlayerName = styled("span", {
  fontWeight: "500",
  fontSize: "14px",
});

const PlayerEmail = styled("span", {
  fontSize: "12px",
  color: "#6b7280",
});

const StatusBadge = styled("span", {
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: "500",
  textTransform: "capitalize",
  
  variants: {
    status: {
      pending: {
        backgroundColor: "#fef3c7",
        color: "#92400e",
      },
      accepted: {
        backgroundColor: "#d1fae5",
        color: "#065f46",
      },
      rejected: {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
      },
      waiting: {
        backgroundColor: "#e0e7ff",
        color: "#3730a3",
      },
      forfeited: {
        backgroundColor: "#f3f4f6",
        color: "#374151",
      },
    }
  }
});

interface RegisteredPlayer {
  registrationId: number;
  email: string;
  status: string;
  registeredAt: Date;
  userId?: string;
  name: string;
  countryCode?: string;
}

interface TournamentPlayersListProps {
  tournamentId: string;
  onPlayerRemoved?: () => void;
}

const TournamentPlayersList = ({ tournamentId, onPlayerRemoved }: TournamentPlayersListProps) => {
  const [removingPlayerId, setRemovingPlayerId] = useState<number | null>(null);

  const { data: players, isLoading, refetch } = useFetchInitialData<RegisteredPlayer[]>({
    url: `/api/game/tournaments?id=${tournamentId}&players=true`,
    key: `tournament-players-${tournamentId}`,
    enabled: !!tournamentId,
  });

  const handleRemovePlayer = async (playerEmail: string, registrationId: number) => {
    if (!confirm(`Are you sure you want to remove this player from the tournament?`)) {
      return;
    }

    setRemovingPlayerId(registrationId);
    try {
      await getAxiosInstance().delete('/api/game/tournaments/registration', {
        data: { tournamentId: Number(tournamentId), userEmail: playerEmail }
      });
      
      refetch();
      onPlayerRemoved?.();
    } catch (error) {
      console.error("Error removing player:", error);
      alert("Failed to remove player. Please try again.");
    } finally {
      setRemovingPlayerId(null);
    }
  };

  if (isLoading) {
    return (
      <PlayersContainer>
        <PlayersHeader>
          <StyledLabel>Registered Players</StyledLabel>
        </PlayersHeader>
        <Box css={{ padding: "20px", textAlign: "center" }}>
          Loading players...
        </Box>
      </PlayersContainer>
    );
  }

  return (
    <PlayersContainer>
      <PlayersHeader>
        <Flex css={{ justifyContent: "space-between", alignItems: "center" }}>
          <StyledLabel>Registered Players ({players?.length || 0})</StyledLabel>
        </Flex>
      </PlayersHeader>
      
      {!players || players.length === 0 ? (
        <Box css={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
          No players registered yet.
        </Box>
      ) : (
        <Box>
          {players.map((player) => (
            <PlayerRow key={player.registrationId}>
              <PlayerInfo>
                <PlayerName>{player.name}</PlayerName>
                <PlayerEmail>{player.email}</PlayerEmail>
              </PlayerInfo>
              
              <Flex css={{ alignItems: "center", gap: "12px" }}>
                <StatusBadge status={player.status as any}>
                  {player.status}
                </StatusBadge>
                
                <Button
                  css={{ 
                    backgroundColor: "#dc2626", 
                    fontSize: "12px", 
                    padding: "6px 12px",
                    "&:hover": { backgroundColor: "#b91c1c" }
                  }}
                  disabled={removingPlayerId === player.registrationId}
                  onClick={() => handleRemovePlayer(player.email, player.registrationId)}
                >
                  {removingPlayerId === player.registrationId ? "Removing..." : "Remove"}
                </Button>
              </Flex>
            </PlayerRow>
          ))}
        </Box>
      )}
    </PlayersContainer>
  );
};

export default TournamentPlayersList;
