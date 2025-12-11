import styled from "styled-components";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import { useState } from "react";
import { useStandings, PlayerStanding } from "hooks/useStandings";

// Using PlayerStanding type from the hook

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
`;

const PageHeader = styled.h1`
  text-align: center;
  border-bottom: solid 1px #e5e7eb;
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  margin-bottom: 8px;
`;

const StyledHeading = styled.thead`
  font-weight: bold;
  background-color: rgb(28, 69, 135);
  color: white;
`;

const StyledHeaderCell = styled.th`
  font-size: 12px;
  text-align: left;
  padding: 0 0 0 4px;
  border-bottom: solid 1px black;
  border-left: solid 1px black;
`;

const StyledCell = styled.td`
  padding: 0 0 0 4px;
  border: solid 1px black;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ccc;
  width: fit-content;
`;

interface TabButtonProps {
  $active?: boolean;
}

const TabButton = styled.button<TabButtonProps>`
  padding: 12px 24px;
  border: none;
  background-color: ${props => props.$active ? 'rgb(28, 69, 135)' : '#f5f5f5'};
  color: ${props => props.$active ? 'white' : '#666'};
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  outline: none;

  &:hover {
    background-color: ${props => props.$active ? 'rgb(28, 69, 135)' : '#e0e0e0'};
  }
`;

const StandingsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
`;

const StandingGroup = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 8px;
`;

const StandingTitle = styled(Text)`
  background-color: rgb(28, 69, 135);
  color: white;
  margin: 0;
  text-align: center;
`;

const PlayerRow = styled.tr``;

const RankCell = styled(StyledCell)`
  border-left: solid 1px black;
`;

const PlayerInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StatCell = styled(StyledCell)`
  border-left: solid 1px black;
  width: 50px;
`;

const WideRankCell = styled(RankCell)`
  width: 40px;
`;

const WidePlayerCell = styled(StyledCell)`
  padding-left: 40px;
  width: 200px;
`;

type Division = "TORUN" | "SEATTLE";

const Standings = () => {
  const [selectedDivision, setSelectedDivision] = useState<Division>("TORUN");

  const {
    data: standings,
    isLoading,
    error,
  } = useStandings({
    tournamentId: "3",
    division: selectedDivision
  });

  const handleDivisionChange = (division: Division) => {
    setSelectedDivision(division);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading standings</div>;
  if (!standings) return null;

  const grouped = standings.reduce<Record<string, PlayerStanding[]>>((acc, player) => {
    if (!acc[player.standingName]) acc[player.standingName] = [];
    acc[player.standingName].push(player);
    return acc;
  }, {});

  for (const key in grouped) {
    grouped[key].sort((a, b) => {
      if (b.winRate !== a.winRate) {
        return b.winRate - a.winRate;
      }
      return b.sos - a.sos;
    });
  }

  return (
    <PageContainer>
      {/* Division Filter Tabs */}
      <PageHeader>Standings</PageHeader>
      <TabContainer>
        <TabButton
          $active={selectedDivision === "TORUN"}
          onClick={() => handleDivisionChange("TORUN")}
        >
          TORUN
        </TabButton>
        <TabButton
          $active={selectedDivision === "SEATTLE"}
          onClick={() => handleDivisionChange("SEATTLE")}
        >
          SEATTLE
        </TabButton>
      </TabContainer>

      {/* Standings Tables */}
      <StandingsContainer>
        {Object.entries(grouped).map(([standingName, players]) => (
        <StandingGroup key={standingName}>
          <StandingTitle strong="bold">
            {standingName}
          </StandingTitle>
          <StyledTable>
            <StyledHeading>
              <tr>
                <WideRankCell as="th">Rank</WideRankCell>
                <WidePlayerCell as="th">Player Name</WidePlayerCell>
                <StyledHeaderCell>W-L-T</StyledHeaderCell>
                <StyledHeaderCell>Win%</StyledHeaderCell>
                <StyledHeaderCell>SoS</StyledHeaderCell>
              </tr>
            </StyledHeading>
            <tbody>
              {players.map((player, index) => (
                <PlayerRow key={player.userId}>
                  <RankCell>
                    <Text fontSize="small" style={{ textAlign: "center" }}>
                      {index+1}
                    </Text>
                  </RankCell>
                  <StyledCell>
                    <PlayerInfoContainer>
                      {player.tldCode && <FlagIcon code={player.tldCode} />}
                      <Text fontSize="small">{player.name}</Text>
                    </PlayerInfoContainer>
                  </StyledCell>
                  <StatCell>
                    <Text fontSize="small">
                      {player.gamesWon}-{player.gamesLost}-{player.gamesTied}
                    </Text>
                  </StatCell>
                  <StatCell>
                    <Text fontSize="small" style={{ textAlign: "center" }}>
                      {`${(player.winRate*100).toFixed(0)}%`}
                    </Text>
                  </StatCell>
                  <StatCell>
                    <Text fontSize="small" style={{ textAlign: "center" }}>
                      {`${(player.sos*100).toFixed(0)}%`}
                    </Text>
                  </StatCell>
                </PlayerRow>
              ))}
            </tbody>
          </StyledTable>
        </StandingGroup>
      ))}
      </StandingsContainer>
    </PageContainer>
  );
};

export default Standings;