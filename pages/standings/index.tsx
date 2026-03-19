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

const MOCK_PLAYERS: Player[] = [
  { "userId": 2439, "fullName": "Michal Borkowicz", "seed": 1, "playoffSquare": undefined },
  { "userId": 3064, "fullName": "Robin Bos", "seed": 2, "playoffSquare": undefined },
  { "userId": 1597, "fullName": "Andrea Ciappi", "seed": 3, "playoffSquare": undefined },
  { "userId": 2971, "fullName": "Markel Elortza", "seed": 4, "playoffSquare": undefined },
  { "userId": 2623, "fullName": "Roger Erill", "seed": 5, "playoffSquare": undefined },
  { "userId": 2082, "fullName": "Jarek Grzaslewicz", "seed": 6, "playoffSquare": undefined },
  { "userId": 1921, "fullName": "Firat Guncu", "seed": 7, "playoffSquare": undefined },
  { "userId": 2393, "fullName": "Mathias Heinze", "seed": 8, "playoffSquare": undefined },
  { "userId": 1974, "fullName": "Giorgos Iosifidis", "seed": 9, "playoffSquare": undefined },
  { "userId": 2682, "fullName": "Serhei Isaenka", "seed": 10, "playoffSquare": undefined },
  { "userId": 2537, "fullName": "Paweł Januszewski", "seed": 11, "playoffSquare": undefined },
  { "userId": 1853, "fullName": "Dimitris Katsoulas", "seed": 12, "playoffSquare": undefined },
  { "userId": 2508, "fullName": "Onur Kulaksizoglu", "seed": 13, "playoffSquare": undefined },
  { "userId": 2621, "fullName": "Rodrigo Laso", "seed": 14, "playoffSquare": undefined },
  { "userId": 2784, "fullName": "Tomasz Łaniewski", "seed": 15, "playoffSquare": undefined },
  { "userId": 2256, "fullName": "Katsiaryna Makouskaya", "seed": 16, "playoffSquare": undefined },
  { "userId": 1600, "fullName": "Andrea Mancuso", "seed": 17, "playoffSquare": undefined },
  { "userId": 2606, "fullName": "Ricki McLaughlin", "seed": 18, "playoffSquare": undefined },
  { "userId": 2878, "fullName": "Ziemowit Pazderski", "seed": 19, "playoffSquare": undefined },
  { "userId": 2074, "fullName": "Jan Schmidt", "seed": 20, "playoffSquare": undefined },
  { "userId": 1635, "fullName": "Arek Sitkowski", "seed": 21, "playoffSquare": undefined },
  { "userId": 2983, "fullName": "Pawel Sokol", "seed": 22, "playoffSquare": undefined },
  { "userId": 3100, "fullName": "Balazs Ulveczki", "seed": 23, "playoffSquare": undefined },
  { "userId": 2012, "fullName": "Hicham Vanborm", "seed": 24, "playoffSquare": undefined },
  { "userId": 1634, "fullName": "Aran Warszawski", "seed": 25, "playoffSquare": undefined },
  { "userId": 2962, "fullName": "Jakub Węcławski", "seed": 26, "playoffSquare": undefined },
  { "userId": 1658, "fullName": "Bartosz Wróbel", "seed": 27, "playoffSquare": undefined },
  { "userId": 2886, "fullName": "Weiran Xie", "seed": 28, "playoffSquare": undefined },
  { "userId": 3084, "fullName": "Zhuang Yan", "seed": 29, "playoffSquare": undefined },
  { "userId": 1838, "fullName": "Delun Zhang", "seed": 30, "playoffSquare": undefined }
]

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
