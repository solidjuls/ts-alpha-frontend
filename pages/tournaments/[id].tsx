import { useMemo, useState } from "react";
import { Spinner } from "@radix-ui/themes";
import Link from "next/link";
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
  useToggleWaitlist,
  useGenerateResultText,
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
import LabelCopy from "components/LabelCopy/LabelCopy";
import { LabelCopyBox } from "components/LabelCopy/LabelCopyBox";
import { Checkbox } from "components/Checkbox/Checkbox";
import countryFlags from "public/country_flags.json";
import { getWinnerText } from "utils/games";
import type { GameWinner } from "types/game.types";
import type { ResultTextItem } from "services/tournaments.service";
import {
  tournamentStatusHelpers,
  ACTION_TO_STATUS,
  ACTION_LABELS,
  TOURNAMENT_STATUS_NAMES,
} from "utils/tournamentStatus";
import { useIsAuthenticated } from "hooks/useAuth";
import { 
  Page,
  Card,
  CardBody,
  CardFooter,
  InlineFormCard,
  HeaderRow,
  Title,
  Badge,
  Subtle,
  InfoGrid,
  FullWidth,
  DescriptionBox,
  AdminBar,
  AdminLabel,
  ButtonRow,
  PillButton,
  StatusLine,
  StatusText,
  NotFoundContainer,
  FormDescription,
  FormField,
  FormHeader,
  FormRow,
  FormTitle,
  Flex
 } from "styles/tournamentPage.styled";
 import { DangerButton } from "components/DangerButton/DangerButton";

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
        <StatusText $tone="good">✓ You are registered for this tournament.</StatusText>
      );
    }
    if (isUserOnWaitlist) {
      return <StatusText $tone="warn">You are on the waitlist for this tournament.</StatusText>;
    }
    if (showWaitlistButton) {
      return <StatusText $tone="neutral">Registration closed. Join the waitlist.</StatusText>;
    }
    return <StatusText $tone="neutral">Click to register for this tournament.</StatusText>;
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
  const [showTextResults, setShowTextResults] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [withVideo, setWithVideo] = useState(false);
  const [resultTextItems, setResultTextItems] = useState<ResultTextItem[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);

  const { data, isLoading, refetch } = useTournamentsById([id as string]);

  const registerMutation = useRegisterForTournament();
  const unregisterMutation = useUnregisterFromTournament();
  const updateStatusMutation = useUpdateTournamentStatus();
  const addToWaitlistMutation = useAddToWaitlist();
  const removeFromWaitlistMutation = useRemoveFromWaitlist();
  const toggleWaitlistMutation = useToggleWaitlist();
  const generateResultTextMutation = useGenerateResultText();

  const tournament = data?.[0];

  const enableWaitlistCall = tournament && tournament.waitlist;
  const { data: waitlistPlayers, refetch: refetchWaitlist } = useWaitlistPlayers(
    enableWaitlistCall ? parseInt(tournament.id) : 0
  );

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
          <NotFoundContainer>Tournament Not Found</NotFoundContainer>
        </Page>
      </DetailContainer>
    );
  }

  const currentStatus = (tournament?.status_id || 1) as 1 | 2 | 3 | 4 | 5;
  const canRegister = tournamentStatusHelpers.canRegister(currentStatus);
  const availableActions = tournamentStatusHelpers.getAvailableActions(currentStatus);

  const showWaitlistButton =
    tournament.waitlist && (currentStatus === 3 || currentStatus === 4);

  const adminsFormatted = tournament.adminName?.length
  ? tournament.adminName.map((name, index) => (
      <span key={tournament.adminId[index]}>
        <Link href={`/userprofile/${tournament.adminId[index]}`}>
          {name}
        </Link>
        {index < tournament.adminName.length - 1 && ", "}
      </span>
    ))
  : "-";


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
    if (!userId) {
      router.push("/login");
      return;
    }

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

  interface CountryFlags {
    [countryCode: string]: string;
  }

  const generateResultTextString = (item: ResultTextItem): string => {
    const flags: CountryFlags = countryFlags as CountryFlags;
    const endTurnText =
      item.endTurn === 11 ? "Final Scoring" : `Turn ${item.endTurn}`;
    const endModeText = item.endMode ?? "";

    if (item.gameWinner === "3") {
      return `${item.tournamentName}: ${item.game_code} - ${item.usaPlayer} ${flags[item.usaCountryCode?.toLowerCase()]} (USA) tied with ${item.ussrPlayer} ${flags[item.ussrCountryCode?.toLowerCase()]} in ${endTurnText} (${endModeText})`;
    }

    let winnerName = "";
    let loserName = "";

    if (item.gameWinner === "1") {
      winnerName = `${item.usaPlayer} ${flags[item.usaCountryCode?.toLowerCase()]}`;
      loserName = `${item.ussrPlayer} ${flags[item.ussrCountryCode?.toLowerCase()]}`;
    } else if (item.gameWinner === "2") {
      winnerName = `${item.ussrPlayer} ${flags[item.ussrCountryCode?.toLowerCase()]}`;
      loserName = `${item.usaPlayer} ${flags[item.usaCountryCode?.toLowerCase()]}`;
    }

    if (item.videoURL) {
      return `${item.tournamentName}: ${item.game_code} - ${winnerName} (${getWinnerText(
        item.gameWinner as GameWinner
      )}) vs ${loserName} in ${endTurnText} (${endModeText})\n${item.videoURL}`;
    }

    return `${item.tournamentName}: ${item.game_code} - ${winnerName} (${getWinnerText(
      item.gameWinner as GameWinner
    )}) has defeated ${loserName} in ${endTurnText} (${endModeText})`;
  };

  const handleGenerateResultText = async () => {
    if (!tournament || !startDate || !endDate) return;

    try {
      const result = await generateResultTextMutation.mutateAsync({
        tournamentId: parseInt(tournament.id),
        startDate,
        endDate,
        video: withVideo ? 1 : 0,
      });
      setResultTextItems(result);
    } catch (e) {
      console.error("Generate result text error:", e);
      alert("Failed to generate result text. Please try again.");
    }
  };

  const handleCopyAll = async () => {
    const allText = resultTextItems.map(generateResultTextString).join("\n\n");
    try {
      await navigator.clipboard.writeText(allText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (e) {
      console.error("Failed to copy text: ", e);
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
              <AdminLabel>Tournament Management</AdminLabel>

              <ButtonRow>
                <PillButton onClick={() => setIsEditing((v) => !v)}>
                  {isEditing ? "Cancel Edit" : "Edit Tournament"}
                </PillButton>

                <PillButton onClick={() => setShowManualRegistration((v) => !v)}>
                  {showManualRegistration ? "Cancel Registration" : "Register User"}
                </PillButton>

                <PillButton onClick={() => setShowTextResults((v) => !v)}>
                  {showTextResults ? "Cancel Text Results" : "Text Results"}
                </PillButton>

                {availableActions.map((action) => {
                  const isCloseTournament =
                    action === "CLOSE_TOURNAMENT" || action === "close_tournament";

                  const Btn = isCloseTournament ? DangerButton : PillButton;

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
              onClick={() => toggleWaitlistMutation.mutate(parseInt(tournament.id))}
              disabled={toggleWaitlistMutation.isPending}
            >
              {toggleWaitlistMutation.isPending
                ? <Spinner size="1" />
                : tournament.waitlist ? "Disable Waitlist" : "Enable Waitlist"}
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

        {/* Text Results */}
        {isUserAdmin && showTextResults && (
          <InlineFormCard>
            <CardBody>
              <FormHeader>
                <FormTitle>Generate Result Text</FormTitle>
                <FormDescription>
                  Select a date range and generate result text for games played in that period.
                </FormDescription>
              </FormHeader>

              <FormRow style={{ alignItems: "flex-end" }}>
                <FormField>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 600 }}>From</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      background: "var(--bg-card)",
                      color: "var(--primary-text)",
                    }}
                  />
                </FormField>

                <FormField>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: 600 }}>To</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      background: "var(--bg-card)",
                      color: "var(--primary-text)",
                    }}
                  />
                </FormField>

                <div style={{ paddingBottom: "1px" }}>
                  <Checkbox
                    checked={withVideo}
                    text="with video"
                    onCheckedChange={setWithVideo}
                  />
                </div>

                <PillButton
                  onClick={handleGenerateResultText}
                  disabled={!startDate || !endDate || generateResultTextMutation.isPending}
                >
                  {generateResultTextMutation.isPending ? (
                    <Spinner size="1" />
                  ) : (
                    "Get the results"
                  )}
                </PillButton>
              </FormRow>

              {resultTextItems.length > 0 && (
                <LabelCopyBox>
                  {resultTextItems.map((item, index) => (
                    <div key={index} style={{ marginBottom: index < resultTextItems.length - 1 ? "8px" : 0 }}>
                      <LabelCopy text={generateResultTextString(item)} />
                    </div>
                  ))}
                  <div style={{ marginTop: "12px", textAlign: "right" }}>
                    <PillButton onClick={handleCopyAll}>
                      {copiedAll ? "Copied!" : "Copy All"}
                    </PillButton>
                  </div>
                </LabelCopyBox>
              )}
            </CardBody>
          </InlineFormCard>
        )}

        <Flex>
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
              isAdmin={isUserAdmin}
            />
          )}
        </Flex>
      </Page>
    </DetailContainer>
  );
};

export default TournamentDetail;
