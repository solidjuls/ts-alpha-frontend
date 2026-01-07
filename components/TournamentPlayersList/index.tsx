import { useState } from "react";
import { useRegisteredPlayers, useUnregisterFromTournament, useForfeitPlayer } from "hooks/useTournaments";
import { RegisteredPlayer } from "services/tournaments.service";
import { 
  PlayersCard,
  CardHeader,
  HeaderLeft,
  HeaderButton,
  HeaderTitle,
  HeaderSub,
  Body,
  LoadingOrEmpty,
  ResponsiveRow,
  PlayerInfo,
  PlayerName,
  PlayerEmail,
  RightSide,
  WarnButton,
  DangerButton
 } from "./TournamentPlayersList.styled";

interface TournamentPlayersListProps {
  tournamentId: string;
  tournamentStatusId?: number;
  onPlayerRemoved?: () => void;
  isAdmin?: boolean;
}

const TournamentPlayersList = ({
  tournamentId,
  tournamentStatusId,
  onPlayerRemoved,
  isAdmin = false,
}: TournamentPlayersListProps) => {
  const [removingPlayerId, setRemovingPlayerId] = useState<number | null>(null);
  const [forfeitingPlayerId, setForfeitingPlayerId] = useState<number | null>(null);

  const { data: players, isLoading, refetch } = useRegisteredPlayers(parseInt(tournamentId));
  const unregisterMutation = useUnregisterFromTournament();
  const forfeitMutation = useForfeitPlayer();

  // Show Forfeit button when tournament status is 4 (started)
  const showForfeitButton = tournamentStatusId === 4;

  const handleRemovePlayer = async (registrationId: number) => {
    if (!confirm("Are you sure you want to remove this player from the tournament?")) return;

    setRemovingPlayerId(registrationId);
    try {
      await unregisterMutation.mutateAsync({
        tournamentId: Number(tournamentId),
        registrationId,
      });
      await refetch();
      onPlayerRemoved?.();
    } catch (error) {
      console.error("Error removing player:", error);
      alert("Failed to remove player. Please try again.");
    } finally {
      setRemovingPlayerId(null);
    }
  };

  const handleForfeitPlayer = async (registrationId: number) => {
    if (!confirm("Are you sure you want to forfeit this player from the tournament?")) return;

    setForfeitingPlayerId(registrationId);
    try {
      await forfeitMutation.mutateAsync({
        tournamentId: Number(tournamentId),
        registrationId,
      });
      await refetch();
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
    const headers = [
      "email",
      "name",
      "countryCode",
      "rating",
      "phoneNumber",
      "playdekName",
      "registeredAt",
      "userId",
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      data.map((d: any) => headers.map((h: any) => d[h]).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tournament_${tournamentId}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <PlayersCard>
      <CardHeader>
        <HeaderLeft>
          <HeaderTitle>Registered Players</HeaderTitle>
          <HeaderSub>{players?.length || 0} total</HeaderSub>
        </HeaderLeft>

        {isAdmin && <HeaderButton onClick={() => exportDataCSV(players)}>Export CSV</HeaderButton>}
      </CardHeader>

      <Body>
        {isLoading ? (
          <LoadingOrEmpty>Loading players…</LoadingOrEmpty>
        ) : !players || players.length === 0 ? (
          <LoadingOrEmpty>No players registered yet.</LoadingOrEmpty>
        ) : (
          players.map((player) => (
            <ResponsiveRow key={player.registrationId}>
              <PlayerInfo>
                <PlayerName title={player.name}>{player.name}</PlayerName>
                <PlayerEmail title={player.email}>{player.email}</PlayerEmail>
              </PlayerInfo>

              <RightSide>


                {isAdmin &&
                  (showForfeitButton ? (
                    <WarnButton
                      disabled={
                        forfeitingPlayerId === player.registrationId ||
                        player.status === "forfeited"
                      }
                      onClick={() => handleForfeitPlayer(player.registrationId)}
                    >
                      {forfeitingPlayerId === player.registrationId ? "Forfeiting…" : "Forfeit"}
                    </WarnButton>
                  ) : (
                    <DangerButton
                      disabled={removingPlayerId === player.registrationId}
                      onClick={() => handleRemovePlayer(player.registrationId)}
                    >
                      {removingPlayerId === player.registrationId ? "Removing…" : "Remove"}
                    </DangerButton>
                  ))}
              </RightSide>
            </ResponsiveRow>
          ))
        )}
      </Body>
    </PlayersCard>
  );
};

export default TournamentPlayersList;
