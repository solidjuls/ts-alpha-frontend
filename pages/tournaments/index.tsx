import { Spinner } from "@radix-ui/themes";
import { getInfoFromCookies } from "utils/cookies";
import useFetchInitialData from "hooks/useFetchInitialData";
import {
  getTournamentStatusNames,
  tournamentStatus,
  TournamentStatusType,
  userRoles,
} from "utils/constants";
import { ServerType } from "types/types";
import Text from "components/Text";
import { Box, Flex } from "components/Atoms";
import { Button } from "components/Button";
import { Tournament } from "services/tournaments.service";
import { styled } from "stitches.config";
import Legend from "./Legend";
import { UnstyledLink } from "components/Schedule/Schedule.styles";
import { dateFormat } from "utils/dates";
import { useRouter } from "next/router";

// Tournament Table Styles
const TournamentTable = styled("table", {
  width: "100%",
  maxWidth: "1460px",
  borderCollapse: "collapse",
  backgroundColor: "white",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  margin: "16px",
});

const TableHeader = styled("thead", {
  backgroundColor: "$gray500",
  color: "white",
});

const TableHeaderCell = styled("th", {
  padding: "16px 12px",
  textAlign: "left",
  fontWeight: "600",
  fontSize: "14px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: "1px solid $greyLight",

  "&:first-child": {
    paddingLeft: "20px",
  },
  "&:last-child": {
    paddingRight: "20px",
  },

  "@sm": {
    padding: "12px 8px",
    fontSize: "12px",
    "&:first-child": {
      paddingLeft: "12px",
    },
    "&:last-child": {
      paddingRight: "12px",
    },
  },
});

const TableBody = styled("tbody", {});

const TableRow = styled("tr", {
  borderBottom: "1px solid $greyLight",
  transition: "background-color 0.2s ease",
  cursor: "pointer",

  "&:hover": {
    backgroundColor: "#f8f9fa",
  },

  "&:last-child": {
    borderBottom: "none",
  },

  variants: {
    status: {
      closed: {
        backgroundColor: "$redAlpha",
        "&:hover": {
          backgroundColor: "rgba(255, 0, 0, 0.5)",
        },
      },
      open: {
        backgroundColor: "$greenAlpha",
        "&:hover": {
          backgroundColor: "rgba(0, 128, 0, 0.5)",
        },
      },
      registrationOpen: {
        backgroundColor: "$blueAlpha",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 255, 0.5)",
        },
      },
    },
  },
});

const TableCell = styled("td", {
  padding: "16px 12px",
  verticalAlign: "middle",
  fontSize: "14px",

  "&:first-child": {
    paddingLeft: "20px",
    fontWeight: "500",
  },
  "&:last-child": {
    paddingRight: "20px",
  },

  "@sm": {
    padding: "12px 8px",
    fontSize: "13px",
    "&:first-child": {
      paddingLeft: "12px",
    },
    "&:last-child": {
      paddingRight: "12px",
    },
  },
});

const StatusBadge = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "500",
  textTransform: "capitalize",

  variants: {
    status: {
      closed: {
        backgroundColor: "#fee2e2",
        color: "#dc2626",
      },
      open: {
        backgroundColor: "#dcfce7",
        color: "#16a34a",
      },
      registrationOpen: {
        backgroundColor: "#dbeafe",
        color: "#2563eb",
      },
    },
  },
});

const ResponsiveContainer = styled("div", {
  width: "100%",
  overflowX: "auto",

  "@sm": {
    overflowX: "scroll",
  },
});

type TournamentStatusKey = keyof typeof tournamentStatus;
const getVariant: (statusId: TournamentStatusType) => TournamentStatusKey = (statusId) => {
  return (
    (Object.keys(tournamentStatus) as TournamentStatusKey[]).find(
      (key) => tournamentStatus[key] === statusId,
    ) || "closed"
  );
};

interface TournamentRowProps {
  tournament: Tournament;
}

const TournamentRow = ({ tournament }: TournamentRowProps) => {
  const router = useRouter();
  const adminsFormatted = tournament.adminName?.length > 0 ? tournament.adminName.join(", ") : "-";
  const dateFormatted = tournament.starting_date
    ? dateFormat(new Date(tournament.starting_date))
    : "-";
  const statusName = getTournamentStatusNames(tournament.status_id);
  const statusVariant = getVariant(tournament.status_id);

  const onClick = () => {
    if (tournament.status_id !== tournamentStatus.registrationOpen) {
      return undefined
    }
    router.push(`/tournaments/${tournament.id}`);
  };
  return (
    <TableRow onClick={onClick}>
      <TableCell>
        {tournament.tournament_name}
      </TableCell>
      <TableCell>
        <StatusBadge status={statusVariant}>{statusName}</StatusBadge>
      </TableCell>
      <TableCell>{adminsFormatted}</TableCell>
      <TableCell>{dateFormatted}</TableCell>
    </TableRow>
  );
};

const Tournaments = ({ role } : { role: number }) => {
  const { data, isLoading } = useFetchInitialData<TournamentsType[]>({
    url: `/api/game/tournaments?status=${tournamentStatus["open"]},${tournamentStatus["registrationOpen"]}`,
  });

  if (isLoading) return <Spinner size="3" />;

  return (
    <>
      {/* <Legend /> */}

      <ResponsiveContainer>
        <Flex
          css={{
            flexDirection: "column",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontWeight: "600" }}>Tournaments</h1>
      </Flex>
        {role === userRoles.SUPERADMIN && (
          <Button css={{ marginLeft: "16px",width: "180px" }}>
            <UnstyledLink href="/tournament-create">Create New Tournament</UnstyledLink>
        </Button>)}
        <TournamentTable>
          <TableHeader>
            <tr>
              <TableHeaderCell>Tournament Name</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Administrators</TableHeaderCell>
              <TableHeaderCell>Starting Date</TableHeaderCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data?.map((tournament) => (
              <TournamentRow key={tournament.id} tournament={tournament} />
            ))}
          </TableBody>
        </TournamentTable>

        {(!data || data.length === 0) && (
          <Box
            css={{
              textAlign: "center",
              padding: "40px",
              color: "$gray500",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Text fontSize="big">No tournaments found</Text>
            <Text fontSize="medium" css={{ marginTop: "8px" }}>
              Create a new tournament to get started.
            </Text>
          </Box>
        )}
      </ResponsiveContainer>
    </>
  );
};
//status={getVariant(item.status_id)}
export async function getServerSideProps({ req, res }: ServerType) {
  const payload = getInfoFromCookies(req, res);

  // if (!payload || payload?.role !== userRoles.SUPERADMIN) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/login",
  //     },
  //   };
  // }
  return { props: { role: payload?.role || null } };
}

export default Tournaments;
