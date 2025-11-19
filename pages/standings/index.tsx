import styled from "styled-components";
import useFetchInitialData from "hooks/useFetchInitialData";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import { useState, useEffect } from "react";

const headerColor = {
  backgroundColor: "rgb(28, 69, 135)",
  color: "white",
};

const headerForfeitColor = {
  backgroundColor: "red",
  color: "white",
};

type Player = {
  userId: string;
  name: string;
  secondaryName?: string;
  standingName: string;
  tldCode: string;
  gamesWon: number;
  gamesLost: number;
  gamesTied: number;
  winRate: number;
  sos: number;
};

const PageHeader = styled("h1", {
  textAlign: "center",
  borderBottom: "solid 1px $greyLight",
});
const StyledTable = styled("table", {
  borderCollapse: "collapse",
  marginBottom: "8px",
});

const StyledHeading = styled("thead", {
  fontWeight: "bold",
  ...headerColor,
});

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
  const [selectedDivision, setSelectedDivision] = useState<Division>("SEATTLE");

  const {
    data: standings,
    refetch,
  } = useFetchInitialData<Player[]>({
    url: `/api/standings?id=318&division=${selectedDivision}`,
  });
  const handleDivisionChange = (division: Division) => {
    setSelectedDivision(division);
  };

  // Refetch data when division changes
  useEffect(() => {
    refetch();
  }, [selectedDivision]);

  if (!standings) return null;

  const grouped = standings.reduce<Record<string, Player[]>>((acc, player) => {
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
// grouped["Forfeit"];

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
      <Flex css={{ flexDirection: "row", flexWrap: "wrap", gap: "16px" }}>
        {Object.entries(grouped).map(([standingName, players]) => {
          if (standingName === "Forfeit") return null;

          return (
            <Flex
              key={standingName}
              css={{ flexDirection: "column", borderRadius: "8px", padding: "8px" }}
            >
              <Text
                strong="bold"
                css={{
                  ...headerColor,
                  // borderLeft: "1px solid black",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                {standingName}
              </Text>
              <StyledTable>
                <StyledHeading>
                  <tr>
                    <StyledHeaderCell css={{ width: "40px" }}>Rank</StyledHeaderCell>
                    <StyledHeaderCell css={{ paddingLeft: "40px", width: "200px" }}>
                      Player Name
                    </StyledHeaderCell>
                    <StyledHeaderCell>W-L-T</StyledHeaderCell>
                    <StyledHeaderCell>Win%</StyledHeaderCell>
                    <StyledHeaderCell>SoS</StyledHeaderCell>
                  </tr>
                </StyledHeading>
                <tbody>
                  {players.map((player, index) => (
                    <tr key={player.userId}>
                      <StyledCell css={{ borderLeft: "solid 1px black" }}>
                        <Text fontSize="small" css={{ textAlign: "center" }}>
                          {index + 1}
                        </Text>
                      </StyledCell>
                      <StyledCell>
                        <Flex css={{ alignItems: "center", gap: "4px" }}>
                          {player.tldCode && <FlagIcon code={player.tldCode} />}
                          <Text fontSize="small">{player.name}</Text>
                        </Flex>
                      </StyledCell>
                      <StyledCell css={{ borderLeft: "solid 1px black", width: "50px" }}>
                        <Text fontSize="small">
                          {player.gamesWon}-{player.gamesLost}-{player.gamesTied}
                        </Text>
                      </StyledCell>
                      <StyledCell css={{ borderLeft: "solid 1px black", width: "50px" }}>
                        <Text fontSize="small" css={{ textAlign: "center" }}>
                          {`${(player.winRate * 100).toFixed(0)}%`}
                        </Text>
                      </StyledCell>
                      <StyledCell css={{ borderLeft: "solid 1px black", width: "50px" }}>
                        <Text fontSize="small" css={{ textAlign: "center" }}>
                          {`${(player.sos * 100).toFixed(0)}%`}
                        </Text>
                      </StyledCell>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default Standings;
