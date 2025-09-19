import { useState } from "react";
import { Spinner } from "@radix-ui/themes";
import { getInfoFromCookies } from "utils/cookies";
import useFetchInitialData from "hooks/useFetchInitialData";
import { getTournamentStatusNames, tournamentStatus, TournamentStatusType, userRoles } from "utils/constants";
import {  ResultsStyleWrapper, UnstyledLink } from "components/Schedule/Schedule.styles";
import { ServerType } from "types/types";
import Text from "components/Text";
import { Box, Flex, Form, Span } from "components/Atoms";
import { EditTextComponent } from "components/EditFormComponents";
import { Button } from "components/Button";
import { TournamentsType } from "types/game.types";
import { styled } from "stitches.config";
import getAxiosInstance, { clearAllCache } from "utils/axios";
import { Checkbox } from "components/Checkbox";
import Legend from "./Legend";

const formStyles = {
  alignItems: "center",
  backgroundColor: "White",
  width: "640px",
  padding: "12px",
  alignSelf: "center",
  // boxShadow: "rgb(100 100 111 / 20%) 0px 7px 29px 0px",
  "@sm": {
    width: "100%",
  },
};

const TournamentNameRow = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: '100%',
  padding: "4px",
  margin: "4px",
  borderWidth: "1px",
  borderRadius: "6px",
  border: "solid 1px $greyLight",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  variants: {
    status: {
      closed: {
        backgroundColor: "$redAlpha",
      },
      open: {
        backgroundColor: "$greenAlpha",
      },
      registrationOpen: {
        backgroundColor: "$yellowAlpha",
      },
      upcoming: {
        backgroundColor: "$blueAlpha",
      },
    },
  },
});

const useTournamentState = () => {
  const { data, setData, isLoading, refetch } = useFetchInitialData<TournamentsType[]>({
    url: `/api/game/tournaments`,
    cacheId: "tournaments",
  });
  const [all, setAll] = useState(false);
  const [closed, setClosed] = useState(false);
  const [open, setOpen] = useState(false);

  let localData: TournamentsType[] = [];
  if (data && closed) {
    localData = [
      ...localData,
      ...data.filter((item) => item.status_id === tournamentStatus.closed),
    ];
  }
  if (data && open) {
    localData = [...localData, ...data.filter((item) => item.status_id === tournamentStatus.open)];
  }

  if ((data && all) || (data && !all && !closed && !open)) {
    localData = data;
  }

  const sortTournamentsByStatus = (a: TournamentsType, b: TournamentsType) => {
    const priority = (status: TournamentStatusType) => {
      if (status === 5) return 0;
      if (status === 1) return 1;
      return 2;
    };

    return priority(a.status_id) - priority(b.status_id);
  };

  return {
    data: localData.sort(sortTournamentsByStatus),
    setData,
    isLoading,
    refetch,
    all,
    setAll,
    closed,
    setClosed,
    open,
    setOpen,
  };
};

type TournamentStatusKey = keyof typeof tournamentStatus;
const getVariant: (statusId: TournamentStatusType) => TournamentStatusKey = (statusId) => {
  return (Object.keys(tournamentStatus) as TournamentStatusKey[])
    .find((key) => tournamentStatus[key] === statusId) || "closed";
};

const PlayerInfoBox = ({
  tournamentName,
  tournamentId,
  status
}) => {
  return (
    <UnstyledLink href={`/tournaments/${tournamentId}`} css={{ display: "flex", flexDirection: "row" }}>
      <Box
        css={{
          display: "flex",
          margin: "8px",
          flexDirection: "row",
          lineHeight: 1,
          alignItems: "center",
          width: '100%',
          justifyContent: 'space-between'
        }}
      >
        <Text fontSize="medium">
          {tournamentName}
        </Text>
        <Text fontSize="medium">
          {status}
        </Text>
      </Box>
    </UnstyledLink>
  );
};

const Tournaments = () => {
  const { data, setData, isLoading, all, setAll, closed, setClosed, open, setOpen, refetch } =
    useTournamentState();
  const [tournamentName, setTournamentName] = useState<string>("");

  // if (isLoading) return <Spinner size="3" />;

  const addNewTournament = async () => {
    if (tournamentName) {
      const resp = await getAxiosInstance().patch("/api/game/tournaments", {
        name: tournamentName,
        status: 4,
      });
      if (resp.status === 200) {
        setData((prevState) => [...prevState, resp.data]);
      }
    }
  };

  return (
    <Form css={formStyles} onSubmit={(e) => e.preventDefault()}>
      <Flex css={{ flexDirection: "row", width: "100%" }}>
        <EditTextComponent
          labelText="newTournament"
          inputValue={tournamentName}
          maxLength={50}
          onInputValueChange={(value) => setTournamentName(value)}
          css={{ width: "300px" }}
        />
        <Button
          style={{ height: "35px", marginBottom: "0", alignSelf: "flex-end" }}
          onClick={addNewTournament}
        >
          Add
        </Button>
      </Flex>
      <Legend />
      <Flex css={{ flexDirection: "row", width: "100%" }}>
        <Checkbox text="All" onCheckedChange={() => setAll(!all)} checked={all} />
        <Checkbox text="Closed" onCheckedChange={() => setClosed(!closed)} checked={closed} />
        <Checkbox text="Open" onCheckedChange={() => setOpen(!open)} checked={open} />
      </Flex>
      <ResultsStyleWrapper>
        {data?.map((item) => {
          return (
            <TournamentNameRow status={getVariant(item.status_id)}>
              <PlayerInfoBox tournamentId={item.id} tournamentName={item.tournament_name} status={getTournamentStatusNames(item.status_id)}/>
            </TournamentNameRow>
          )})}
      </ResultsStyleWrapper>
    </Form>
  );
};

export async function getServerSideProps({ req, res }: ServerType) {
  const payload = getInfoFromCookies(req, res);

  if (!payload || payload?.role !== userRoles.SUPERADMIN) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  return { props: { role: payload.role || null } };
}

export default Tournaments;
