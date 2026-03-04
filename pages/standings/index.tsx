import Link from "next/link";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import { useState } from "react";
import { useStandings, PlayerStanding } from "hooks/useStandings";
import { Spinner } from "@radix-ui/themes";
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
import Playoffs from "components/Playoffs";
import { Player } from "components/Playoffs/Playoffs";

type Division = "TORUN" | "SEATTLE";

const MOCK_PLAYERS: Player[] = Array.from({ length: 38 }, (_, i) => ({
  userId: `u-${i + 1}`,
  fullName: `Player ${i + 1}`,
  playoffSquare: `sq-${i + 1}`, // Initial assignment
  playoffName: i < 32 ? "Round 1" : "Waitlist/Qualifiers",
}));

const Standings = () => {
  const [selectedDivision, setSelectedDivision] = useState<Division>("TORUN");

  const { data: standings, isFetching, error } = useStandings({
    tournamentId: "318",
    division: selectedDivision,
  });

  if (error) return <ErrorBox>Error Loading Standings</ErrorBox>;

  const grouped = standings?.reduce<Record<string, PlayerStanding[]>>((acc, player) => {
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

  return <Playoffs initialPlayers={MOCK_PLAYERS}/>;
  // return (
  //   <PageContainer>
  //     <PageHeader>
  //       <Title>Standings</Title>

  //       <TabContainer>
  //         <TabButton $active={selectedDivision === "TORUN"} onClick={() => setSelectedDivision("TORUN")}>
  //           TORUN
  //         </TabButton>
  //         <TabButton $active={selectedDivision === "SEATTLE"} onClick={() => setSelectedDivision("SEATTLE")}>
  //           SEATTLE
  //         </TabButton>
  //       </TabContainer>
  //     </PageHeader>

  //     <StandingsContainer>
  //       <LoadingOverlay $isVisible={isFetching}>
  //         <Spinner size="3" />
  //       </LoadingOverlay>

  //       {grouped &&
  //         Object.entries(grouped).map(([standingName, players]) => (
  //           <StandingGroup key={standingName}>
  //             <StandingTitleBar>
  //               <StandingTitle>{standingName}</StandingTitle>
  //             </StandingTitleBar>

  //             <TableScroll>
  //               <StyledTable>
  //                 <StyledHeading>
  //                   <tr>
  //                     <StyledHeaderCellCentered>Rank</StyledHeaderCellCentered>
  //                     <StyledHeaderCell>Player</StyledHeaderCell>
  //                     <StyledHeaderCellCentered>W-L-T</StyledHeaderCellCentered>
  //                     <StyledHeaderCellCentered>Win%</StyledHeaderCellCentered>
  //                     <StyledHeaderCellCentered>SoS</StyledHeaderCellCentered>
  //                   </tr>
  //                 </StyledHeading>

  //                 <tbody>
  //                   {players.map((player, index) => (
  //                     <StyledRow key={player.userId}>
  //                       <RankCell>
  //                         <Text fontSize="small">{index + 1}</Text>
  //                       </RankCell>

  //                       <PlayerCell>
  //                         <PlayerInfoContainer>
  //                           {player.tldCode && <FlagIcon code={player.tldCode} />}
  //                           <Link className="playerName" fontSize="small" href={`/userprofile/${player.userId}`}>{player.name}</Link>
  //                         </PlayerInfoContainer>
  //                       </PlayerCell>

  //                       <StatCell>
  //                         <Text fontSize="small">
  //                           {player.gamesWon}-{player.gamesLost}-{player.gamesTied}
  //                         </Text>
  //                       </StatCell>

  //                       <StatCell>
  //                         <Text fontSize="small">{`${(player.winRate * 100).toFixed(0)}%`}</Text>
  //                       </StatCell>

  //                       <StatCell>
  //                         <Text fontSize="small">{`${(player.sos * 100).toFixed(0)}%`}</Text>
  //                       </StatCell>
  //                     </StyledRow>
  //                   ))}
  //                 </tbody>
  //               </StyledTable>
  //             </TableScroll>
  //           </StandingGroup>
  //         ))}
  //     </StandingsContainer>
  //   </PageContainer>
  // );
};

export default Standings;
