import { Spinner } from "@radix-ui/themes";
import { getInfoFromCookies } from "utils/cookies";
import useFetchInitialData from "hooks/useFetchInitialData";
import { tournamentStatus, TournamentStatusType } from "utils/constants";
import { City, Country, DropdownItemType, ServerType } from "types/types";
import { Flex, Form, Span } from "components/Atoms";
import { EditTextComponent } from "components/EditFormComponents";
import { Button } from "components/Button";
import { useState } from "react";
import { TournamentsType } from "types/game.types";
import { styled } from "stitches.config";
import getAxiosInstance, { clearAllCache } from "utils/axios";
import { Checkbox } from "components/Checkbox";

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
  flex: '1 1 50%',
  backgroundColor: "$rowBackground",
  color: "$text",
  borderRadius: "$medium",
  cursor: "pointer",
  userSelect: "none",
  transition: "background-color 0.2s",

  "&:hover": {
    backgroundColor: "$rowHover",
  },

  variants: {
    status: {
      closed: {
        backgroundColor: "$redAlpha",
      },
      ongoing: {
        backgroundColor: "$greenAlpha",
      },
      open: {
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
  return {
    data: localData,
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

const LegendContainer = styled("div", {
  display: "flex",
  flexDirection: "row",
  gap: "$small",
  padding: "$medium",
});

// Each row of the legend
const LegendItem = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$small",
  color: "$text",
});

// Color box
const ColorBox = styled("div", {
  width: "24px",
  height: "24px",
});

// Label text
const Label = styled("span", {
  fontSize: "14px",
});

const Legend = () => {
  return (
    <LegendContainer>
      <LegendItem>
        <ColorBox css={{ backgroundColor: "$redSolid" }} />
        {/* <ColorBox css={{ backgroundColor: "$redAlpha" }} /> */}
        <Label>Closed</Label>
      </LegendItem>

      <LegendItem>
        <ColorBox css={{ backgroundColor: "$greenSolid" }} />
        {/* <ColorBox css={{ backgroundColor: "$greenAlpha" }} /> */}
        <Label>Active</Label>
      </LegendItem>

      <LegendItem>
        <ColorBox css={{ backgroundColor: "$yellowSolid" }} />
        {/* <ColorBox css={{ backgroundColor: "$yellowAlpha" }} /> */}
        <Label>Registration Open</Label>
      </LegendItem>

      <LegendItem>
        <ColorBox css={{ backgroundColor: "$blueSolid" }} />
        {/* <ColorBox css={{ backgroundColor: "$blueAlpha" }} /> */}
        <Label>Registration Closed</Label>
      </LegendItem>
    </LegendContainer>
  );
};

const statusIdToName = Object.fromEntries(
  Object.entries(tournamentStatus).map(([key, value]) => [value, key])
);
const parseTournamentStatusIntoArray = (statusObj: Record<string, number>): DropdownItemType[] => {
  return Object.entries(statusObj).map(([key, value]) => ({
    text: key,
    value: value.toString(),
  }));
};

const Tournaments = () => {
  const { data, setData, isLoading, all, setAll, closed, setClosed, open, setOpen, refetch } =
    useTournamentState();
  const [tournamentName, setTournamentName] = useState<string>("");
console.log("data", data)


  // if (isLoading) return <Spinner size="3" />;

  const handleDelete = (tournamentId: number) => {
    // setItems((prev) => prev.filter((_, i) => i !== index));
    console.log("handleDelete", tournamentId);
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
      status: (value === tournamentStatus.closed.toString()) ? tournamentStatus.open.toString() : tournamentStatus.closed.toString()
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
          labelText="firstName"
          inputValue={tournamentName}
          onInputValueChange={(value) => setTournamentName(value)}
          // css={{ width: inputWidth }}
          // error={form?.first_name.error}
        />
        <Button onClick={addNewTournament}>Add</Button>
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
                <TournamentNameCell status={statusIdToName[item.status_id]}  onClick={() => handleDelete(item.id)} >
                  {item.tournament_name}
                </TournamentNameCell>
                <UpdateCell onClick={() => onStatusChange(item.status_id?.toString(), item)}><Span>{statusIdToName[item.status_id]}</Span></UpdateCell>
            </Flex>
          );
        })}
      </Container>
    </Form>
  );
};
// css={{ backgroundColor: getStatusColor(item.status_id, false) }}
// export async function getServerSideProps({ req, res }: ServerType) {
//   const payload = getInfoFromCookies(req, res);

//   if (!payload || payload?.role !== userRoles.SUPERADMIN) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: "/login",
//       },
//     };
//   }
//   return { props: { role: payload.role || null } };
// }

export default Tournaments;
