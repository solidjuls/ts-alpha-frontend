import Link from "next/link";
import Text from "components/Text";
import { useState, useMemo } from "react";
import { useTournaments } from "hooks/useTournaments";
import { useForfeitedPlayers } from "hooks/useUsers";
import { Spinner } from "@radix-ui/themes";
import DropdownMenu from "components/DropdownMenu";
import { Button } from "components/Button";
import ProtectedRoute from "components/ProtectedRoute";
import { userRoles } from "utils/constants";
import { Tournament } from "services/tournaments.service";
import {
  PageContainer,
  PageHeader,
  Title,
  TableScroll,
  StyledTable,
  StyledHeading,
  StyledHeaderCell,
  StyledHeaderCellCentered,
  StyledRow,
  StyledCell,
  PlayerCell,
  StatCell,
  LoadingOverlay,
  StandingGroup,
} from "styles/standings.styled";

const Forfeits = () => {
  const [tournamentId, setTournamentId] = useState<string>("");

  const { data: tournaments, isLoading: isLoadingTournaments } = useTournaments({ status: "4,5" });
  const { data: forfeitedPlayers, isLoading: isLoadingPlayers } = useForfeitedPlayers(tournamentId || undefined);

  const tournamentOptions = (tournaments as Tournament[] || []).map((t) => ({
    value: t.id.toString(),
    text: t.tournament_name,
  }));

  const selectedTournamentName = tournamentOptions.find((t) => t.value === tournamentId)?.text;

  const sortedPlayers = useMemo(() => {
    if (!forfeitedPlayers) return [];
    return [...forfeitedPlayers].sort((a, b) => b.totalForfeits - a.totalForfeits);
  }, [forfeitedPlayers]);

  return (
    <PageContainer>
      <PageHeader>
        <Title>Forfeits</Title>

        <DropdownMenu
          items={tournamentOptions}
          selectedItem={tournamentId}
          onSelect={(value) => setTournamentId(value)}
          placeholder="All tournaments"
          width="300px"
        />

        {tournamentId && (
          <Button onClick={() => setTournamentId("")}>Clear filter</Button>
        )}
      </PageHeader>

      <StandingGroup style={{ position: "relative" }}>
        <LoadingOverlay $isVisible={isLoadingPlayers}>
          <Spinner size="3" />
        </LoadingOverlay>

        {selectedTournamentName && (
          <div style={{ padding: "10px 12px", background: "var(--usa)", color: "var(--alt-text)" }}>
            <h3 style={{ margin: 0 }}>{selectedTournamentName}</h3>
          </div>
        )}

        <TableScroll>
          <StyledTable style={{ maxWidth: "100%" }}>
            <StyledHeading>
              <tr>
                <StyledHeaderCell>Player</StyledHeaderCell>
                <StyledHeaderCellCentered>Total Forfeits</StyledHeaderCellCentered>
                <StyledHeaderCell>Tournaments</StyledHeaderCell>
              </tr>
            </StyledHeading>
            <tbody>
              {sortedPlayers.length > 0 ? (
                sortedPlayers.map((player) => (
                  <StyledRow key={player.id}>
                    <PlayerCell>
                      <Link className="playerName" fontSize="small" href={`/userprofile/${player.id}`} target="_blank">{player.name}</Link>
                    </PlayerCell>
                    <StatCell>
                      <Text fontSize="small">{player.totalForfeits}</Text>
                    </StatCell>
                    <StyledCell>
                      <Text fontSize="small">{player.tournamentNames}</Text>
                    </StyledCell>
                  </StyledRow>
                ))
              ) : (
                !isLoadingPlayers && (
                  <StyledRow>
                    <StyledCell colSpan={3}>
                      <Text fontSize="small">No forfeited players found.</Text>
                    </StyledCell>
                  </StyledRow>
                )
              )}
            </tbody>
          </StyledTable>
        </TableScroll>
      </StandingGroup>
    </PageContainer>
  );
};

const ForfeitsPage = () => (
  <ProtectedRoute requiredRole={userRoles.SUPERADMIN}>
    <Forfeits />
  </ProtectedRoute>
);

export default ForfeitsPage;
