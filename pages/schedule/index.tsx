import { Box, Flex } from "components/Atoms";
import useFetchInitialData from "hooks/useFetchInitialData"
import { useEffect } from "react"
import { PlayerInfo, StyledResultsPanel, UnstyledLink } from "./Schedule.styles";
import { Spinner } from "@radix-ui/themes";
import { dateFormat } from "utils/dates";
import Text
 from "components/Text";
import { FlagIcon } from "components/FlagIcon";
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
    return <SchedulePanel data={data}/>
}

export default Schedule