import { useState } from "react";
import { Button } from "components/Button";
import { StyledLabel } from "components/DisplayInfo/DisplayInfo.styled";
import { useRegisteredPlayers, useUnregisterFromTournament, useForfeitPlayer } from "hooks/useTournaments";
import styled from "styled-components";
import { RegisteredPlayer } from "services/tournaments.service";

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

const PlayerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #f1f3f4;

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

const ForfeitButton = styled(Button)`
  background-color: #f59e0b;
  font-size: 12px;
  padding: 6px 12px;

  &:hover {
    background-color: #d97706;
  }
`;

interface TournamentPlayersListProps {
  tournamentId: string;
  tournamentStatusId?: number;
  onPlayerRemoved?: () => void;
  isAdmin?: boolean;
}

const TournamentPlayersList = ({ tournamentId, tournamentStatusId, onPlayerRemoved, isAdmin = false }: TournamentPlayersListProps) => {
  const [removingPlayerId, setRemovingPlayerId] = useState<number | null>(null);
  const [forfeitingPlayerId, setForfeitingPlayerId] = useState<number | null>(null);

  const { data: players, isLoading, refetch } = useRegisteredPlayers(parseInt(tournamentId));
  const unregisterMutation = useUnregisterFromTournament();
  const forfeitMutation = useForfeitPlayer();

  // Show Forfeit button when tournament status is 4 (started)
  const showForfeitButton = tournamentStatusId === 4;

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

  const handleForfeitPlayer = async (registrationId: number, tournamentId: string) => {
    if (!confirm(`Are you sure you want to forfeit this player from the tournament?`)) {
      return;
    }

    setForfeitingPlayerId(registrationId);
    try {
      await forfeitMutation.mutateAsync({
        tournamentId: Number(tournamentId),
        registrationId: registrationId
      });

      refetch();
      onPlayerRemoved?.();
    } catch (error) {
      console.error("Error forfeiting player:", error);
      alert("Failed to forfeit player. Please try again.");
    } finally {
      setForfeitingPlayerId(null);
    }
  };

  const exportDataCSV = (data?: RegisteredPlayer[]) => {
    if (!data) return;
    const headers = ['email', 'name', 'countryCode', 'rating', 'registeredAt', 'userId'];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + data.map((d: any) => headers.map((h: any) => d[h]).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tournament_${tournamentId}.csv`);
    document.body.appendChild(link);
    link.click();
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

  return (
    <PlayersContainer>
      <PlayersHeader>
        <HeaderFlex>
          <StyledLabel>Registered Players ({players?.length || 0})</StyledLabel>
          {isAdmin && <Button onClick={() => exportDataCSV(players)}>Export CSV</Button>}
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
                <PlayerName>{player.name}</PlayerName>
                <PlayerEmail>{player.email}</PlayerEmail>
              </PlayerInfo>

              {isAdmin && (
                <PlayerActionsContainer>
                  {showForfeitButton ? (
                    <ForfeitButton
                      disabled={forfeitingPlayerId === player.registrationId || player.status === 'forfeited'}
                      onClick={() => handleForfeitPlayer(player.registrationId, tournamentId)}
                    >
                      {forfeitingPlayerId === player.registrationId ? "Forfeiting..." : "Forfeit"}
                    </ForfeitButton>
                  ) : (
                    <RemoveButton
                      disabled={removingPlayerId === player.registrationId}
                      onClick={() => handleRemovePlayer(player.registrationId, tournamentId)}
                    >
                      {removingPlayerId === player.registrationId ? "Removing..." : "Remove"}
                    </RemoveButton>
                  )}
                </PlayerActionsContainer>
              )}
            </PlayerRow>
          ))}
        </PlayersListContainer>
      )}
    </PlayersContainer>
  );
};

export default TournamentPlayersList;