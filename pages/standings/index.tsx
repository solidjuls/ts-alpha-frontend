import Link from "next/link";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import { useState, useMemo } from "react";
import { useStandings, PlayerStanding } from "hooks/useStandings";
import { Spinner } from "@radix-ui/themes";
import DropdownMenu from "components/DropdownMenu";
import {
  PageContainer,
  PageHeader,
  Title,
  TabContainer,
  TabButton,
  StandingsContainer,
  StandingGroup,
  StandingTitle,
  StandingTitleBar,
  LoadingOverlay,
  TableScroll,
  StyledTable,
  StyledHeaderCell,
  StyledHeading,
  StyledRow,
  RankCell,
  PlayerCell,
  PlayerInfoContainer,
  StatCell,
  StyledHeaderCellCentered,
  ErrorBox
 } from "styles/standings.styled";

const tournamentOptions = [
  { value: "318", text: "ITSL - Season 15" },
  { value: "359", text: "ITSL - Season 16" },
];

const Standings = () => {
  const [tournamentId, setTournamentId] = useState("359");
  const [selectedDivision, setSelectedDivision] = useState<string>("");

  const { data: standings, isFetching, error } = useStandings({
    tournamentId,
  });

  const divisions = useMemo(() => {
    if (!standings) return [];
    const unique = [...new Set(standings.map((p) => p.secondaryName).filter(Boolean))] as string[];
    return unique;
  }, [standings]);

  const activeDivision = selectedDivision && divisions.includes(selectedDivision)
    ? selectedDivision
    : divisions[0] || "";

  const filteredStandings = activeDivision
    ? standings?.filter((p) => p.secondaryName === activeDivision)
    : standings;

  const grouped = filteredStandings?.reduce<Record<string, PlayerStanding[]>>((acc, player) => {
    if (!acc[player.standingName]) acc[player.standingName] = [];
    acc[player.standingName].push(player);
    return acc;
  }, {});

  for (const key in grouped) {
    grouped[key].sort((a, b) => {
      if (b.winRate !== a.winRate) return b.winRate - a.winRate;
      return b.sos - a.sos;
    });
  }

  return (
    <PageContainer>
      <PageHeader>
        <Title>Standings</Title>

        <DropdownMenu
          items={tournamentOptions}
          selectedItem={tournamentId}
          onSelect={(value) => {
            setTournamentId(value);
            setSelectedDivision("");
          }}
          width="250px"
        />

        {divisions.length > 0 && (
          <TabContainer>
            {divisions.map((division) => (
              <TabButton
                key={division}
                $active={activeDivision === division}
                onClick={() => setSelectedDivision(division)}
              >
                {division}
              </TabButton>
            ))}
          </TabContainer>
        )}
      </PageHeader>

      <StandingsContainer>
        <LoadingOverlay $isVisible={isFetching}>
          <Spinner size="3" />
        </LoadingOverlay>

        {grouped &&
          Object.entries(grouped).map(([standingName, players]) => (
            <StandingGroup key={standingName}>
              <StandingTitleBar>
                <StandingTitle>{standingName}</StandingTitle>
              </StandingTitleBar>

              <TableScroll>
                <StyledTable>
                  <StyledHeading>
                    <tr>
                      <StyledHeaderCellCentered>Rank</StyledHeaderCellCentered>
                      <StyledHeaderCell>Player</StyledHeaderCell>
                      <StyledHeaderCellCentered>W-L-T</StyledHeaderCellCentered>
                      <StyledHeaderCellCentered>Win%</StyledHeaderCellCentered>
                      <StyledHeaderCellCentered>SoS</StyledHeaderCellCentered>
                    </tr>
                  </StyledHeading>

                  <tbody>
                    {players.map((player, index) => (
                      <StyledRow key={player.userId}>
                        <RankCell>
                          <Text fontSize="small">{index + 1}</Text>
                        </RankCell>

                        <PlayerCell>
                          <PlayerInfoContainer>
                            {player.tldCode && <FlagIcon code={player.tldCode} />}
                            <Link className="playerName" fontSize="small" href={`/userprofile/${player.userId}`}>{player.name}</Link>
                          </PlayerInfoContainer>
                        </PlayerCell>

                        <StatCell>
                          <Text fontSize="small">
                            {player.gamesWon}-{player.gamesLost}-{player.gamesTied}
                          </Text>
                        </StatCell>

                        <StatCell>
                          <Text fontSize="small">{`${(player.winRate * 100).toFixed(0)}%`}</Text>
                        </StatCell>

                        <StatCell>
                          <Text fontSize="small">{`${(player.sos * 100).toFixed(0)}%`}</Text>
                        </StatCell>
                      </StyledRow>
                    ))}
                  </tbody>
                </StyledTable>
              </TableScroll>
            </StandingGroup>
          ))}
      </StandingsContainer>
    </PageContainer>
  );
};

export default Standings;
