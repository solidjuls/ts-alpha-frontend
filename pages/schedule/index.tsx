import "react-day-picker/lib/style.css";
import React, { useState } from "react";
import Head from "next/head";
import { Flex } from "components/Atoms";
import { Spinner } from "@radix-ui/themes";
import Text from "components/Text";
import Link from "next/link";
import { FlagIcon } from "components/FlagIcon";
import { useAuth } from "contexts/AuthProviderNew";
import { DueDateDisplay } from "components/DueDateDisplay";
import { GameWinner } from "types/game.types";
import ScheduleFilter from "../../components/Schedule/ScheduleFilter";
import { getWinnerText } from "utils/games";
import { Pagination } from "components/Pagination";
import { useSchedules } from "hooks/useSchedule";
import { ScheduleItem } from "services/schedule.service";
import { Tournament } from "services/tournaments.service";
import { userRoles } from "utils/constants";
import ProtectedRoute from "components/ProtectedRoute";
import {
  PlayerInfo,
  ResultsStyleWrapper,
  DueDateCell,
  UnstyledLink,
  CheckOpponentProfileCell,
  ResponsiveContainer,
  LoadingContainer,
  CenteredResultsWrapper,
  TabContainer,
  TabButton,
  ColumnUnstyledLink,
  TournamentInfoFlex,
  TournamentText,
  FlexRow,
  PlayerInfoContainer,
  PageTitle,
  SpinnerContainer
} from "components/Schedule/Schedule.styled";

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
          {nameUsa || "No Player Assigned"}
        </Text>
      </PlayerInfoContainer>
      <span>vs</span>
      <PlayerInfoContainer style={{ justifyContent: "space-between" }}>
        {countryUssr && <FlagIcon code={countryUssr} />}
        <Text
          fontSize="medium"
          strong={getWinnerText(gameWinner as GameWinner) === "USSR" ? "bold" : undefined}
        >
          {nameUssr || "No Player Assigned"}
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
            <TournamentText>
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
        <UnstyledLink href={`/userprofile/${opponentId}`} $hoverVariant="alt">
          <Text fontSize="small">OPPONENT PROFILE</Text>
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
  isLoading,
  isFetching = false
}: {
  data: ScheduleItem[] | undefined;
  userId: string;
  isAdmin: boolean;
  isLoading: boolean;
  isFetching?: boolean;
}) => {
  // Show full loading state only on initial load (no data yet)
  if (isLoading && !data) {
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
          You do not have a schedule available. Report your results using the <Link href="/submit-game">Submit Form</Link>.
        </CenteredResultsWrapper>
      </LoadingContainer>
    );
  }

  return (
    <ResultsStyleWrapper style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 0.2s' }}>
      {isFetching && (
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      )}
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
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [showOnlyPending, setShowOnlyPending] = useState(false);

  // Only fetch schedules when tournament changes or filters change (not for initial load)
  // const shouldFetchSchedule = currentPage !== 1 ||
  //   selectedTournament !== initialTournaments[0] ||
  //   showFullSchedule ||
  //   showOnlyPending;
  
  // const { data: dataDefault } = useUserAvailableTournamentsWithSchedule();
  
  const { data: dataSchedule, isLoading, error, isFetching } = useSchedules({
    userId: selectedUserId,
    a: Number(showFullSchedule),
    tournamentId: selectedTournament?.id || "",
    page: currentPage,
    pageSize: 20,
    onlyPending: showOnlyPending,
    orderBy: 'dueDate',
    orderDirection: 'asc'
  });

  const scheduleData = dataSchedule?.results;
  const scheduleTotalPages = dataSchedule?.totalPages;
  const availableTournaments = dataSchedule?.userTournaments;
  const currentTournament = selectedTournament || availableTournaments?.find(t => t.id === dataSchedule?.defaultTournament);
  const isUserAdminForTournament = currentTournament?.adminId?.includes(userId);

  console.log("scheduleData", isUserAdminForTournament, currentTournament);

  const clearLocalState = () => {
    setSelectedUserId(null);
    setShowFullSchedule(false);
    setShowOnlyPending(false);
    setCurrentPage(1);
  }

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
            <PageTitle>My Schedule</PageTitle>

            {/* Tournament Tabs */}
            {availableTournaments?.length > 0 && (
              <TabContainer>
                {availableTournaments.map((tournament, index: number) => (
                  <TabButton
                    key={tournament.id}
                    $active={activeTabButton(tournament, index)}
                    onClick={() => {
                      setSelectedTournament(tournament);
                      clearLocalState();
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

            {error && (
              <div style={{ color: 'var(--ussr)', padding: '16px' }}>
                Error Loading Schedule: {error.message}
              </div>
            )}

            <SchedulePanel
              data={scheduleData}
              userId={userId}
              isAdmin={isUserAdminForTournament}
              isLoading={isLoading && !dataSchedule}
              isFetching={isFetching}
            />

            {scheduleData && scheduleTotalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={scheduleTotalPages}
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