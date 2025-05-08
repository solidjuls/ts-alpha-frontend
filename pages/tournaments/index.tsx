import { useState } from "react";
import { Spinner } from "@radix-ui/themes";
import { getInfoFromCookies } from "utils/cookies";
import { Cross2Icon } from '@radix-ui/react-icons';
import useFetchInitialData from "hooks/useFetchInitialData";
import { tournamentStatus, TournamentStatusType, userRoles } from "utils/constants";
import { ServerType } from "types/types";
import { Flex, Form, Span } from "components/Atoms";
import { EditTextComponent } from "components/EditFormComponents";
import { Button } from "components/Button";
import { TournamentsType } from "types/game.types";
import { styled } from "stitches.config";
import getAxiosInstance, { clearAllCache } from "utils/axios";
import { Checkbox } from "components/Checkbox";
import Legend from './Legend'

const DeleteIcon = styled(Cross2Icon, {
  color: 'red',
  cursor: 'pointer',
  width: '20px',
  height: '20px',
  '&:hover': {
    opacity: 0.7,
  },
});

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

// Individual cell
const UpdateCell = styled('div', {
  // backgroundColor: '$hover',
  // borderRadius: '$medium',
  position: 'relative',
  display: 'flex',
  flex: '1 1 50%',
  justifyContent: 'center',
  margin: '4px',
  alignItems: 'center',
  color: '$text',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.3s, transform 0.2s',

  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const Container = styled("div", {
  width: "600px",
  height: "500px",
  overflowY: "scroll",
  backgroundColor: "$background",
  border: "1px solid $gray500",
  borderRadius: "4px",
  padding: "$medium",
});

const TournamentNameCell = styled("div", {
  padding: "8px",
  color: "$text",
  borderRadius: "$medium",
  userSelect: "none",
  transition: "background-color 0.2s",
  flex: '1 1 50%',
  variants: {
    status: {
      closed: {
        backgroundColor: "$redAlpha",
      },
      open: {
        backgroundColor: "$greenAlpha",
      },
      ongoing: {
        backgroundColor: "$yellowAlpha",
      },
      finished: {
        backgroundColor: "$blueAlpha",
      },
    }
  }
})

const useTournamentState = () => {
  const { data, setData, isLoading, refetch } = useFetchInitialData<TournamentsType[]>({
    url: `/api/game/tournaments`,
    cacheId: 'tournaments'
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

const statusIdToName = Object.fromEntries(
  Object.entries(tournamentStatus).map(([key, value]) => [value, key])
);

const Tournaments = () => {
  const { data, setData, isLoading, all, setAll, closed, setClosed, open, setOpen, refetch } =
    useTournamentState();
  const [tournamentName, setTournamentName] = useState<string>("");

  // if (isLoading) return <Spinner size="3" />;

  const handleDelete = async (tournament: TournamentsType) => {
    if (tournament.status_id === tournamentStatus.new) {
      const resp = await getAxiosInstance().delete("/api/game/tournaments", {
        params: { id: tournament.id.toString() }
      });
      if (resp.status === 200) {
        await clearAllCache("tournaments");
        await refetch()
      }
    }
  };

  const addNewTournament = async () => {
    if (tournamentName) {
      const resp = await getAxiosInstance().patch("/api/game/tournaments", {
        name: tournamentName,
        status: 5,
      });
      if (resp.status === 200) {
        setData((prevState) => [...prevState, resp.data]);
      }
    }
  };

  const onStatusChange = async (value: string, tournament: TournamentsType) => {
    const resp = await getAxiosInstance().post("/api/game/tournaments", {
      id: tournament.id,
      status: (value === tournamentStatus.closed.toString() || value === tournamentStatus.new.toString()) ? tournamentStatus.open.toString() : tournamentStatus.closed.toString()
    });
    if (resp.status === 200) {
      await clearAllCache("tournaments");
      await refetch()
    }
  }

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
        <Button style={{ height: "35px", marginBottom: "0", alignSelf: "flex-end" }} onClick={addNewTournament}>Add</Button>
      </Flex>
      <Legend />
      <Flex css={{ flexDirection: "row", width: "100%" }}>
        <Checkbox text="All" onCheckedChange={() => setAll(!all)} checked={all} />
        <Checkbox text="Closed" onCheckedChange={() => setClosed(!closed)} checked={closed} />
        <Checkbox
          text="Open"
          onCheckedChange={() => setOpen(!open)}
          checked={open}
        />
      </Flex>
      <Container>
        {data?.map((item, index) => {
          return (
            <Flex key={index} css={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TournamentNameCell status={statusIdToName[item.status_id]}>
                  <Flex css={{ flexDirection: "row", alignItems: "center" }}>
                    {item.tournament_name} 
                    {item.status_id === tournamentStatus.new && <DeleteIcon onClick={() => handleDelete(item)} />}
                  </Flex>
                </TournamentNameCell>
              <UpdateCell onClick={() => onStatusChange(item.status_id?.toString(), item)}><Span>{statusIdToName[item.status_id]}</Span></UpdateCell>
            </Flex>
          );
        })}
      </Container>
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
