import React, { useEffect } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { Spinner } from "@radix-ui/themes";
import { GameRecreate, GameWinner } from "types/game.types";
import { tournamentStatus, userRoles } from "utils/constants";
import { useRecreateGame } from "hooks/useRecreateGame";
import { useAllUsers } from "hooks/useUsers";
import { UsersListResponse } from "services/users.service";
import { useTournamentsByStatus } from "hooks/useTournaments";
import SubmitRecreateForm, { RecreateGameFormData } from "components/RecreateForm/SubmitRecreateForm";
import ProtectedRoute from "components/ProtectedRoute";
import { 
  PageContainer,
  PageHeader,
  Title,
  ContentWrapper,
  LoadingArea,
  ErrorBox
  ,ErrorMessage,
  ErrorTitle
 } from "styles/recreateForm.styled";


/* -----------------------
   Validation
------------------------ */

const validateForm = (data: RecreateGameFormData) => {
  const requiredFields: (keyof RecreateGameFormData)[] = [
    "gameWinner",
    "gameCode",
    "tournamentId",
    "ussrPlayerId",
    "usaPlayerId",
    "endTurn",
    "endMode",
  ];

  for (const field of requiredFields) {
    if (!data[field]) return false;
  }

  if (data.endMode === "Final Scoring" && data.endTurn !== "11") return false;

  if (data.endTurn === "11" && data.endMode !== "Final Scoring" && data.endMode !== "Europe Control") {
    return false;
  }

  if (data.endMode === "Wargames" && !["8", "9", "10"].includes(data.endTurn)) {
    return false;
  }

  return true;
};

/* -----------------------
   Page
------------------------ */

const RecreateFormContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const recreateGameMutation = useRecreateGame();

  const {
    data: usersResponse,
    isLoading: loadingUsers,
    error: usersError,
  } = useAllUsers(1, 3000) as {
    data: UsersListResponse | undefined;
    isLoading: boolean;
    error?: any;
  };

  const {
    data: tournaments,
    isLoading: loadingTournaments,
    error: tournamentsError,
  } = useTournamentsByStatus([tournamentStatus.ongoing]);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RecreateGameFormData>({
    defaultValues: {
      oldId: "",
      scheduleId: "",
      gameCode: "",
      usaPlayerId: "",
      ussrPlayerId: "",
      tournamentId: "",
      gameWinner: "",
      endTurn: "",
      endMode: "",
      video1: "",
    },
  });

  useEffect(() => {
    if (!searchParams) return;

    const oldId = searchParams.get("id") || "";
    const gameWinner = searchParams.get("gameWinner") as GameWinner;
    const gameCode = searchParams.get("gameCode") || "";
    const tournamentId = searchParams.get("tournamentId") || "";
    const endTurn = searchParams.get("endTurn") || "";
    const endMode = searchParams.get("endMode") || "";
    const video1 = searchParams.get("video1") || "";
    const ussrPlayerId = searchParams.get("ussrPlayerId") || "";
    const usaPlayerId = searchParams.get("usaPlayerId") || "";

    if (oldId) setValue("oldId", oldId);
    if (gameWinner) setValue("gameWinner", gameWinner);
    if (gameCode) setValue("gameCode", gameCode);
    if (tournamentId) setValue("tournamentId", tournamentId);
    if (endTurn) setValue("endTurn", endTurn);
    if (endMode) setValue("endMode", endMode);
    if (video1) setValue("video1", video1);
    if (ussrPlayerId) setValue("ussrPlayerId", ussrPlayerId);
    if (usaPlayerId) setValue("usaPlayerId", usaPlayerId);
  }, [searchParams, setValue]);

  const normalizeData = (data: RecreateGameFormData): GameRecreate => ({
    oldId: data.oldId || "",
    scheduleId: data.scheduleId || undefined,
    gameDate: new Date().toISOString(),
    tournamentId: data.tournamentId,
    usaPlayerId: data.usaPlayerId || "",
    ussrPlayerId: data.ussrPlayerId || "",
    gameWinner: data.gameWinner as GameWinner,
    gameCode: data.gameCode,
    endMode: data.endMode,
    endTurn: data.endTurn,
    video1: data.video1 || undefined,
  });

  const onSubmit = async (data: RecreateGameFormData) => {
    if (!validateForm(data)) {
      setError("root", { type: "manual", message: "Please check your form inputs" });
      return;
    }

    try {
      await recreateGameMutation.mutateAsync(normalizeData(data));
      router.push("/");
    } catch (e: any) {
      setError("root", {
        type: "manual",
        message: e?.response?.data || e?.message || "There was an error recreating the game",
      });
    }
  };

  const isLoading = loadingTournaments || loadingUsers;
  const loadError = usersError || tournamentsError;

  const usersParsed =
    usersResponse?.results?.map((user: any) => ({
      value: user.id.toString(),
      text: user.name.trim(),
    })) || [];

  const leagueTypes =
    tournaments?.map((item: any) => ({
      value: item.id.toString(),
      text: item.tournament_name,
    })) || [];

  return (
    <PageContainer>
      <PageHeader>
          <Title>Recreate Game</Title>
      </PageHeader>

      <ContentWrapper>
        {isLoading ? (
          <LoadingArea>
            <Spinner size="3" />
          </LoadingArea>
        ) : loadError ? (
          <LoadingArea>
            <ErrorBox>
              <ErrorTitle>Error Loading Form Data</ErrorTitle>
              <ErrorMessage>Please refresh and try again.</ErrorMessage>
            </ErrorBox>
          </LoadingArea>
        ) : (
          <SubmitRecreateForm
            control={control}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            users={usersParsed}
            leagueTypes={leagueTypes}
            errors={errors}
            isSubmitting={isSubmitting}
            watch={watch}
          />
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

const RecreateFormPage = () => (
  <ProtectedRoute requiredRole={userRoles.SUPERADMIN}>
    <RecreateFormContainer />
  </ProtectedRoute>
);

export default RecreateFormPage;
