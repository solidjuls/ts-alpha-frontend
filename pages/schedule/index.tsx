import "react-day-picker/lib/style.css";
import React, { useState } from "react";
import Head from "next/head";
import { Box, Flex } from "components/Atoms";
import { Spinner } from "@radix-ui/themes";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import { useAuth } from "contexts/AuthProviderNew";
import { DueDateDisplay } from "components/DueDateDisplay";
import { GameWinner } from "types/game.types";
import styled from "styled-components";
import ScheduleFilter from "../../components/Schedule/ScheduleFilter";
import { getWinnerText } from "utils/games";
import { Pagination } from "components/Pagination";
import { useSchedules } from "hooks/useSchedule";
import { ScheduleItem } from "services/schedule.service";
import { Tournament } from "services/tournaments.service";
import { userRoles } from "utils/constants";
import { MainLayout } from "components/Layout";
import ProtectedRoute from "components/ProtectedRoute";
import {
  PlayerInfo,
  ResultsStyleWrapper,
  DueDateCell,
  UnstyledLink,
  CheckOpponentProfileCell,
} from "components/Schedule/Schedule.styled";



interface ResponsiveContainerProps {
  direction?: "row" | "column";
}

const ResponsiveContainer = styled.div<ResponsiveContainerProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
`;

const FlexRow = styled(Flex)`
  display: flex;
  flex-direction: row;
`;

const PlayerInfoContainer = styled(Box)`
  display: flex;
  margin: 0 8px 0 8px;
  flex-direction: row;
  line-height: 1;
  align-items: center;
`;

const TournamentInfoFlex = styled(Flex)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 0 0 8px;
`;

const LoadingContainer = styled(Flex)`
  width: 100%;
`;

const CenteredResultsWrapper = styled(ResultsStyleWrapper)`
  justify-content: center;
  align-items: center;
`;

const TournamentText = styled(Text)`
  align-self: center;
  margin-left: 4px;
`;

const ColumnUnstyledLink = styled(UnstyledLink)`
  display: flex;
  flex-direction: column;
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

const generateQueryParams = ({
  id,
  idUsa,
  idUssr,
  tournamentId,
  gameCode,
}: {
  id: string;
  idUsa: string;
  idUssr: string;
  tournamentId: string;
  gameCode: string;
}) => {
  return `?id=${id}&idUsa=${idUsa}&idUssr=${idUssr}&tid=${tournamentId}&gameCode=${gameCode}`;
};

const resolveLink = ({
  gameResultsId,
  id,
  idUsa,
  idUssr,
  tournamentId,
  gameCode,
}: {
  gameResultsId: string | null;
  id: string;
  idUsa: string;
  idUssr: string;
  tournamentId: string;
  gameCode: string;
}) => {
  if (!gameResultsId)
    return `/submit-game${generateQueryParams({ id, idUsa, idUssr, tournamentId, gameCode })}`;

  return `/games/${gameResultsId}`;
};

const PlayerInfoBox = ({
  nameUsa,
  nameUssr,
  countryUsa,
  countryUssr,
  gameWinner,
}: Pick<ScheduleItem, "nameUsa" | "nameUssr" | "countryUsa" | "countryUssr" | "gameWinner">) => {
  return (
    <FlexRow>
      <PlayerInfoContainer>
        {countryUsa && <FlagIcon code={countryUsa} />}
        <Text
          fontSize="medium"
          strong={getWinnerText(gameWinner as GameWinner) === "USA" ? "bold" : undefined}
        >
          {nameUsa || "No player assigned"}
        </Text>
      </PlayerInfoContainer>
      <span>vs</span>
      <PlayerInfoContainer style={{ justifyContent: "space-between" }}>
        {countryUssr && <FlagIcon code={countryUssr} />}
        <Text
          fontSize="medium"
          strong={getWinnerText(gameWinner as GameWinner) === "USSR" ? "bold" : undefined}
        >
          {nameUssr || "No player assigned"}
        </Text>
      </PlayerInfoContainer>
    </FlexRow>
  );
};

const isDueInDays = (date: string): number => {
  const target = new Date(date).getTime();
  const now = Date.now();

  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
};

type VariantType = (
  schedule: ScheduleItem,
) => "played" | "duedate" | "default" | "firstAlert" | "secondAlert";

const getVariant: VariantType = (schedule) => {
  if (schedule.gameWinner && schedule.gameDate) {
    return "played";
  }

  const daysLeft = isDueInDays(schedule.dueDate);

  if (daysLeft <= 0) {
    return "duedate";
  } else if (daysLeft >= 1 && daysLeft <= 14) {
    return "secondAlert";
  } else if (daysLeft >= 15 && daysLeft <= 30) {
    return "firstAlert";
  }

  return "default";
};

const ScheduleRow = ({ schedule, isAdmin, userId }: { schedule: ScheduleItem; userId: string; isAdmin: boolean }) => {
  const opponentId = schedule.idUsa === userId ? schedule.idUssr : schedule.idUsa;
  return (
    <Flex>
      <PlayerInfo status={getVariant(schedule)}>
        <ColumnUnstyledLink
          href={resolveLink({
            gameResultsId: schedule.gameResultsId,
            id: schedule.id,
            idUsa: schedule.idUsa,
            idUssr: schedule.idUssr,
            tournamentId: schedule.tournamentId,
            gameCode: schedule.gameCode,
          })}
        >
          <TournamentInfoFlex>
            <TournamentText fontSize="small">
              {schedule.tournamentName}
            </TournamentText>
          </TournamentInfoFlex>

          <PlayerInfoBox
            gameWinner={schedule.gameWinner}
            countryUsa={schedule.countryUsa}
            countryUssr={schedule.countryUssr}
            nameUsa={schedule.nameUsa}
            nameUssr={schedule.nameUssr}
          />
        </ColumnUnstyledLink>
      </PlayerInfo>
      <CheckOpponentProfileCell>
        <UnstyledLink href={`/userprofile/${opponentId}`}>
          <Text fontSize="small">Opponent profile</Text>
        </UnstyledLink>
      </CheckOpponentProfileCell>
      <DueDateCell>
        <DueDateDisplay
          dueDate={schedule.dueDate}
          scheduleId={schedule.id}
          gameDate={schedule.gameDate || ""}
          admin={isAdmin}
          gamePlayed={false}
        />
      </DueDateCell>
    </Flex>
  );
};

const SchedulePanel = ({ 
  data, 
  isAdmin, 
  userId, 
  isLoading 
}: { 
  data: ScheduleItem[] | undefined; 
  userId: string; 
  isAdmin: boolean; 
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <LoadingContainer>
        <CenteredResultsWrapper>
          <Spinner />
        </CenteredResultsWrapper>
      </LoadingContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <LoadingContainer>
        <CenteredResultsWrapper>
          You do not have a schedule available. Report your results using the submit form
        </CenteredResultsWrapper>
      </LoadingContainer>
    );
  }

  return (
    <ResultsStyleWrapper>
      {data.map((schedule, index) => (
        <ScheduleRow key={index} schedule={schedule} userId={userId} isAdmin={isAdmin} />
      ))}
    </ResultsStyleWrapper>
  );
};

const Schedule = () => {
  const { user } = useAuth();
  const userId = user?.id || "";
  const userRole = user?.role || userRoles.PLAYER;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(userId);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [showOnlyPending, setShowOnlyPending] = useState(false);

  // Only fetch schedules when tournament changes or filters change (not for initial load)
  // const shouldFetchSchedule = currentPage !== 1 ||
  //   selectedTournament !== initialTournaments[0] ||
  //   showFullSchedule ||
  //   showOnlyPending;
  
  // const { data: dataDefault } = useUserAvailableTournamentsWithSchedule();
  
  const { data: dataSchedule, isLoading, error } = useSchedules({
    userId: showFullSchedule ? undefined : selectedUserId,
    tournamentId: selectedTournament?.id || "",
    page: currentPage,
    pageSize: 20,
    onlyPending: showOnlyPending,
    orderBy: 'dueDate',
    orderDirection: 'asc'
  });
  
  if (error) return <div>Error: {error.message}</div>;

  const scheduleData = dataSchedule?.results;
  const scheduleTotalPages = dataSchedule?.totalPages;
  const availableTournaments = dataSchedule?.userTournaments;
  const currentTournament = selectedTournament || availableTournaments?.find(t => t.id === dataSchedule?.defaultTournament);
  const isUserAdminForTournament = currentTournament?.adminId?.includes(userId);

  console.log("scheduleData", isUserAdminForTournament, currentTournament);
  const handlePlayerSelect = (playerId: string) => {
    setSelectedUserId(playerId);
    setCurrentPage(1); // Reset to first page when changing player
  };

  const handlePlayerRemove = (playerId: string) => {
    // The actual removal is handled by the ScheduleFilter component
    // This callback is just for any additional logic if needed
    console.log("Player removed:", playerId);
  };

  const handleShowFullScheduleChange = (showFull: boolean) => {
    setShowFullSchedule(showFull);
    setCurrentPage(1); // Reset to first page when changing view
  };

  const handleShowOnlyPendingChange = (showPending: boolean) => {
    setShowOnlyPending(showPending);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const onPageChange = (page: string) => {
    setCurrentPage(parseInt(page));
  };

  if (error) {
    return (
      <>
        <Head>
          <title>My Schedule - Twilight Struggle</title>
          <meta
            name="description"
            content="View your tournament schedule and upcoming games in Twilight Struggle competitions."
          />
          <link rel="icon" href="/ts-icon.webp" />
        </Head>
        <MainLayout>
          <div>
            <h1>My Schedule</h1>
            <div>Error loading schedule: {error.message}</div>
          </div>
        </MainLayout>
      </>
    );
  }

  const activeTabButton = (tournament, index) => {
    if (currentTournament) {
      return currentTournament.id === tournament.id;
    }
    return index === 0
  }
  return (
    <>
      <Head>
        <title>My Schedule - Twilight Struggle</title>
        <meta
          name="description"
          content="View your tournament schedule and upcoming games in Twilight Struggle competitions."
        />
        <link rel="icon" href="/ts-icon.webp" />
      </Head>
        <ResponsiveContainer>
          <Flex style={{ flexDirection: "column", width: "100%", gap: "4px", marginTop: "16px" }}>
            <h1>My Schedule</h1>

            {/* Tournament Tabs */}
            {availableTournaments?.length > 0 && (
              <TabContainer>
                {availableTournaments.map((tournament, index: number) => (
                  <TabButton
                    key={tournament.id}
                    $active={activeTabButton(tournament, index)}
                    onClick={() => {
                      setSelectedTournament(tournament);
                      setCurrentPage(1);
                    }}
                  >
                    {tournament.tournament_name}
                  </TabButton>
                ))}
              </TabContainer>
            )}

            {/* Admin Controls */}
            {isUserAdminForTournament && currentTournament && (
              <ScheduleFilter
                noSchedule={!scheduleData || scheduleData.length === 0}
                tournament={currentTournament.id}
                onPlayerSelect={handlePlayerSelect}
                onPlayerRemove={handlePlayerRemove}
                onShowFullScheduleChange={handleShowFullScheduleChange}
                onShowOnlyPendingChange={handleShowOnlyPendingChange}
                showFullSchedule={showFullSchedule}
                showOnlyPending={showOnlyPending}
              />
            )}

            <SchedulePanel
              data={scheduleData}
              userId={userId}
              isAdmin={isUserAdminForTournament}
              isLoading={isLoading}
            />

            {scheduleData && scheduleTotalPages > 1 && (
              <Pagination
                currentPage={currentPage.toString()}
                totalPages={scheduleTotalPages.toString()}
                onPageChange={onPageChange}
              />
            )}
          </Flex>
        </ResponsiveContainer>
    </>
  );
};// Wrap with ProtectedRoute - requires logged in user
const SchedulePage = () => (
  <ProtectedRoute requiredRole={userRoles.PLAYER}>
    <Schedule />
  </ProtectedRoute>
);

export default SchedulePage;