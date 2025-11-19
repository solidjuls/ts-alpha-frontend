import { useState } from "react";
import { Button } from "components/Button";
import { StyledLabel } from "components/DisplayInfo/DisplayInfo.styles";
import { useRegisteredPlayers, useUnregisterFromTournament } from "hooks/useTournaments";
import { styled } from "stitches.config";
import { UnstyledLink } from "pages/players";

const PlayersContainer = styled.div`
  margin-top: 24px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background-color: white;
`;

const PlayersHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;
  border-radius: 8px 8px 0 0;
`;

const PlayerRow = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 20px",
  borderBottom: "1px solid #f1f3f4",
  
  "&:last-child": {
    borderBottom: "none",
  },
  
  // "&:hover": {
  //   backgroundColor: "#f8f9fa",
  // },
});

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8f9fa;
  }
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PlayerName = styled.span`
  font-weight: 500;
  font-size: 14px;
`;

const PlayerEmail = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

interface StatusBadgeProps {
  $status?: 'pending' | 'accepted' | 'rejected' | 'waiting' | 'forfeited';
}

const StatusBadge = styled.span<StatusBadgeProps>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;

  ${props => {
    switch (props.$status) {
      case 'pending':
        return `
          background-color: #fef3c7;
          color: #92400e;
        `;
      case 'accepted':
        return `
          background-color: #d1fae5;
          color: #065f46;
        `;
      case 'rejected':
        return `
          background-color: #fee2e2;
          color: #991b1b;
        `;
      case 'waiting':
        return `
          background-color: #e0e7ff;
          color: #3730a3;
        `;
      case 'forfeited':
        return `
          background-color: #f3f4f6;
          color: #374151;
        `;
      default:
        return `
          background-color: #f3f4f6;
          color: #374151;
        `;
    }
  }}
`;

const LoadingContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

const HeaderFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EmptyStateContainer = styled.div`
  padding: 20px;
  text-align: center;
  color: #6b7280;
`;

const PlayersListContainer = styled.div``;

const PlayerActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RemoveButton = styled(Button)`
  background-color: #dc2626;
  font-size: 12px;
  padding: 6px 12px;

  &:hover {
    background-color: #b91c1c;
  }
`;

interface RegisteredPlayer {
  registrationId: number;
  email: string;
  status: string;
  rating: string;
  registeredAt: Date;
  userId?: string;
  name: string;
  countryCode?: string;
}

interface TournamentPlayersListProps {
  tournamentId: string;
  onPlayerRemoved?: () => void;
  isUserAdmin: boolean
}

const TournamentPlayersList = ({ tournamentId, onPlayerRemoved, isUserAdmin }: TournamentPlayersListProps) => {
  const [removingPlayerId, setRemovingPlayerId] = useState<number | null>(null);

  const { data: players, isLoading, refetch } = useRegisteredPlayers(parseInt(tournamentId));
  const unregisterMutation = useUnregisterFromTournament();

  const handleRemovePlayer = async (registrationId: number, tournamentId: string) => {
    if (!confirm(`Are you sure you want to remove this player from the tournament?`)) {
      return;
    }

    setRemovingPlayerId(registrationId);
    try {
      await unregisterMutation.mutateAsync({
        tournamentId: Number(tournamentId),
        registrationId: registrationId
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
        <LoadingContainer>
          Loading players...
        </LoadingContainer>
      </PlayersContainer>
    );
  }
console.log("players", tournamentId)
  return (
    <PlayersContainer>
      <PlayersHeader>
        <HeaderFlex>
          <StyledLabel>Registered Players ({players?.length || 0})</StyledLabel>
        </HeaderFlex>
      </PlayersHeader>

      {!players || players.length === 0 ? (
        <EmptyStateContainer>
          No players registered yet.
        </EmptyStateContainer>
      ) : (
        <PlayersListContainer>
          {players.map((player) => (
            <PlayerRow key={player.registrationId}>
              <PlayerInfo>
                <Flex css={{ gap: 4 }}>
                  <PlayerName><UnstyledLink href={`/userprofile/${player.userId}`}>{player.name}</UnstyledLink></PlayerName>
                  <PlayerName>{player.rating}</PlayerName>
                </Flex>
                {isUserAdmin && <PlayerEmail>{player.email}</PlayerEmail>}
              </PlayerInfo>
              
              {isUserAdmin && (
                <Flex css={{ alignItems: "center", gap: "12px" }}>
                <Button
                  css={{ 
                    backgroundColor: "#dc2626", 
                    fontSize: "12px", 
                    padding: "6px 12px",
                    "&:hover": { backgroundColor: "#b91c1c" }
                  }}
                  disabled={removingPlayerId === player.registrationId}
                  onClick={() => handleRemovePlayer(player.registrationId, tournamentId)}
                >
                  {removingPlayerId === player.registrationId ? "Removing..." : "Remove"}
                </Button>
              </Flex>)}
            </PlayerRow>
          ))}
        </PlayersListContainer>
      )}
    </PlayersContainer>
  );
};

export default TournamentPlayersList;
