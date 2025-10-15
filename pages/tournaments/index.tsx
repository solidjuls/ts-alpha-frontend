import { useState } from "react";
import { Spinner } from "@radix-ui/themes";
import { getInfoFromCookies } from "utils/cookies";
import useFetchInitialData from "hooks/useFetchInitialData";
import { getTournamentStatusNames, tournamentStatus, TournamentStatusType, userRoles } from "utils/constants";
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
import {
  PlayerInfo,
  ResultsStyleWrapper,
  DueDateCell,
  UnstyledLink,
  CheckOpponentProfileCell,
} from "components/Schedule/Schedule.styles";
import { dateFormat } from "utils/dates";

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

type TournamentStatusKey = keyof typeof tournamentStatus;
const getVariant: (statusId: TournamentStatusType) => TournamentStatusKey = (statusId) => {
  return (Object.keys(tournamentStatus) as TournamentStatusKey[])
    .find((key) => tournamentStatus[key] === statusId) || "closed";
};


export const Cell = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: 'center',
  backgroundColor: "white",
  padding: "4px",
  margin: "4px",
  borderWidth: "1px",
  borderRadius: "6px",
  border: "solid 1px $greyLight",
  minWidth: "150px",
  variants: {
    width: {
      full: {
        width: "100%",
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
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  '@media (max-width: 600px)': {
    display: 'none'
  },
})

const RowCell = ({ description, text }) => {
  return (
      <>
        <Text fontSize="small" css={{ marginBottom: 4 }}>
          {description}
        </Text>
        <Text fontSize="medium">
          {text}
        </Text>
      </>
  );
};
const PlayerInfoBox = ({
  tournamentName,
  tournamentId,
  status,
  admins,
  starting_date
}) => {
  const adminsFormatted = admins.length > 0 ? admins.join(", ") : '-'
  const dateFormatted = starting_date ? dateFormat(new Date(starting_date)) : '-'
  return (
    <UnstyledLink href={`/tournaments/${tournamentId}`} css={{ display: "flex", flexDirection: "row" }}>
      <Flex css={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <Cell width="full">
          <RowCell description="Tournament name" text={tournamentName} />
        </Cell>
        <Cell>
          <RowCell description="Admin" text={adminsFormatted} />
        </Cell>
        <Cell>
        <RowCell  description="Starting date" text={dateFormatted} />
        </Cell>
        <Cell>
          <RowCell description="Status" text={status} />
        </Cell>
      </Flex>
    </UnstyledLink>
  );
};

const Tournaments = () => {
  const { data, isLoading, refetch } = useFetchInitialData<TournamentsType[]>({
    url: `/api/game/tournaments?status=${tournamentStatus["open"]},${tournamentStatus["upcoming"]}`,
  });

  if (isLoading) return <Spinner size="3" />;

  return (
     <>
      <Flex css={{ flexDirection: "row", width: "100%" }}>
        <Button css={{ width: "150px", margin: "8px" }}>
          <UnstyledLink href="/tournament-create">
            Create new tournament
          </UnstyledLink>
        </Button>
      </Flex>
      <Legend />
      {/* <Flex css={{ flexDirection: "row", width: "100%" }}>
        <Checkbox text="All" onCheckedChange={() => setAll(!all)} checked={all} />
        <Checkbox text="Closed" onCheckedChange={() => setClosed(!closed)} checked={closed} />
        <Checkbox text="Open" onCheckedChange={() => setOpen(!open)} checked={open} />
      </Flex> */}
       <ResponsiveContainer
        direction={{
          "@initial": "column",
          "@sm": "column",
        }}
      >
      <ResultsStyleWrapper>
        {data?.map((item) => {
          return (
            <div key={item.id} >
              <PlayerInfoBox tournamentId={item.id} starting_date={item.starting_date} tournamentName={item.tournament_name} status={getTournamentStatusNames(item.status_id)} admins={item.adminName} />
            </div>
          )})}
      </ResultsStyleWrapper>
    </ResponsiveContainer></>
  );
};
//status={getVariant(item.status_id)}
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
