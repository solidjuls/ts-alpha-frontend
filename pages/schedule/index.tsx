import "react-day-picker/lib/style.css";
import { Box, Flex } from "components/Atoms";
import useFetchInitialData from "hooks/useFetchInitialData"
import { PlayerInfo, ResultsStyleWrapper, DueDateCell, UnstyledLink } from "components/Schedule/Schedule.styles";
import { Spinner } from "@radix-ui/themes";
import { dateFormat } from "utils/dates";
import Text
 from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import { getInfoFromCookies } from "utils/cookies";
import { DropdownItemType, ScheduleType, ServerType } from "types/types";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { Button } from "components/Button";
import { DueDateDisplay } from "components/DueDateDisplay";
import CsvUploadButton from "./CsvButtonUpload";
import { tournamentStatus, userRoles } from "utils/constants";
import ReplacePlayers from "./ReplacePlayers";
import AddNewSchedule from "./AddNewSchedule";
import { TournamentsType } from "types/game.types";
import { DropdownWithLabel } from "components/EditFormComponents";
import { useEffect } from "react";
import { fetchScheduleList } from "../../redux/scheduleSlice";
import { AppDispatch, RootState } from "redux/store";
import { useDispatch, useSelector } from "react-redux";

interface ScheduleProps {
  isSuperAdmin: boolean
  tournaments: string[]
  userId: string
}

type SchedulePanelProps = {
  data: ScheduleType[] | null
  isLoading: boolean
}

const generateQueryParams = ({ id,idUsa,idUssr,tournamentId, gameCode }:{id: string; idUsa: string; idUssr: string; tournamentId: string; gameCode: string}) => {
  return `?id=${id}&idUsa=${idUsa}&idUssr=${idUssr}&tid=${tournamentId}&gc=${gameCode}`
}

const PlayerInfoBox = ({
  nameUsa,
  nameUssr,
  countryUsa,
  countryUssr,
  idUsa,
  idUssr,
  tournamentId,
  gameCode,
  id
}: Pick<
  ScheduleType,
  "nameUsa" | "nameUssr" | "countryUsa" | "countryUssr" | "id" | "idUsa" | "idUssr" | "tournamentId" | "gameCode"
>) => {
  return (
    <UnstyledLink href={`/submit-schedule${generateQueryParams({id,idUsa,idUssr,tournamentId,gameCode})}`} css={{ display: "flex", flexDirection: "row" }}>
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
        <Text fontSize="medium">
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
        <Text fontSize="medium">
          {nameUssr}
        </Text>
      </Box>
    </UnstyledLink>
  );
};

const ScheduleRow = ({ schedule }: { schedule: ScheduleType }) => {
  return (
    <Flex>
    <PlayerInfo>
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
        {/* <Text fontSize="small">{dateFormat(new Date(schedule?.gameDate))}</Text> */}
      </Flex>

      <PlayerInfoBox
        countryUsa={schedule.countryUsa}
        countryUssr={schedule.countryUssr}
        nameUsa={schedule.nameUsa}
        nameUssr={schedule.nameUssr}
        gameCode={schedule.gameCode}
        idUsa={schedule.idUsa}
        idUssr={schedule.idUssr}
        tournamentId={schedule.tournamentId}
        id={schedule.id}
      />
    </PlayerInfo>
    <DueDateCell>
      <DueDateDisplay dueDate={schedule.dueDate}
        admin={true}
        gamePlayed={false} />
    </DueDateCell>
    </Flex>
  );
};

const SchedulePanel: React.FC<SchedulePanelProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Flex css={{ width: "100%" }}>
        <ResultsStyleWrapper css={{ justifyContent: "center", alignItems: "center" }}>
          <Spinner />
        </ResultsStyleWrapper>
      </Flex>
    );
  }

  return (
    <ResultsStyleWrapper>
      {data?.map((schedule, index) => (
        <ScheduleRow key={index} schedule={schedule} />
      ))}
    </ResultsStyleWrapper>
  );
};

const Schedule: React.FC<ScheduleProps> = ({ isSuperAdmin, tournaments, userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, filters, currentPage, totalPages } = useSelector(
    (state: RootState) => state.scheduleList,
  );
  
  useEffect(() => {
    dispatch(fetchScheduleList({isSuperAdmin, tournaments, userId}))
  }, [])

  const { data: tournamentAPI, isLoading: loadingTournaments } = useFetchInitialData<
    TournamentsType
  >({
    url: `/api/game/tournaments?id=${tournaments?.[0]}`,
    cacheId: "tournament-list",
  });
  // const { data, isLoading } = useFetchInitialData<ScheduleType[]>({ url: `/api/schedule?sa=${isSuperAdmin}${tournamentQueryParam}` })
  // console.log(data)

  if (status === "loading" || loadingTournaments || !items) return null

  // const dataFiltered = data.filter(item => tournaments.includes(item.tournamentId))
  const leagueTypes: DropdownItemType[] = [{
    value: tournamentAPI?.id.toString(),
      text: tournamentAPI?.tournament_name,
  }]

  return <Flex css={{ flexDirection: 'column', width: "100%", maxWidth: "800px" }}>
          <CsvUploadButton tournament={tournaments?.[0]} />
          <DropdownWithLabel
            labelText="typeOfGame"
            key="gameType"
            items={leagueTypes}
            selectedItem={tournamentAPI?.id.toString()}
            placeholder="Select tournament"
            height="270px"
            // error={form.gameType.error}
            css={{ width: '200px' }}
            onSelect={(value) => onInputValueChange("gameType", value)}
          />
          <ReplacePlayers tournament={tournamentAPI?.id.toString()} />
          <AddNewSchedule tournament={tournamentAPI?.id.toString()} />
          {/* {isSuperAdmin && <TournamentFilter />} */}
          <SchedulePanel data={items} />
        </Flex>
}

export async function getServerSideProps({ req, res }: ServerType) {
  const payload = getInfoFromCookies(req, res);

  console.log("payload", payload)
  // if (!payload || payload?.role !== userRoles.SUPERADMIN) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/login",
  //     },
  //   };
  // }
  return { props: { isSuperAdmin: payload?.role === userRoles.SUPERADMIN, tournaments: payload?.tournaments, userId: payload?.id } };
}

export default Schedule