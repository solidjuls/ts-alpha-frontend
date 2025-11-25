import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getInfoFromCookies } from "utils/cookies";
import { GameRecreate, GameWinner } from "types/game.types";
import { useSearchParams } from "next/navigation";
import { tournamentStatus, userRoles } from "utils/constants";
import { ServerType } from "types/types";
import { useRouter } from "next/router";
import { useRecreateGame } from "hooks/useRecreateGame";
import { useUsers } from "hooks/useUsers";
import { useTournamentsByStatus } from "hooks/useTournaments";
import SubmitGameForm from "pages/submit-game/SubmitGameForm";

type SubmitFormProps = {
  role: number;
};

// Import the SubmitGameFormData interface from the submit-game page
import { SubmitGameFormData } from "pages/submit-game/index";

// Use SubmitGameFormData directly since we're reusing the same form
type RecreateFormData = SubmitGameFormData;

const validateForm = (data: RecreateFormData) => {
  // Check required fields
  const requiredFields = ['gameWinner', 'gameCode', 'tournamentId', 'ussrPlayerId', 'usaPlayerId', 'endTurn', 'endMode'];
  for (const field of requiredFields) {
    if (!data[field as keyof RecreateFormData]) {
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

const RecreateFormContainer = ({ role }: SubmitFormProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const recreateGameMutation = useRecreateGame();

  // React Query hooks for data fetching
  const { data: usersResponse, isLoading: loadingUsers } = useUsers({});
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
  } = useForm<RecreateFormData>({
    defaultValues: {
      oldId: "",
      gameDate: new Date().toISOString().split('T')[0],
      gameWinner: "",
      gameCode: "",
      tournamentId: "",
      ussrPlayerId: "",
      usaPlayerId: "",
      endTurn: "",
      endMode: "",
      video1: "",
    },
  });

  // Prefill form from URL query parameters
  useEffect(() => {
    if (searchParams) {
      const oldId = searchParams.get("id") || "";
      const gameDate = searchParams.get("gameDate");
      const gameWinner = searchParams.get("gameWinner") as GameWinner;
      const gameCode = searchParams.get("gameCode") || "";
      const tournamentId = searchParams.get("tournamentId") || "";
      const endTurn = searchParams.get("endTurn") || "";
      const endMode = searchParams.get("endMode") || "";
      const video1 = searchParams.get("video1") || "";
      const ussrPlayerId = searchParams.get("idUssr") || "";
      const usaPlayerId = searchParams.get("idUsa") || "";

      if (oldId) setValue("oldId", oldId);
      if (gameDate) setValue("gameDate", gameDate);
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

  const normalizeData = (data: RecreateFormData): GameRecreate => {
    return {
      oldId: data.oldId || "",
      gameDate: data.gameDate || new Date().toISOString(),
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

  const onSubmit = async (data: RecreateFormData) => {
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

  const usersParsed = (Array.isArray(usersResponse) ? usersResponse : usersResponse?.results || []).map((item: any) => ({
    value: item.id,
    text: item.name,
  }));

  const leagueTypes = tournaments?.map((item: any) => ({
    value: item.id.toString(),
    text: item.tournament_name,
  })) || [];

  // Get player names for display
  const usaPlayerId = watch("usaPlayerId");
  const ussrPlayerId = watch("ussrPlayerId");
  const usaPlayerName = usersParsed.find(user => user.value === usaPlayerId)?.text || "";
  const ussrPlayerName = usersParsed.find(user => user.value === ussrPlayerId)?.text || "";

  return (
    <SubmitGameForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      users={usersParsed}
      leagueTypes={leagueTypes}
      errors={errors}
      isSubmitting={isSubmitting}
      watch={watch}
      isScheduleMode={false} // Not schedule mode
      isRecreateMode={true} // Enable recreate mode with editable player fields
      usaPlayerName={usaPlayerName}
      ussrPlayerName={ussrPlayerName}
    />
  );
};

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

export default RecreateFormContainer;
