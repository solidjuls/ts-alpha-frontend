import { Box, Flex } from "components/Atoms";
import useFetchInitialData from "hooks/useFetchInitialData"
import { useEffect } from "react"
import { PlayerInfo, StyledResultsPanel, UnstyledLink, DueDateCell } from "./Schedule.styles";
import { Spinner } from "@radix-ui/themes";
import { dateFormat } from "utils/dates";
import Text
 from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import { getInfoFromCookies } from "utils/cookies";
import { ServerType } from "types/types";
type ScheduleType = {
  countryUsa: string
  countryUssr: string
  idUsa: string
  idUssr: string
  nameUsa: string;
  nameUssr: string
  tournamentId: string
  tournamentName: string
}

type SchedulePanelProps = {
  data: ScheduleType[] | null
  isLoading: boolean
}

const PlayerInfoBox = ({
  nameUsa,
  nameUssr,
  countryUsa,
  countryUssr,
}: Pick<
  ScheduleType,
  "nameUsa" | "nameUssr" | "countryUsa" | "countryUssr"
>) => {
  return (
    <Box css={{ display: "flex", flexDirection: "row" }}>
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
    </Box>
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
        <Text fontSize="small" css={{ alignSelf: "center"}}>
          {`Schedule id #${schedule.id}`}
        </Text>
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
      />
    </PlayerInfo>
    <DueDateCell>
        Due Date: 10/10/2020
    </DueDateCell>
    </Flex>
  );
};

const SchedulePanel: React.FC<SchedulePanelProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Flex css={{ width: "100%" }}>
        <StyledResultsPanel css={{ justifyContent: "center", alignItems: "center" }}>
          <Spinner />
        </StyledResultsPanel>
      </Flex>
    );
  }

  return (
    <StyledResultsPanel>
      {data?.map((schedule, index) => (
        <UnstyledLink key={index} href={`/games/`} passHref>
          <ScheduleRow key={index} schedule={schedule} />
        </UnstyledLink>
      ))}
    </StyledResultsPanel>
  );
};

const Schedule = () => {
  const { data, isLoading } = useFetchInitialData<ScheduleType[]>({ url: "/api/schedule" })
  console.log(data)
  // admin view, superadminview, player view
  // admin view: I can see my tournament schedules with a filter, I can update due date, I can reset a game
  // super admin view: I can see everything with a tournament filter, and do everything
  // player view. I can only see submit option

  return <SchedulePanel data={data}/>
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
  return { props: {  } };
}

export default Schedule