import { useMemo, useState } from "react";
import { Spinner } from "@radix-ui/themes";
import styled from "styled-components";
import { Button } from "components/Button";
import { DetailContainer } from "components/DetailContainer";
import { DisplayInfo } from "components/DisplayInfo";
import { StyledLabel } from "components/DisplayInfo/DisplayInfo.styled";
import {
  useTournamentsById,
  useRegisterForTournament,
  useUnregisterFromTournament,
  useRegisteredPlayers,
  useUpdateTournamentStatus,
  useWaitlistPlayers,
  useAddToWaitlist,
  useRemoveFromWaitlist,
} from "hooks/useTournaments";
import { useRouter } from "next/router";
import { userRoles } from "utils/constants";
import UserTypeahead from "components/UserTypeahead";
import { DropdownItemType } from "types/types";
import { dateFormat } from "utils/dates";
import { useAuth } from "contexts/AuthProviderNew";
import TournamentEditForm from "components/TournamentEditForm";
import TournamentPlayersList from "components/TournamentPlayersList";
import TournamentWaitlist from "components/TournamentWaitlist";
import {
  tournamentStatusHelpers,
  ACTION_TO_STATUS,
  ACTION_LABELS,
  TOURNAMENT_STATUS_NAMES,
} from "utils/tournamentStatus";
import { useIsAuthenticated } from "hooks/useAuth";

/* -----------------------
   Style guide wrappers
------------------------ */

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px;
`;

const Card = styled.section`
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
`;

const CardBody = styled.div`
  padding: 16px;

  @media (max-width: 640px) {
    padding: 14px;
  }
`;

const CardFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--border);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  margin: 0;
  color: var(--primary-text);
`;

const Subtle = styled.div`
  color: var(--primary-text);
  opacity: 0.85;
`;

const Badge = styled.span<{ $variant?: "neutral" | "usa" | "ussr" }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;

  background: ${({ $variant }) => {
    switch ($variant) {
      case "usa":
        return "var(--usa-half)";
      case "ussr":
        return "var(--ussr-quarter)";
      default:
        return "var(--bg-card)";
    }
  }};

  color: var(--primary-text);
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 10px 16px;
  grid-template-columns: 1fr 1fr;
  align-items: start;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
  min-width: 0;
`;

const DescriptionBox = styled.div`
  margin-top: 8px;
  padding: 12px;
  background: var(--bg-card);
  border-radius: 10px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);
  color: var(--primary-text);

  /* protect layout from long links/words in HTML */
  overflow-wrap: anywhere;

  p:first-child {
    margin-top: 0;
  }
  p:last-child {
    margin-bottom: 0;
  }
`;

const StatusLine = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const StatusText = styled.span<{ $tone?: "neutral" | "good" | "warn" }>`
  font-weight: 600;
  color: ${({ $tone }) => {
    switch ($tone) {
      case "good":
        return "var(--primary-text)";
      case "warn":
        return "var(--primary-text)";
      default:
        return "var(--primary-text)";
    }
  }};
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;

  @media (max-width: 700px) {
    justify-content: flex-start;
  }
`;

const PillButton = styled(Button)<{ $tone?: "usa" | "ussr" | "neutral" }>`
  /* If your Button already handles variants, keep this minimal.
     We only align hover behavior with your guide. */

  &:hover {
    background-color: var(--ussr);
    color: var(--alt-text);
  }
`;

export const DangerPillButton = styled(Button)`
  padding: 10px 14px;
  font-weight: 600;

  background: var(--ussr);
  color: var(--alt-text);
  border: 1px solid var(--border);

  &:hover:not(:disabled) {
    background: var(--ussr);
    filter: brightness(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AdminBar = styled.div`
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const AdminLabel = styled.div`
  font-weight: 700;
  color: var(--primary-text);
`;

const NotFoundContainer = styled.div`
  padding: 18px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  box-shadow: var(--shadow-soft);
  color: var(--primary-text);
  text-align: center;
`;

const InlineFormCard = styled(Card)`
  overflow: visible;
`;

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
`;

const FormTitle = styled.h3`
  margin: 0;
  color: var(--primary-text);
  font-size: 16px;
`;

const FormDescription = styled.p`
  margin: 0;
  color: var(--primary-text);
  opacity: 0.8;
  font-size: 13px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FormField = styled.div`
  flex: 1;
  min-width: 0;
`;

interface RegistrationActionSectionProps {
  isUserRegistered: boolean;
  isUserOnWaitlist: boolean;
  showWaitlistButton: boolean;
  isWaitlistAction: boolean;
  canRegister: boolean;
  onRegisterClick: () => void;
  onWaitlistClick: () => void;
}

const RegistrationActionSection = ({
  isUserRegistered,
  isUserOnWaitlist,
  showWaitlistButton,
  isWaitlistAction,
  canRegister,
  onRegisterClick,
  onWaitlistClick,
}: RegistrationActionSectionProps) => {
  const statusNode = useMemo(() => {
    if (isUserRegistered) {
      return (
        <StatusText $tone="good">✓ You are registered for this tournament</StatusText>
      );
    }
    if (isUserOnWaitlist) {
      return <StatusText $tone="warn">You are on the waitlist for this tournament</StatusText>;
    }
    if (showWaitlistButton) {
      return <StatusText $tone="neutral">Registration closed. Join the waitlist</StatusText>;
    }
    return <StatusText $tone="neutral">Click to register for this tournament</StatusText>;
  }, [isUserOnWaitlist, isUserRegistered, showWaitlistButton]);

  if (showWaitlistButton) {
    return (
      <CardFooter>
        <StatusLine>{statusNode}</StatusLine>
        <ButtonRow>
          <PillButton onClick={onWaitlistClick} disabled={isWaitlistAction}>
            {isWaitlistAction ? <Spinner size="1" /> : isUserOnWaitlist ? "Leave Waitlist" : "Join Waitlist"}
          </PillButton>
        </ButtonRow>
      </CardFooter>
    );
  }

  if (!canRegister) return null;

  return (
    <CardFooter>
      <StatusLine>{statusNode}</StatusLine>
      <ButtonRow>
        <PillButton onClick={onRegisterClick}>
          {isUserRegistered ? "Unregister" : "Register"}
        </PillButton>
      </ButtonRow>
    </CardFooter>
  );
};

const TournamentDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const { user } = useAuth();
  const { user: authUser } = useIsAuthenticated();

  const userRole = authUser?.role ?? userRoles.PLAYER;
  const userId = user?.id;
  const email = user?.email;

  const [isWaitlistAction, setIsWaitlistAction] = useState(false);
  const [optimisticRegistered, setOptimisticRegistered] = useState<boolean | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showManualRegistration, setShowManualRegistration] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [isManualRegistering, setIsManualRegistering] = useState(false);

  const { data, isLoading, refetch } = useTournamentsById([id as string]);

  const registerMutation = useRegisterForTournament();
  const unregisterMutation = useUnregisterFromTournament();
  const updateStatusMutation = useUpdateTournamentStatus();
  const addToWaitlistMutation = useAddToWaitlist();
  const removeFromWaitlistMutation = useRemoveFromWaitlist();

  const tournament = data?.[0];

  // Waitlist players query
  const { data: waitlistPlayers, refetch: refetchWaitlist } = useWaitlistPlayers(
    tournament ? parseInt(tournament.id) : 0
  );

  // Registered players query
  const { data: registeredPlayers, isLoading: playersLoading } = useRegisteredPlayers(
    tournament ? parseInt(tournament.id) : 0
  );

  if (isLoading || (tournament && playersLoading)) {
    return (
      <DetailContainer>
        <Page>
          <Card>
            <CardBody style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Spinner size="3" />
            </CardBody>
          </Card>
        </Page>
      </DetailContainer>
    );
  }

  if (!tournament) {
    return (
      <DetailContainer>
        <Page>
          <NotFoundContainer>Tournament not found</NotFoundContainer>
        </Page>
      </DetailContainer>
    );
  }

  const currentStatus = (tournament?.status_id || 1) as 1 | 2 | 3 | 4 | 5;
  const canRegister = tournamentStatusHelpers.canRegister(currentStatus);
  const availableActions = tournamentStatusHelpers.getAvailableActions(currentStatus);

  const showWaitlistButton =
    tournament.waitlist && (currentStatus === 3 || currentStatus === 4);

  const adminsFormatted =
    tournament.adminName?.length > 0 ? tournament.adminName.join(", ") : "-";

  const dateFormatted = tournament.starting_date
    ? dateFormat(new Date(tournament.starting_date))
    : "-";

  const statusName = TOURNAMENT_STATUS_NAMES[tournament.status_id];

  const isUserRegisteredFromServer = userId
    ? registeredPlayers?.some(
        (p) => p.email === email || p.userId === userId.toString()
      )
    : false;

  const isUserRegistered =
    optimisticRegistered !== null ? optimisticRegistered : isUserRegisteredFromServer;

  const isUserOnWaitlist = userId
    ? waitlistPlayers?.some((p) => p.userId === userId.toString())
    : false;

  const isUserAdmin =
    tournament.adminId && userId && tournament.adminId.includes(userId);

  const handleTournamentAction = async (action: keyof typeof ACTION_TO_STATUS) => {
    if (!tournament) return;

    try {
      const nextStatus = tournamentStatusHelpers.getNextStatus(action);
      await updateStatusMutation.mutateAsync({
        tournamentId: parseInt(tournament.id),
        status: nextStatus,
      });
      refetch();
    } catch (error) {
      console.error(`Failed to execute ${action}:`, error);
      alert("Failed to update tournament status. Please try again.");
    }
  };

  const onRegisterClick = async () => {
    if (!tournament || !userId) return;

    const wasRegistered = isUserRegistered;
    setOptimisticRegistered(!wasRegistered);

    try {
      if (wasRegistered) {
        await unregisterMutation.mutateAsync({
          tournamentId: parseInt(tournament.id),
          userId: userId.toString(),
        });
      } else {
        await registerMutation.mutateAsync({
          id: parseInt(tournament.id),
          userId: userId.toString(),
        });
      }
      await refetch();
      setOptimisticRegistered(null);
    } catch (e) {
      console.error("Registration error:", e);
      setOptimisticRegistered(null);
      alert("Registration update failed. Please try again.");
    }
  };

  const onWaitlistClick = async () => {
    if (!tournament || !userId) return;

    setIsWaitlistAction(true);
    try {
      if (isUserOnWaitlist) {
        await removeFromWaitlistMutation.mutateAsync({
          tournamentId: parseInt(tournament.id),
          data: { userId: userId.toString() },
        });
      } else {
        await addToWaitlistMutation.mutateAsync({
          tournamentId: parseInt(tournament.id),
          data: { userId: userId.toString() },
        });
      }
      refetchWaitlist();
    } catch (e) {
      console.error("Waitlist action error:", e);
      alert("Failed to update waitlist status. Please try again.");
    } finally {
      setIsWaitlistAction(false);
    }
  };

  const onManualRegisterClick = async () => {
    if (!tournament || !selectedUser) return;

    setIsManualRegistering(true);
    try {
      await registerMutation.mutateAsync({
        id: parseInt(tournament.id),
        userId: selectedUser,
      });
      setSelectedUser("");
      setShowManualRegistration(false);
      await refetch();
    } catch (e) {
      console.error("Manual registration error:", e);
      alert("Failed to register user. Please try again.");
    } finally {
      setIsManualRegistering(false);
    }
  };

  return (
    <DetailContainer>
      <Page>
        <Card>
          <HeaderRow>
            <div style={{ display: "flex", gap: "10px", alignItems: "baseline", flexWrap: "wrap" }}>
              <Title>{tournament.tournament_name || "Tournament"}</Title>
              <Badge $variant={showWaitlistButton ? "ussr" : "usa"}>{statusName}</Badge>
            </div>

            <Subtle>{isUserAdmin ? "Admin View" : "Tournament Details"}</Subtle>
          </HeaderRow>

          <CardBody>
            <InfoGrid>
              {/* If DisplayInfo already matches your style guide, keep it.
                 Otherwise this grid still handles responsive layout. */}
              <DisplayInfo label="Tournament Name" infoText={tournament.tournament_name || "-"} />
              <DisplayInfo label="Status" infoText={statusName || "-"} />
              <DisplayInfo label="Administrators" infoText={adminsFormatted} />
              <DisplayInfo label="Starting Date" infoText={dateFormatted} />

              {isUserAdmin && (
                <>
                  <DisplayInfo label="Can Register" infoText={canRegister ? "Yes" : "No"} />
                  <DisplayInfo label="Waitlist Enabled" infoText={tournament.waitlist ? "Yes" : "No"} />
                </>
              )}

              {tournament.description && (
                <FullWidth>
                  <StyledLabel>Description</StyledLabel>
                  <DescriptionBox
                    dangerouslySetInnerHTML={{ __html: tournament.description }}
                  />
                </FullWidth>
              )}
            </InfoGrid>
          </CardBody>

          <RegistrationActionSection
            isUserRegistered={!!isUserRegistered}
            isUserOnWaitlist={!!isUserOnWaitlist}
            showWaitlistButton={!!showWaitlistButton}
            isWaitlistAction={isWaitlistAction}
            canRegister={canRegister}
            onRegisterClick={onRegisterClick}
            onWaitlistClick={onWaitlistClick}
          />

          {isUserAdmin && (
            <AdminBar>
              <AdminLabel>Admin Mode — Tournament Management</AdminLabel>

              <ButtonRow>
                <PillButton onClick={() => setIsEditing((v) => !v)}>
                  {isEditing ? "Cancel Edit" : "Edit Tournament"}
                </PillButton>

                <PillButton onClick={() => setShowManualRegistration((v) => !v)}>
                  {showManualRegistration ? "Cancel" : "Register User"}
                </PillButton>

                {availableActions.map((action) => {
  const isCloseTournament =
    action === "CLOSE_TOURNAMENT" || action === "close_tournament";

  const Btn = isCloseTournament ? DangerPillButton : PillButton;

  return (
    <Btn
      key={action}
      onClick={() => handleTournamentAction(action as keyof typeof ACTION_TO_STATUS)}
      disabled={updateStatusMutation.isPending}
    >
      {updateStatusMutation.isPending
        ? "Processing..."
        : tournamentStatusHelpers.getActionLabel(action as keyof typeof ACTION_LABELS)}
    </Btn>
  );
})}

                <PillButton
              onClick={() => console.log("Waitlist toggle not implemented yet")}
            >
              {tournament.waitlist ? "Disable Waitlist" : "Enable Waitlist"}
            </PillButton>

              </ButtonRow>
            </AdminBar>
          )}
        </Card>

        {/* Manual registration */}
        {isUserAdmin && showManualRegistration && (
          <InlineFormCard>
            <CardBody>
              <FormHeader>
                <FormTitle>Register User Manually</FormTitle>
                <FormDescription>
                  Search and select a user to register for this tournament.
                </FormDescription>
              </FormHeader>

              <FormRow>
                <FormField>
                  <UserTypeahead
                    labelText=""
                    selectedItem={selectedUser}
                    onSelect={(item: DropdownItemType | null) =>
                      setSelectedUser(item?.value || "")
                    }
                    onBlur={() => {}}
                    placeholder="Type user name or email..."
                    css={{ width: "100%" }}
                    error={false}
                    users={[]} /* keep as-is if your UserTypeahead expects users prop elsewhere */
                  />
                </FormField>

                <PillButton
                  onClick={onManualRegisterClick}
                  disabled={!selectedUser || isManualRegistering}
                >
                  {isManualRegistering ? <Spinner size="1" /> : "Register"}
                </PillButton>
              </FormRow>
            </CardBody>
          </InlineFormCard>
        )}

        {/* Edit form */}
        {isUserAdmin && isEditing && (
          <TournamentEditForm
            tournament={tournament as any}
            onSave={() => {
              setIsEditing(false);
              refetch();
            }}
            onCancel={() => setIsEditing(false)}
          />
        )}

        {/* Registered players */}
        <TournamentPlayersList
          tournamentId={tournament.id}
          tournamentStatusId={tournament.status_id}
          onPlayerRemoved={() => refetch()}
          isAdmin={!!isUserAdmin}
        />

        {/* Waitlist */}
        {tournament.waitlist && (
          <TournamentWaitlist
            tournamentId={tournament.id}
            userRole={userRole || 1}
            onPlayerRemoved={() => refetch()}
          />
        )}
      </Page>
    </DetailContainer>
  );
};

export default TournamentDetail;
