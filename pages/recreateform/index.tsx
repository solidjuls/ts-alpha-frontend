import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { GameRecreate, GameWinner } from "types/game.types";
import { useSearchParams } from "next/navigation";
import { tournamentStatus } from "utils/constants";
import { useRouter } from "next/router";
import { useRecreateGame } from "hooks/useRecreateGame";
import { useAllUsers } from "hooks/useUsers";
import { UsersListResponse } from "services/users.service";
import { useTournamentsByStatus } from "hooks/useTournaments";
import SubmitRecreateForm, { RecreateGameFormData } from "components/RecreateForm/SubmitRecreateForm";

const validateForm = (data: RecreateGameFormData) => {
  // Check required fields
  const requiredFields = ['gameWinner', 'gameCode', 'tournamentId', 'ussrPlayerId', 'usaPlayerId', 'endTurn', 'endMode'];
  for (const field of requiredFields) {
    if (!data[field as keyof RecreateGameFormData]) {
      return false;
    }
  }

  // Final Scoring validation
  if (data.endMode === "Final Scoring" && data.endTurn !== "11") {
    return false;
  }

  // Turn 11 validation
  if (data.endTurn === "11" && data.endMode !== "Final Scoring" && data.endMode !== "Europe Control") {
    return false;
  }

  // Wargames validation
  if (data.endMode === "Wargames" && !["8", "9", "10"].includes(data.endTurn)) {
    return false;
  }

  return true;
};

const RecreateFormContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const recreateGameMutation = useRecreateGame();

  // React Query hooks for data fetching - fetch ALL users without pagination
  const { data: usersResponse, isLoading: loadingUsers } = useAllUsers(1, 2000) as {
    data: UsersListResponse | undefined;
    isLoading: boolean;
  }; // Get first 1000 users
  const { data: tournaments, isLoading: loadingTournaments } = useTournamentsByStatus([
    tournamentStatus.ongoing
  ]);

  // React Hook Form setup
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

  // Prefill form from URL query parameters
  useEffect(() => {
    if (searchParams) {
      const oldId = searchParams.get("id") || "";

      const gameWinner = searchParams.get("gameWinner") as GameWinner;
      const gameCode = searchParams.get("gameCode") || "";
      const tournamentId = searchParams.get("tournamentId") || "";
      const endTurn = searchParams.get("endTurn") || "";
      const endMode = searchParams.get("endMode") || "";
      const video1 = searchParams.get("video1") || "";
      const ussrPlayerId = searchParams.get("ussrPlayerId") || "";
      const usaPlayerId = searchParams.get("usaPlayerId") || "";

      // Prepopulate all form fields from URL parameters
      if (oldId) setValue("oldId", oldId);
      if (gameWinner) setValue("gameWinner", gameWinner);
      if (gameCode) setValue("gameCode", gameCode);
      if (tournamentId) setValue("tournamentId", tournamentId);
      if (endTurn) setValue("endTurn", endTurn);
      if (endMode) setValue("endMode", endMode);
      if (video1) setValue("video1", video1);
      if (ussrPlayerId) setValue("ussrPlayerId", ussrPlayerId);
      if (usaPlayerId) setValue("usaPlayerId", usaPlayerId);
    }
  }, [searchParams, setValue]);

  const normalizeData = (data: RecreateGameFormData): GameRecreate => {
    return {
      oldId: data.oldId || "",
      gameDate: new Date().toISOString(), // Use current date since we removed gameDate field
      tournamentId: data.tournamentId,
      usaPlayerId: data.usaPlayerId || "",
      ussrPlayerId: data.ussrPlayerId || "",
      gameWinner: data.gameWinner as GameWinner,
      gameCode: data.gameCode,
      endMode: data.endMode,
      endTurn: data.endTurn,
      video1: data.video1 || undefined,
    };
  };

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
        message: e?.response?.data || e?.message || "There was an error recreating the game"
      });
    }
  };

  if (loadingTournaments || loadingUsers) return null;

  // Parse users data
  const usersParsed = usersResponse?.results?.map((user: any) => ({
    value: user.id.toString(),
    text: user.name.trim()
  })) || [];

  const leagueTypes = tournaments?.map((item: any) => ({
    value: item.id.toString(),
    text: item.tournament_name,
  })) || [];



  return (
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
  );
};



export default RecreateFormContainer;
