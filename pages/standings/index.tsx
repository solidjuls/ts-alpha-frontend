import { Flex } from "components/Atoms";
import useFetchInitialData from "hooks/useFetchInitialData";
import { styled } from "stitches.config";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import { useState, useEffect } from "react";

const headerColor = {
    backgroundColor: 'rgb(28, 69, 135)',
    color: 'white'
}

type Player = {
  userId: string;
  name: string;
  secondaryName?: string;
  standingName: string;
  tldCode: string;
  gamesWon: number;
  gamesLost: number;
  gamesTied: number;
};

const PageHeader = styled('h1', {
  textAlign: "center", borderBottom: "solid 1px $greyLight" 
})
const StyledTable = styled("table", {
  width: "260px",
  borderCollapse: "collapse",
  marginBottom: "8px",
  //border: "solid 1px black",
});

const StyledHeading = styled("thead", {
  fontWeight: "bold",
  ...headerColor
});

const StyledHeaderCell = styled("th", {
  fontSize: "12px",
  textAlign: "left",
  padding: "0 0 0 4px",
  borderBottom: "solid 1px black",
  borderLeft: "solid 1px black",
});

const StyledCell = styled("td", {
  padding: "0 0 0 4px",
  border: "solid 1px black",
});

const TabContainer = styled("div", {
  display: "flex",
  marginBottom: "16px",
  borderRadius: "8px",
  overflow: "hidden",
  border: "1px solid #ccc",
  width: "fit-content",
});

const TabButton = styled("button", {
  padding: "12px 24px",
  border: "none",
  backgroundColor: "#f5f5f5",
  color: "#666",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  transition: "all 0.2s ease",
  outline: "none",

  "&:hover": {
    backgroundColor: "#e0e0e0",
  },

  variants: {
    active: {
      true: {
        backgroundColor: "rgb(28, 69, 135)",
        color: "white",
        "&:hover": {
          backgroundColor: "rgb(28, 69, 135)",
        },
      },
    },
  },
});

type Division = "TORUN" | "SEATTLE";

const Standings = () => {
  const [selectedDivision, setSelectedDivision] = useState<Division>("TORUN");

  const {
    data: standings,
    isLoading,
    error,
    refetch,
  } = useFetchInitialData<Player[]>({
    url: `/api/standings?id=318&division=${selectedDivision}`
  });

  const handleDivisionChange = (division: Division) => {
    setSelectedDivision(division);
  };

  // Refetch data when division changes
  useEffect(() => {
    refetch();
  }, [selectedDivision, refetch]);

  if (!standings) return null;


  const grouped = standings.reduce<Record<string, Player[]>>((acc, player) => {
    if (!acc[player.standingName]) acc[player.standingName] = [];
    acc[player.standingName].push(player);
    return acc;
  }, {});

  return (
    <Flex css={{ flexDirection: "column", padding: "8px" }}>
      {/* Division Filter Tabs */}
      <PageHeader>Standings</PageHeader>
      <TabContainer>
        <TabButton
          active={selectedDivision === "TORUN"}
          onClick={() => handleDivisionChange("TORUN")}
        >
          TORUN
        </TabButton>
        <TabButton
          active={selectedDivision === "SEATTLE"}
          onClick={() => handleDivisionChange("SEATTLE")}
        >
          SEATTLE
        </TabButton>
      </TabContainer>

      {/* Standings Tables */}
      <Flex css={{ flexDirection: "row", flexWrap: "wrap", gap: "16px" }}>
        {Object.entries(grouped).map(([standingName, players]) => (
        <Flex key={standingName} css={{ flexDirection: "column", borderRadius: "8px", padding: "8px" }}>
          <Text
            strong="bold"
            css={{
                ...headerColor,
              // borderLeft: "1px solid black",
              margin: 0,
              textAlign: "center"
            }}
          >
            {standingName}
          </Text>
          <StyledTable>
            <StyledHeading>
              <tr>
                <StyledHeaderCell css={{ paddingLeft: '40px'}}>Player Name</StyledHeaderCell>
                <StyledHeaderCell>W-L-T</StyledHeaderCell>
              </tr>
            </StyledHeading>
            <tbody>
              {players.map((player) => (
                <tr key={player.userId}>
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
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </Flex>
      ))}
      </Flex>
    </Flex>
  );
};

export default Standings;
