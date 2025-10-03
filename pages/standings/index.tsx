import { Flex } from "components/Atoms";
import useFetchInitialData from "hooks/useFetchInitialData";
import { styled } from "stitches.config";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";

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

const Standings = () => {
  const {
    data: standings,
    isLoading,
    error,
  } = useFetchInitialData<Player[]>({ url: "/api/standings?id=313&division=TORUN" });
  if (!standings) return null;

  console.log("standings", standings);
  const grouped = standings.reduce<Record<string, Player[]>>((acc, player) => {
    if (!acc[player.standingName]) acc[player.standingName] = [];
    acc[player.standingName].push(player);
    return acc;
  }, {});

  return (
    <Flex css={{ flexDirection: "row", flexWrap: "wrap", gap: "16px", padding: "8px" }}>
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
                      <FlagIcon code={player.tldCode} />
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
  );
};

export default Standings;
