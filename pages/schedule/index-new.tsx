import "react-day-picker/lib/style.css";
import { useState } from "react";
import { Box, Flex } from "components/Atoms";
import { Spinner } from "@radix-ui/themes";
import { dateFormat } from "utils/dates";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import { getInfoFromCookies } from "utils/cookies";
import { DropdownItemType, ServerType } from "types/types";
import { Button } from "components/Button";
import { DueDateDisplay } from "components/DueDateDisplay";
import { userRoles } from "utils/constants";
import { GameWinner } from "types/game.types";
import { styled } from "stitches.config";
import ScheduleFilter from "../../components/Schedule/ScheduleFilter";
import { getWinnerText } from "utils/games";
import { Pagination } from "components/Pagination";
import Link from "next/link";
import { useSchedules } from "hooks/useSchedule";
import { ScheduleItem } from "services/schedule.service";
import {
  PlayerInfo,
  ResultsStyleWrapper,
  DueDateCell,
  UnstyledLink,
  CheckOpponentProfileCell,
} from "components/Schedule/Schedule.styles";

interface ScheduleProps {
  isSuperAdmin: boolean;
  tournamentsAdmin: DropdownItemType[];
  tournamentsRegistered: string[];
  isAdmin: boolean;
  userId: string;
}

const ResponsiveContainer = styled("div", {
  display: "flex",
  flexDirection: "row",
  width: "100%",
  maxWidth: "1100px",
  variants: {
    direction: {
      row: {
        flexDirection: "row",
      },
      column: {
        flexDirection: "column",
      },
    },
  },
});

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
  return `?id=${id}&idUsa=${idUsa}&idUssr=${idUssr}&tid=${tournamentId}&gc=${gameCode}`;
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
    return `/submit-schedule${generateQueryParams({ id, idUsa, idUssr, tournamentId, gameCode })}`;

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
    <Flex css={{ display: "flex", flexDirection: "row" }}>
      <Box
        css={{
          display: "flex",
          margin: "0 8px 0 8px",
          flexDirection: "row",
          lineHeight: 1,
          alignItems: "center",
        }}
      >
        <FlagIcon code={countryUsa} />
        <Text
          fontSize="medium"
          strong={getWinnerText(gameWinner as GameWinner) === "USA" ? "bold" : undefined}
        >
          {nameUsa}
        </Text>
      </Box>
      <span>vs</span>
      <Box
        css={{
          display: "flex",
          margin: "0 8px 0 8px",
          flexDirection: "row",
          lineHeight: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <FlagIcon code={countryUssr} />
        <Text
          fontSize="medium"
          strong={getWinnerText(gameWinner as GameWinner) === "USSR" ? "bold" : undefined}
        >
          {nameUssr}
        </Text>
      </Box>
    </Flex>
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
        <UnstyledLink
          href={resolveLink({
            gameResultsId: schedule.gameResultsId,
            id: schedule.id,
            idUsa: schedule.idUsa,
            idUssr: schedule.idUssr,
            tournamentId: schedule.tournamentId,
            gameCode: schedule.gameCode,
          })}
          css={{ display: "flex", flexDirection: "column" }}
        >
          <Flex
            css={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              margin: "0 0 0 8px",
            }}
          >
            <Text fontSize="small" css={{ alignSelf: "center", marginLeft: 4 }}>
              {schedule.tournamentName}
            </Text>
          </Flex>

          <PlayerInfoBox
            gameWinner={schedule.gameWinner}
            countryUsa={schedule.countryUsa}
            countryUssr={schedule.countryUssr}
            nameUsa={schedule.nameUsa}
            nameUssr={schedule.nameUssr}
          />
        </UnstyledLink>
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
          gameDate={schedule.gameDate}
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
      <Flex css={{ width: "100%" }}>
        <ResultsStyleWrapper css={{ justifyContent: "center", alignItems: "center" }}>
          <Spinner />
        </ResultsStyleWrapper>
      </Flex>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Flex css={{ width: "100%" }}>
        <ResultsStyleWrapper css={{ justifyContent: "center", alignItems: "center" }}>
          You do not have a schedule available. Report your results using the submit form
        </ResultsStyleWrapper>
      </Flex>
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

const Schedule: React.FC<ScheduleProps> = ({
  isSuperAdmin,
  tournamentsAdmin,
  tournamentsRegistered,
  userId
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(userId);
  const [selectedTournament, setSelectedTournament] = useState(tournamentsRegistered?.[0] || "");
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [showOnlyPending, setShowOnlyPending] = useState(false);

  // Always use the schedules hook with appropriate filters
  const { data, isLoading, error } = useSchedules({
    userId: showFullSchedule ? undefined : selectedUserId,
    tournamentId: selectedTournament,
    page: currentPage,
    pageSize: 20,
    onlyPending: showOnlyPending,
    orderBy: 'dueDate',
    orderDirection: 'asc'
  });
  const handlePlayerSelect = (playerId: string) => {
    setSelectedUserId(playerId);
    setCurrentPage(1); // Reset to first page when changing player
  };

  const handlePlayerRemove = (playerId: string) => {
    // Handle player removal logic here
    console.log("Remove player:", playerId);
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
      <div>
        <h1>My Schedule</h1>
        <div>Error loading schedule: {error.message}</div>
      </div>
    );
  }

  return (
    <>
      <h1>My Schedule</h1>
      <ResponsiveContainer
        direction={{
          "@initial": "row",
          "@sm": "column",
        }}
      >
        <Flex css={{ flexDirection: "column", width: "100%", gap: "4px", marginTop: "16px" }}>
          {tournamentsAdmin.length > 0 && (
            <ScheduleFilter
              noSchedule={!data?.results || data.results.length === 0}
              tournament={selectedTournament}
              onPlayerSelect={handlePlayerSelect}
              onPlayerRemove={handlePlayerRemove}
              onShowFullScheduleChange={handleShowFullScheduleChange}
              onShowOnlyPendingChange={handleShowOnlyPendingChange}
              showFullSchedule={showFullSchedule}
              showOnlyPending={showOnlyPending}
            />
          )}
          
          <SchedulePanel 
            data={data?.results} 
            userId={userId} 
            isAdmin={tournamentsAdmin.length > 0} 
            isLoading={isLoading} 
          />

          {data && data.totalPages > 1 && (
            <Pagination
              currentPage={currentPage.toString()}
              totalPages={data.totalPages.toString()}
              onPageChange={onPageChange}
            />
          )}
        </Flex>
      </ResponsiveContainer>
    </>
  );
};

export async function getServerSideProps({ req, res }: ServerType) {
  const payload = getInfoFromCookies(req, res);

  if (!payload) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  // For now, we'll use mock data for tournaments
  // In a real implementation, you'd fetch this from your NestJS API
  const leagueTypesAdmin: DropdownItemType[] = payload?.tournamentsAdmin?.map((id: any) => ({
    value: id.toString(),
    text: `Tournament ${id}`,
  })) || [];

  const tournamentsRegistered = payload?.tournamentsRegistered || [];

  return { 
    props: { 
      isSuperAdmin: payload?.role === userRoles.SUPERADMIN, 
      tournamentsRegistered, 
      tournamentsAdmin: leagueTypesAdmin, 
      userId: payload?.id 
    } 
  };
}

export default Schedule;
