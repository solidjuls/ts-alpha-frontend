import { useState } from "react";
import { Spinner } from "@radix-ui/themes";
import styled from "styled-components";
import { Button } from "components/Button";
import { DetailContainer } from "components/DetailContainer";
import { DisplayInfo } from "components/DisplayInfo";
import { StyledLabel } from "components/DisplayInfo/DisplayInfo.styled";
import { useTournamentsById, useRegisterForTournament, useUnregisterFromTournament, useRegisteredPlayers, useUpdateTournamentStatus, useBulkRegisterUsers, useGenerateRandomSchedule, useWaitlistPlayers, useAddToWaitlist, useRemoveFromWaitlist } from "hooks/useTournaments";
import { useRouter } from "next/router";
import { getTournamentStatusNames, userRoles } from "utils/constants";
import UserTypeahead from "components/UserTypeahead";
import { DropdownItemType } from "types/types";
import { dateFormat } from "utils/dates";
import { useAuth } from "contexts/AuthProviderNew";
import { MainLayout } from "components/Layout";
import TournamentEditForm from "components/TournamentEditForm";
import TournamentPlayersList from "components/TournamentPlayersList";
import TournamentWaitlist from "components/TournamentWaitlist";
import { tournamentStatusHelpers, ACTION_TO_STATUS, ACTION_LABELS, TOURNAMENT_STATUS_NAMES } from "utils/tournamentStatus";
import { useIsAuthenticated } from "hooks/useAuth";

const DescriptionBox = styled.div`
  margin-top: 8px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
`;

interface StatusTextProps {
  $type?: 'registered' | 'default' | 'admin';
}

const StatusText = styled.span<StatusTextProps>`
  font-weight: 500;

  color: ${props => {
    if (props.$type === 'registered') return '#16a34a';
    if (props.$type === 'admin') return '#6b7280';
    return '#6b7280';
  }};

  ${props => props.$type === 'admin' && `
    font-weight: 500;
  `}
`;

const NotFoundContainer = styled.div`
  text-align: center;
  padding: 40px;
`;

const TournamentCard = styled.div`
  border: solid 1px lightgray;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  background-color: white;
`;

const TournamentGrid = styled.div`
  display: grid;
  gap: 0.25rem;
  max-width: 48rem;
  grid-template-columns: 1fr 2fr;
  padding: 24px 0 24px 24px;
  align-items: left;
  width: 100%;
`;

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 400px;
  grid-column: 1 / -1;
`;

const ActionSection = styled.div`
  padding: 20px 24px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const ManualRegistrationForm = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  padding: 24px;
`;

const FormHeader = styled.div`
  margin-bottom: 16px;
`;

const FormTitle = styled.h3`
  margin: 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
`;

const FormDescription = styled.p`
  margin: 8px 0 0 0;
  color: #6b7280;
  font-size: 14px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-end;
`;

const FormField = styled.div`
  flex: 1;
`;

interface RegisterButtonProps {
  $isRegistered?: boolean;
}

const RegisterButton = styled(Button)<RegisterButtonProps>`
  background-color: ${props => props.$isRegistered ? '#dc2626' : '#16a34a'};

  &:hover {
    background-color: ${props => props.$isRegistered ? '#b91c1c' : '#15803d'};
  }
`;

interface WaitlistButtonProps {
  $isOnWaitlist?: boolean;
}

const WaitlistButton = styled(Button)<WaitlistButtonProps>`
  background-color: ${props => props.$isOnWaitlist ? '#dc2626' : '#f59e0b'};

  &:hover {
    background-color: ${props => props.$isOnWaitlist ? '#b91c1c' : '#d97706'};
  }
`;

const EditButton = styled(Button)`
  background-color: #3b82f6;
`;

const ManualRegisterButton = styled(Button)`
  background-color: #10b981;

  &:hover {
    background-color: #059669;
  }

  &:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
  }
`;

const ActionButton = styled(Button)<{ $variant?: string }>`
  background-color: ${props => {
    switch (props.$variant) {
      case 'start-registration': return '#059669';
      case 'close-registration': return '#dc2626';
      case 'start-tournament': return '#7c3aed';
      case 'close-tournament': return '#374151';
      case 'waitlist-enabled': return '#f59e0b';
      case 'waitlist-disabled': return '#6b7280';
      default: return '#6b7280';
    }
  }};
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

  const getStatusText = () => {
    if (isUserRegistered) {
      return <StatusText $type="registered">✓ You are registered for this tournament</StatusText>;
    }
    if (isUserOnWaitlist) {
      return <StatusText $type="default">You are on the waitlist for this tournament</StatusText>;
    }
    if (showWaitlistButton) {
      return <StatusText $type="default">Registration closed. Join the waitlist</StatusText>;
    }
    return <StatusText $type="default">Click to register for this tournament</StatusText>;
  };

  const getWaitlistButtonLabel = () => {
    if (isWaitlistAction) return <Spinner size="1" />;
    if (isUserOnWaitlist) return "Leave Waitlist";
    return "Join Waitlist";
  };

  const getRegisterButtonLabel = () => {
    // No spinner - using optimistic updates for instant feedback
    if (isUserRegistered) return "Unregister";
    return "Register";
  };

  if (showWaitlistButton) {
    return (
      <ActionSection>
        <div>{getStatusText()}</div>
        <WaitlistButton
          onClick={onWaitlistClick}
          disabled={isWaitlistAction}
          $isOnWaitlist={isUserOnWaitlist}
        >
          {getWaitlistButtonLabel()}
        </WaitlistButton>
      </ActionSection>
    );
  }

  if (!canRegister) return null;
  
  return (
    <ActionSection>
      <div>{getStatusText()}</div>
      <RegisterButton
        onClick={onRegisterClick}
        $isRegistered={isUserRegistered}
      >
        {getRegisterButtonLabel()}
      </RegisterButton>
    </ActionSection>
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
  // Optimistic state for registration - null means use server state
  const [optimisticRegistered, setOptimisticRegistered] = useState<boolean | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showManualRegistration, setShowManualRegistration] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [isManualRegistering, setIsManualRegistering] = useState(false);

  const { data, isLoading, refetch } = useTournamentsById([id as string]);
  const registerMutation = useRegisterForTournament();
  const unregisterMutation = useUnregisterFromTournament();
  const updateStatusMutation = useUpdateTournamentStatus();
  const bulkRegisterMutation = useBulkRegisterUsers();
  const generateScheduleMutation = useGenerateRandomSchedule();
  const addToWaitlistMutation = useAddToWaitlist();
  const removeFromWaitlistMutation = useRemoveFromWaitlist();

  const tournament = data?.[0];

  // Waitlist players query - only fetch when tournament has waitlist enabled
  const { data: waitlistPlayers, refetch: refetchWaitlist } = useWaitlistPlayers(
    tournament ? parseInt(tournament.id) : 0
  );

  // Get tournament status information
  const currentStatus = (tournament?.status_id || 1) as 1 | 2 | 3 | 4 | 5;
  const tournamentStatusName = tournamentStatusHelpers.getStatusName(currentStatus);
  const availableActions = tournamentStatusHelpers.getAvailableActions(currentStatus);
  const canRegister = tournamentStatusHelpers.canRegister(currentStatus);
  console.log("canRegister", canRegister);
  const canWaitlistRegister = tournamentStatusHelpers.canWaitlistRegister(currentStatus, tournament?.waitlist || false);
  const canEdit = tournamentStatusHelpers.canEdit(currentStatus);

  // Check if should show waitlist button instead of register (status 3 or 4 with waitlist enabled)
  const showWaitlistButton = tournament?.waitlist && (currentStatus === 3 || currentStatus === 4);

  const handleTournamentAction = async (action: keyof typeof ACTION_TO_STATUS) => {
    if (!tournament) return;

    try {
      const nextStatus = tournamentStatusHelpers.getNextStatus(action);
      await updateStatusMutation.mutateAsync({
        tournamentId: parseInt(tournament.id),
        status: nextStatus
      });
      refetch()
    } catch (error) {
      console.error(`Failed to execute ${action}:`, error);
    }
  };

  // Get registered players to check if current user is registered
  const { data: registeredPlayers, isLoading: playersLoading } = useRegisteredPlayers(
    tournament ? parseInt(tournament.id) : 0
  );

  const isUserRegisteredFromServer = userId ? registeredPlayers?.some(player =>
    player.email === email || player.userId === userId.toString()
  ) : false;

  // Use optimistic state if available, otherwise use server state
  const isUserRegistered = optimisticRegistered !== null ? optimisticRegistered : isUserRegisteredFromServer;

  // Check if user is on the waitlist
  const isUserOnWaitlist = userId ? waitlistPlayers?.some(player =>
    player.userId === userId.toString()
  ) : false;

  const isUserAdmin = tournament?.adminId && userId && tournament.adminId.includes(userId);

  // Manual registration function
  const onManualRegisterClick = async () => {
    if (!tournament || !selectedUser) return;

    setIsManualRegistering(true);
    try {
      await registerMutation.mutateAsync({
        id: parseInt(tournament.id),
        userId: selectedUser
      });
      setSelectedUser("");
      setShowManualRegistration(false);
      // The registered players will be refetched automatically due to React Query cache invalidation
    } catch (e) {
      console.error("Manual registration error:", e);
      alert("Failed to register user. Please try again.");
    } finally {
      setIsManualRegistering(false);
    }
  };

  // Waitlist join/leave handler
  const onWaitlistClick = async () => {
    if (!tournament || !userId) return;

    setIsWaitlistAction(true);
    try {
      if (isUserOnWaitlist) {
        // Leave waitlist
        await removeFromWaitlistMutation.mutateAsync({
          tournamentId: parseInt(tournament.id),
          data: { userId: userId.toString() }
        });
      } else {
        // Join waitlist
        await addToWaitlistMutation.mutateAsync({
          tournamentId: parseInt(tournament.id),
          data: { userId: userId.toString() }
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

  const onRegisterClick = async () => {
    if (!tournament || !userId) return;

    const wasRegistered = isUserRegistered;

    // Optimistically update the UI immediately
    setOptimisticRegistered(!wasRegistered);

    try {
      if (wasRegistered) {
        // Unregister logic - use userId to find and remove registration
        await unregisterMutation.mutateAsync({
          tournamentId: parseInt(tournament.id),
          userId: userId.toString()
        });
      } else {
        // Register logic - use userId
        await registerMutation.mutateAsync({
          id: parseInt(tournament.id),
          userId: userId.toString()
        });
      }
      // Refetch to sync with server, then clear optimistic state
      await refetch();
      setOptimisticRegistered(null);
    } catch (e) {
      console.error("Registration error:", e);
      // Revert optimistic update on error
      setOptimisticRegistered(null);
    }
  };

  if (isLoading || (tournament && playersLoading)) {
    return <Spinner size="3" />;
  }

  if (!tournament) {
    return (
        <DetailContainer>
          <NotFoundContainer>
            Tournament not found
          </NotFoundContainer>
        </DetailContainer>
    );
  }

  const adminsFormatted = tournament?.adminName?.length > 0 ? tournament?.adminName.join(", ") : '-';
  const dateFormatted = tournament?.starting_date ? dateFormat(new Date(tournament.starting_date)) : '-';
  const statusName = TOURNAMENT_STATUS_NAMES[tournament?.status_id];

  if (!isUserAdmin) {
    return (
        <DetailContainer>
          <TournamentCard>
            <TournamentGrid>
              <DisplayInfo label="Tournament Name" infoText={tournament.tournament_name || '-'} />
              <DisplayInfo label="Status" infoText={statusName} />
              <DisplayInfo label="Administrators" infoText={adminsFormatted} />
              <DisplayInfo label="Starting Date" infoText={dateFormatted} />

              {tournament.description && (
                <DescriptionContainer>
                  <StyledLabel>Description</StyledLabel>
                  <DescriptionBox dangerouslySetInnerHTML={{ __html: tournament.description }} />
                </DescriptionContainer>
              )}
            </TournamentGrid>

            <RegistrationActionSection
              isUserRegistered={!!isUserRegistered}
              isUserOnWaitlist={!!isUserOnWaitlist}
              showWaitlistButton={!!showWaitlistButton}
              isWaitlistAction={isWaitlistAction}
              canRegister={canRegister}
              onRegisterClick={onRegisterClick}
              onWaitlistClick={onWaitlistClick}
            />
          </TournamentCard>

          <TournamentPlayersList
            tournamentId={tournament.id}
            tournamentStatusId={tournament.status_id}
            onPlayerRemoved={() => refetch()}
            isAdmin={!!isUserAdmin}
          />

          {tournament.waitlist && (
            <TournamentWaitlist
              tournamentId={tournament.id}
              userRole={userRole || 1}
              onPlayerRemoved={() => refetch()}
            />
          )}
        </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <TournamentCard>
        <TournamentGrid>
          <DisplayInfo label="Tournament Name" infoText={tournament.tournament_name || '-'} />
          <DisplayInfo label="Status" infoText={statusName} />
          <DisplayInfo label="Can Register" infoText={canRegister ? 'Yes' : 'No'} />
          <DisplayInfo label="Waitlist Enabled" infoText={tournament?.waitlist ? 'Yes' : 'No'} />
          <DisplayInfo label="Administrators" infoText={adminsFormatted} />
          <DisplayInfo label="Starting Date" infoText={dateFormatted} />

          {tournament.description && (
            <DescriptionContainer>
              <StyledLabel>Description</StyledLabel>
              <DescriptionBox dangerouslySetInnerHTML={{ __html: tournament.description }} />
            </DescriptionContainer>
          )}
        </TournamentGrid>
        <RegistrationActionSection
          isUserRegistered={!!isUserRegistered}
          isUserOnWaitlist={!!isUserOnWaitlist}
          showWaitlistButton={!!showWaitlistButton}
          isWaitlistAction={isWaitlistAction}
          canRegister={canRegister}
          onRegisterClick={onRegisterClick}
          onWaitlistClick={onWaitlistClick}
        />
        <ActionSection>
          <StatusText $type="admin">
            Admin Mode - Tournament Management
          </StatusText>

          <ButtonGroup>
            <EditButton onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel Edit" : "Edit Tournament"}
            </EditButton>
            <ManualRegisterButton onClick={() => setShowManualRegistration(!showManualRegistration)}>
              {showManualRegistration ? "Cancel" : "Register User"}
            </ManualRegisterButton>

            {/* Tournament Action Buttons */}
            {availableActions.map((action) => (
              <ActionButton
                key={action}
                $variant={action.toLowerCase().replace('_', '-') as any}
                onClick={() => handleTournamentAction(action as keyof typeof ACTION_TO_STATUS)}
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? 'Processing...' : tournamentStatusHelpers.getActionLabel(action as keyof typeof ACTION_LABELS)}
              </ActionButton>
            ))}

            <ActionButton
              $variant={tournament?.waitlist ? "waitlist-enabled" : "waitlist-disabled"}
              onClick={() => console.log('Waitlist toggle not implemented yet')}
            >
              {tournament?.waitlist ? "Disable Waitlist" : "Enable Waitlist"}
            </ActionButton>
          </ButtonGroup>
        </ActionSection>
      </TournamentCard>

      {/* Manual Registration Form */}
      {showManualRegistration && (
        <ManualRegistrationForm>
          <FormHeader>
            <FormTitle>
              Register User Manually
            </FormTitle>
            <FormDescription>
              Search and select a user to register for this tournament
            </FormDescription>
          </FormHeader>

          <FormRow>
            <FormField>
              <UserTypeahead
                labelText=""
                selectedItem={selectedUser}
                onSelect={(item: DropdownItemType | null) => setSelectedUser(item?.value || "")}
                onBlur={() => {}}
                placeholder="Type user name or email..."
                css={{ width: '390px' }}
                error={false}
              />
            </FormField>
            <ManualRegisterButton
              onClick={onManualRegisterClick}
              disabled={!selectedUser || isManualRegistering}
            >
              {isManualRegistering ? <Spinner size="1" /> : "Register"}
            </ManualRegisterButton>
          </FormRow>
        </ManualRegistrationForm>
      )}

      {/* Edit Form */}
      {isEditing && (
        <TournamentEditForm
          tournament={tournament as any}
          onSave={() => {
            setIsEditing(false);
            refetch();
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {/* Registered Players List */}
      <TournamentPlayersList
        tournamentId={tournament.id}
        tournamentStatusId={tournament.status_id}
        onPlayerRemoved={() => refetch()}
        isAdmin={!!isUserAdmin}
      />

      {/* Tournament Waitlist - Show if waitlist is enabled */}
      {tournament.waitlist && (
        <TournamentWaitlist
          tournamentId={tournament.id}
          userRole={userRole || 1}
          onPlayerRemoved={() => refetch()}
        />
      )}
    </DetailContainer>
  );
};

export default TournamentDetail;