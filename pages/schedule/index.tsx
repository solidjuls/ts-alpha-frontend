import "react-day-picker/lib/style.css";
import { Box, Flex } from "components/Atoms";
import useFetchInitialData from "hooks/useFetchInitialData"
import { PlayerInfo, ResultsStyleWrapper, DueDateCell, UnstyledLink } from "components/Schedule/Schedule.styles";
import { Spinner } from "@radix-ui/themes";
import { dateFormat } from "utils/dates";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import { getInfoFromCookies } from "utils/cookies";
import { DropdownItemType, ScheduleType, ServerType } from "types/types";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { Button } from "components/Button";
import { DueDateDisplay } from "components/DueDateDisplay";
import CsvUploadButton from "../../components/Schedule/CsvButtonUpload";
import { tournamentStatus, userRoles } from "utils/constants";
import ReplacePlayers from "../../components/Schedule/ReplacePlayers";
import AddNewSchedule from "../../components/Schedule/AddNewSchedule";
import { GameWinner, TournamentsType } from "types/game.types";
import { DropdownWithLabel } from "components/EditFormComponents";
import { useEffect, useState } from "react";
import { fetchScheduleList, setTournamentFilter } from "../../redux/scheduleSlice";
import { AppDispatch, RootState } from "redux/store";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "stitches.config";
import ScheduleFilter from "../../components/Schedule/ScheduleFilter";
import axios from "axios";
import UserTypeahead from "pages/submitform/UserTypeahead";
import { UserType } from "types/user.types";
import { Input } from "components/Input";
import TextComponent from "pages/submitform/TextComponent";
import { getWinnerText } from "utils/games";
import { Pagination } from "components/Pagination";
import { setCurrentPage } from "../../redux/scheduleSlice";

interface ScheduleProps {
  isSuperAdmin: boolean
  tournamentsAdmin: DropdownItemType[]
  tournamentsRegistered: DropdownItemType[]
  isAdmin: boolean
  userId: string
}

type SchedulePanelProps = {
  data: ScheduleType[] | null
  isLoading: boolean
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

const generateQueryParams = ({ id,idUsa,idUssr,tournamentId, gameCode }:{id: string; idUsa: string; idUssr: string; tournamentId: string; gameCode: string}) => {
  return `?id=${id}&idUsa=${idUsa}&idUssr=${idUssr}&tid=${tournamentId}&gc=${gameCode}`
}

const resolveLink = ({gameResultsId, id,idUsa,idUssr,tournamentId,gameCode}: {gameResultsId: string | null; id: string; idUsa: string; idUssr: string; tournamentId: string; gameCode: string}) => {
  if (!gameResultsId) return `/submit-schedule${generateQueryParams({id,idUsa,idUssr,tournamentId,gameCode})}`

  return `/games/${gameResultsId}`
}

const PlayerInfoBox = ({
  nameUsa,
  nameUssr,
  countryUsa,
  countryUssr,
  gameWinner,
}: Pick<
  ScheduleType,
  "nameUsa" | "nameUssr" | "countryUsa" | "countryUssr" | "gameWinner"
>) => {
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
        <Text fontSize="medium" strong={getWinnerText(gameWinner as GameWinner) === "USA" ? "bold" : undefined}>
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
          justifyContent: "space-between"
        }}
      >
        <FlagIcon code={countryUssr} />
        <Text fontSize="medium" strong={getWinnerText(gameWinner as GameWinner) === "USSR" ? "bold" : undefined}>
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

type VariantType = (schedule: ScheduleType) => 
  "played" | "duedate" | "default" | "firstAlert" | "secondAlert";

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

const ScheduleRow = ({ schedule, isAdmin }: { schedule: ScheduleType; isAdmin: boolean }) => {
  return (
    <Flex>
    <PlayerInfo status={getVariant(schedule)}>
      <UnstyledLink href={resolveLink({gameResultsId: schedule.gameResultsId, id: schedule.id, idUsa: schedule.idUsa, idUssr: schedule.idUssr, tournamentId: schedule.tournamentId, gameCode: schedule.gameCode})} css={{ display: "flex", flexDirection: "column" }}>
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
    <DueDateCell>
      <DueDateDisplay dueDate={schedule.dueDate} scheduleId={schedule.id} gameDate={schedule.gameDate}
        admin={isAdmin}
        gamePlayed={false} />
    </DueDateCell>
    </Flex>
  );
};

const SchedulePanel: React.FC<SchedulePanelProps> = ({ data, isAdmin, isLoading }) => {
  if (isLoading) {
    return (
      <Flex css={{ width: "100%" }}>
        <ResultsStyleWrapper css={{ justifyContent: "center", alignItems: "center" }}>
          <Spinner />
        </ResultsStyleWrapper>
      </Flex>
    );
  }

  if (data?.length === 0) {
    return (
      <Flex css={{ width: "100%" }}>
        <ResultsStyleWrapper css={{ justifyContent: "center", alignItems: "center" }}>
          You don't have a schedule available. Report your results using the submit form
        </ResultsStyleWrapper>
      </Flex>
    );
  }

  return (
    <ResultsStyleWrapper>
      {data?.map((schedule, index) => (
        <ScheduleRow key={index} schedule={schedule} isAdmin={isAdmin} />
      ))}
    </ResultsStyleWrapper>
  );
};

const Schedule: React.FC<ScheduleProps> = ({ isSuperAdmin, tournamentsAdmin, tournamentsRegistered, userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, filters, currentPage, totalPages } = useSelector(
    (state: RootState) => state.scheduleList,
  );

  useEffect(() => {
    if (tournamentsRegistered?.length > 0) {
      // dispatch(setTournamentFilter(tournamentsRegistered?.[0]?.value))
      dispatch(fetchScheduleList({isSuperAdmin, tournaments: [tournamentsRegistered?.[0]?.value as string], userId}))
    }
  }, [filters, currentPage, dispatch]);

  if (status === "loading") return null;

    const onPageChange = async (page: string) => {
      dispatch(setCurrentPage(page));
    };

  return <>
          <h1>My Schedule</h1>
          <ResponsiveContainer
            direction={{
              "@initial": "row",
              "@sm": "column",
            }}>
            <Flex css={{ flexDirection: 'column', width: "100%", gap: "4px", marginTop: '16px' }}>
              {/* <Flex css={{ flexDirection: 'row', width: "100%", gap: "4px" }}>
                <DropdownWithLabel
                  labelText="typeOfGame"
                  key="gameType"
                  items={tournamentsRegistered}
                  selectedItem={filters.tournamentSelected}
                  placeholder="Select tournament"
                  height="270px"
                  width='320px'
                  onSelect={(value) =>  {
                    dispatch(fetchScheduleList({isSuperAdmin, tournaments: [value], userId}))
                  }}
                />
              </Flex> */}
              
              {tournamentsAdmin.length > 0 && <ScheduleFilter userAdminTournaments={tournamentsAdmin.length > 0} noSchedule={items?.length === 0} />}
              <SchedulePanel data={items} isAdmin={tournamentsAdmin.length > 0}/>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </Flex>
          </ResponsiveContainer>
        </>
}

export async function getServerSideProps({ req, res }: ServerType) {
  const payload = getInfoFromCookies(req, res);
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const host = req.headers['host']
  const baseUrl = `${protocol}://${host}`

  const tournamentsConcatArray = payload?.tournamentsAdmin?.concat(payload?.tournamentsRegistered)
  // payload?.tournamentsRegistered
  const tournaments = payload?.tournamentsAdmin ? await axios.get(
    `${baseUrl}/api/game/tournaments?id=${tournamentsConcatArray?.join(',')}`
  ) : []

  const leagueTypesAdmin: DropdownItemType[] = tournaments?.data?.filter((item: TournamentsType) => payload?.tournamentsAdmin.includes(item.id)).map((item: TournamentsType) => ({
    value: item.id.toString(),
    text: item.tournament_name,
  })) || []

  const leagueTypesRegistered: DropdownItemType[] = tournaments?.data?.filter((item: TournamentsType) => payload?.tournamentsRegistered.includes(item.id)).map((item: TournamentsType) => ({
    value: item.id.toString(),
    text: item.tournament_name,
  })) || []

  // if (payload?.role !== userRoles.SUPERADMIN) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/login",
  //     },
  //   };
  // }
  return { props: { isSuperAdmin: payload?.role === userRoles.SUPERADMIN, tournamentsRegistered: leagueTypesRegistered, tournamentsAdmin: leagueTypesAdmin, userId: payload?.id } };
}

export default Schedule