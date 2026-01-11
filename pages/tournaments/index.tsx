import { Spinner } from "@radix-ui/themes";
import { useTournamentsByStatus } from "hooks/useTournaments";
import { getTournamentStatusNames, tournamentStatus, TournamentStatusType, userRoles } from "utils/constants";
import Text from "components/Text";
import { Tournament } from "services/tournaments.service";
import { UnstyledLink } from "components/Schedule/Schedule.styled";
import { dateFormat } from "utils/dates";
import { useRouter } from "next/router";
import { ResponsiveContainer } from "components/Layout/ResponsiveContainer";
import { useIsAuthenticated } from "hooks/useAuth";
import {
  PageContainer,
  LoadingArea,
  PageHeader,
  Title,
  Actions,
  CreateButton,
  Card,
  TableScroll,
  TournamentTable,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableCell,
  NameCell,
  EmptyState,
  StatusBadge,
  StatusVariant,
  MobileList,
  MobileCard,
  MobileTopRow,
  MobileName,
  MobileMeta,
  MobileMetaRow,
  MobileLabel,
  MobileValue,
} from "styles/tournaments.styled";

type TournamentStatusKey = keyof typeof tournamentStatus;

const getVariant = (statusId: TournamentStatusType): TournamentStatusKey => {
  return (
    (Object.keys(tournamentStatus) as TournamentStatusKey[]).find(
      (key) => tournamentStatus[key] === statusId
    ) || "closed"
  );
};

interface TournamentRowProps {
  tournament: Tournament;
}

const TournamentRow = ({ tournament }: TournamentRowProps) => {
  const router = useRouter();

  const adminsFormatted =
    tournament.adminName?.length > 0 ? tournament.adminName.join(", ") : "-";

  const dateFormatted = tournament.starting_date
    ? dateFormat(new Date(tournament.starting_date))
    : "-";

  const statusName = getTournamentStatusNames(
    tournament.status_id as TournamentStatusType
  );

  const statusVariant = getVariant(
    tournament.status_id as TournamentStatusType
  ) as StatusVariant;

  return (
    <TableRow onClick={() => router.push(`/tournaments/${tournament.id}`)}>
      <NameCell>{tournament.tournament_name}</NameCell>
      <TableCell>
        <StatusBadge $variant={statusVariant}>{statusName}</StatusBadge>
      </TableCell>
      <TableCell>{adminsFormatted}</TableCell>
      <TableCell>{dateFormatted}</TableCell>
    </TableRow>
  );
};

const TournamentMobileCard = ({ tournament }: { tournament: Tournament }) => {
  const router = useRouter();

  const adminsFormatted =
    tournament.adminName?.length > 0 ? tournament.adminName.join(", ") : "-";

  const dateFormatted = tournament.starting_date
    ? dateFormat(new Date(tournament.starting_date))
    : "-";

  const statusName = getTournamentStatusNames(
    tournament.status_id as TournamentStatusType
  );

  const statusVariant = getVariant(
    tournament.status_id as TournamentStatusType
  ) as StatusVariant;

  return (
    <MobileCard onClick={() => router.push(`/tournaments/${tournament.id}`)}>
      <MobileTopRow>
        <MobileName>{tournament.tournament_name}</MobileName>
        <StatusBadge $variant={statusVariant}>{statusName}</StatusBadge>
      </MobileTopRow>

      <MobileMeta>
        <MobileMetaRow>
          <MobileLabel>Administrators</MobileLabel>
          <MobileValue>{adminsFormatted}</MobileValue>
        </MobileMetaRow>

        <MobileMetaRow>
          <MobileLabel>Starting Date</MobileLabel>
          <MobileValue>{dateFormatted}</MobileValue>
        </MobileMetaRow>
      </MobileMeta>
    </MobileCard>
  );
};

const Tournaments = () => {
  const { user } = useIsAuthenticated();
  const role = user?.role ?? null;

  const { data, isLoading } = useTournamentsByStatus([
    tournamentStatus["initial"],
    tournamentStatus["ongoing"],
    tournamentStatus["registrationClosed"],
    tournamentStatus["registrationOpen"],
  ]);

  const filteredTournaments = data?.filter(
  (tournament) => tournament.tournament_name !== "Friendly Game"
);

  if (isLoading) {
    return (
      <ResponsiveContainer>
        <PageContainer>
          <LoadingArea>
            <Spinner size="3" />
          </LoadingArea>
        </PageContainer>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer>
      <PageContainer>
        <PageHeader>
          <Title>Tournaments</Title>

          <Actions>
            {role === userRoles.SUPERADMIN && (
              <CreateButton>
                <UnstyledLink href="/tournament-create" $hoverVariant="alt">
                  Create New Tournament
                </UnstyledLink>
              </CreateButton>
            )}
          </Actions>
        </PageHeader>

        <Card>
          {/* Desktop/tablet table */}
          <TableScroll>
            <TournamentTable>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Tournament Name</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Administrators</TableHeaderCell>
                  <TableHeaderCell>Starting Date</TableHeaderCell>
                </tr>
              </TableHeader>

              <tbody>
                {filteredTournaments?.map((tournament) => (
                  <TournamentRow key={tournament.id} tournament={tournament} />
                ))}
              </tbody>
            </TournamentTable>
          </TableScroll>

          {/* Mobile cards */}
          <MobileList>
            {filteredTournaments?.map((tournament) => (
              <TournamentMobileCard key={tournament.id} tournament={tournament} />
            ))}
          </MobileList>
        </Card>

        {(!filteredTournaments || filteredTournaments.length === 0) && (
          <EmptyState>
            <Text fontSize="big">No Tournaments Found</Text>
            <Text fontSize="medium" style={{ marginTop: "8px" }}>
              Create a new tournament to get started.
            </Text>
          </EmptyState>
        )}
      </PageContainer>
    </ResponsiveContainer>
  );
};

export default Tournaments;
