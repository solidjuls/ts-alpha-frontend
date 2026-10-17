import Link from "next/link";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import { useState, useMemo } from "react";
import { useStandings, PlayerStanding } from "hooks/useStandings";
import { useAuth } from "contexts/AuthProviderNew";
import { userRoles } from "utils/constants";
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
  const { user } = useAuth();
  const isSuperAdmin = user?.role === userRoles.SUPERADMIN;
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
    grouped[key].sort((a, b) => a.standingOrder - b.standingOrder);
  }

  // retrieve the first player of each grouped[key]
  const firstPlayers = grouped && Object.values(grouped).map((group) => group[0]);

  // Build playoffs players per division
  const playoffsByDivision = useMemo(() => {
    if (!standings || divisions.length === 0) return {};
    const result: Record<string, PlayerStanding[]> = {};
    for (const division of divisions) {
      const divisionPlayers = standings.filter((p) => p.secondaryName === division);
      const divisionGrouped = divisionPlayers.reduce<Record<string, PlayerStanding[]>>((acc, player) => {
        if (!acc[player.standingName]) acc[player.standingName] = [];
        acc[player.standingName].push(player);
        return acc;
      }, {});
      for (const key in divisionGrouped) {
        divisionGrouped[key].sort((a, b) => a.standingOrder - b.standingOrder);
      }
      const divisionFirstPlayers = Object.values(divisionGrouped).map((group) => group[0]);
      const divisionPlayoffs = divisionFirstPlayers
        .concat(divisionPlayers.filter((player) => !divisionFirstPlayers.includes(player)))
        .sort((a, b) => a.playoffOrder - b.playoffOrder);
      result[division] = divisionPlayoffs;
    }
    console.log('Playoff order:', Object.entries(result).flatMap(([division, players]) =>
      players.map((p) => ({ division, name: p.name, sos: p.sos, playoffOrder: p.playoffOrder }))
    ));
    return result;
  }, [standings, divisions]);

  // forfeit players: standingName === 'Forfeit' AND secondaryName === 'Forfeit'
  const forfeitPlayers = standings
    ?.filter((player) => player.standingName === 'Forfeit' && player.secondaryName === 'Forfeit')
    .sort((a, b) => a.standingOrder - b.standingOrder);

  const getPlayoffColorTables = (index: number, playoffOrder: number) => {
    if (index === 0) return 'green';
    if (playoffOrder <= 31) return 'blue';

    return undefined;
  };

  const getPlayoffColorRoad = (index: number, playoffOrder: number) => {
    if (index >= 0 && index <= 7) return 'green';
    if (index > 7 && playoffOrder <= 31) return 'blue';
    if (playoffOrder > 31 && playoffOrder <= 67) return 'orange';
    return undefined;
  };

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
                      <StyledRow key={player.userId} $playoffColor={getPlayoffColorTables(index, player.playoffOrder)}>
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
      {grouped &&
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h2>Road to playoffs</h2>
            {divisions.map((division) => {
              const players = playoffsByDivision[division];
              if (!players || players.length === 0) return null;
              return (
                <div key={division} style={{ marginBottom: '24px' }}>
                  <h3 style={{ marginBottom: '8px' }}>{division}</h3>
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
                          <StyledRow key={player.userId} $playoffColor={getPlayoffColorRoad(index, player.playoffOrder)}>
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
                </div>
              );
            })}
          </div>

          {isSuperAdmin && forfeitPlayers && forfeitPlayers.length > 0 && (
            <div style={{ flex: 1 }}>
              <h2>Forfeits</h2>
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
                    {forfeitPlayers.map((player, index) => (
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
            </div>
          )}
        </div>
      }
    </PageContainer>
  );
};

export default Standings;
