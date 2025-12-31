import { Spinner } from "@radix-ui/themes";
import styled from "styled-components";
import { useTournamentsByStatus } from "hooks/useTournaments";
import {
  getTournamentStatusNames,
  tournamentStatus,
  TournamentStatusType,
  userRoles,
} from "utils/constants";
import Text from "components/Text";
import { Button } from "components/Button";
import { Tournament } from "services/tournaments.service";
import { UnstyledLink } from "components/Schedule/Schedule.styled";
import { dateFormat } from "utils/dates";
import { useRouter } from "next/router";
import { ResponsiveContainer } from "components/Layout/ResponsiveContainer";
import { useIsAuthenticated } from "hooks/useAuth";

// Tournament Table Styles
const TournamentTable = styled.table`
  width: 100%;
  max-width: 1460px;
  border-collapse: collapse;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 16px;
`;

const TableHeader = styled.thead`
  background-color: #6b7280;
  color: white;
`;

const TableHeaderCell = styled.th`
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;

  &:first-child {
    padding-left: 20px;
  }

  &:last-child {
    padding-right: 20px;
  }

  @media (max-width: 640px) {
    padding: 12px 8px;
    font-size: 12px;

    &:first-child {
      padding-left: 12px;
    }

    &:last-child {
      padding-right: 12px;
    }
  }
`;

const TableBody = styled.tbody``;

interface TableRowProps {
  $status?: 'closed' | 'open' | 'registrationOpen';
}

const TableRow = styled.tr<TableRowProps>`
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${props => {
      if (props.$status === 'closed') return 'rgba(255, 0, 0, 0.5)';
      if (props.$status === 'open') return 'rgba(0, 128, 0, 0.5)';
      if (props.$status === 'registrationOpen') return 'rgba(0, 0, 255, 0.5)';
      return '#f8f9fa';
    }};
  }

  &:last-child {
    border-bottom: none;
  }

  background-color: ${props => {
    if (props.$status === 'closed') return 'rgba(255, 0, 0, 0.1)';
    if (props.$status === 'open') return 'rgba(0, 128, 0, 0.1)';
    if (props.$status === 'registrationOpen') return 'rgba(0, 0, 255, 0.1)';
    return 'transparent';
  }};
`;

const TableCell = styled.td`
  padding: 16px 12px;
  vertical-align: middle;
  font-size: 14px;

  &:first-child {
    padding-left: 20px;
    font-weight: 500;
  }

  &:last-child {
    padding-right: 20px;
  }

  @media (max-width: 640px) {
    padding: 12px 8px;
    font-size: 13px;

    &:first-child {
      padding-left: 12px;
    }

    &:last-child {
      padding-right: 12px;
    }
  }
`;

interface StatusBadgeProps {
  $status?: 'closed' | 'open' | 'registrationOpen';
}

const StatusBadge = styled.span<StatusBadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;

  background-color: ${props => {
    if (props.$status === 'closed') return '#fee2e2';
    if (props.$status === 'open') return '#dcfce7';
    if (props.$status === 'registrationOpen') return '#dbeafe';
    return '#f3f4f6';
  }};

  color: ${props => {
    if (props.$status === 'closed') return '#dc2626';
    if (props.$status === 'open') return '#16a34a';
    if (props.$status === 'registrationOpen') return '#2563eb';
    return '#6b7280';
  }};
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

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
  const statusName = getTournamentStatusNames(tournament.status_id as TournamentStatusType);
  const statusVariant = getVariant(tournament.status_id as TournamentStatusType);

  const onClick = () => {
    router.push(`/tournaments/${tournament.id}`);
  };
  return (
    <TableRow onClick={onClick} $status={statusVariant}>
      <TableCell>
        {tournament.tournament_name}
      </TableCell>
      <TableCell>
        <StatusBadge $status={statusVariant}>{statusName}</StatusBadge>
      </TableCell>
      <TableCell>{adminsFormatted}</TableCell>
      <TableCell>{dateFormatted}</TableCell>
    </TableRow>
  );
};

const Tournaments = () => {
  const { user } = useIsAuthenticated();
  const role = user?.role ?? null;

  const { data, isLoading } = useTournamentsByStatus([
    tournamentStatus["initial"],
    tournamentStatus["ongoing"],
    tournamentStatus["registrationClosed"],
    tournamentStatus["registrationOpen"]
  ]);

  if (isLoading) return <Spinner size="3" />;

  return (
    <>
      {/* <Legend /> */}

        <ResponsiveContainer>
          <HeaderContainer>
            <h2>Tournaments</h2>
          </HeaderContainer>
          {role === userRoles.SUPERADMIN && (
            <Button style={{ marginLeft: "16px", width: "180px" }}>
              <UnstyledLink href="/tournament-create">Create New Tournament</UnstyledLink>
            </Button>
          )}
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
            <EmptyStateContainer>
              <Text fontSize="big">No tournaments found</Text>
              <Text fontSize="medium" style={{ marginTop: "8px" }}>
                Create a new tournament to get started.
              </Text>
            </EmptyStateContainer>
          )}
        </ResponsiveContainer>

    </>
  );
};
//status={getVariant(item.status_id)}
export default Tournaments;
