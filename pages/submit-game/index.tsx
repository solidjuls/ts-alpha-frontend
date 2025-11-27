import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { getInfoFromCookies } from "utils/cookies";
import { GameWinner } from "types/game.types";
import { DropdownItemType, ServerType } from "types/types";

import { useAuth } from "contexts/AuthProviderNew";
import { useAllUsers } from "hooks/useUsers";
import { useOngoingTournamentsWithoutSchedule, useTournamentsById } from "hooks/useTournaments";
import { useSubmitGame } from "hooks/useGames";
import { useRecreateGame } from "hooks/useRecreateGame";
import { UsersListResponse } from "services/users.service";
import { Tournament } from "services/tournaments.service";
import SubmitGameForm from "./SubmitGameForm";

type SubmitGameProps = {
  role: number;
};

export interface SubmitGameFormData {
  gameWinner: GameWinner | "";
  gameCode: string;
  tournamentId: string;
  tournamentName: string;
  opponentWas: string;
  playedAs: string;
  endTurn: string;
  endMode: string;
  video1: string;
  usaPlayerId?: string;
  ussrPlayerId?: string;
  // Recreate mode specific fields
  oldId?: string;
  gameDate?: string;
}

const getTournamentIdFromURL = (id: string | undefined) => {
  if (id) return [id]
  return []
}

const SubmitGameContainer = ({ role }: SubmitGameProps) => {
  const { user } = useAuth();
  const router = useRouter();
  
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<SubmitGameFormData>({
    defaultValues: {
      gameWinner: "",
      gameCode: "",
      tournamentId: "",
      tournamentName: "",
      opponentWas: "",
      playedAs: "",
      endTurn: "",
      endMode: "",
      video1: "",
      usaPlayerId: "",
      ussrPlayerId: "",
      oldId: "",
      gameDate: "",
    },
  });

  const { data: usersResponse, isLoading: loadingUsers } = useAllUsers(1, 2000);

  const { data: tournaments, isLoading: loadingTournaments } = useOngoingTournamentsWithoutSchedule({ enabled: !router?.query?.tid });
  const { data: tournament, isLoading: loadingTournament } = useTournamentsById(getTournamentIdFromURL(router?.query?.tid as string));

  const submitGameMutation = useSubmitGame();
  const recreateGameMutation = useRecreateGame();

  // Detect if we're in recreate mode
  const isRecreateMode = router.query.oldId || router.query.id;

  // Prefill form from URL query parameters
  useEffect(() => {
    if (router.isReady) {
      const {
        // Direct form parameters
        gameCode,
        idUsa,
        idUssr,
        tid: tournamentId,
      } = router.query;

      if (gameCode && typeof gameCode === "string") {
        setValue("gameCode", gameCode);
      }

      if (tournament && tournament[0]) {
        setValue("tournamentName", tournament[0].tournament_name);
      }

      if (idUsa && typeof idUsa === "string") {
        setValue("usaPlayerId", idUsa);
      }

      if (idUssr && typeof idUssr === "string") {
        setValue("ussrPlayerId", idUssr);
      }
    }
  }, [router.isReady, router.query, setValue, user?.id, isRecreateMode, tournament]);

  const getScheduleId = () => {
    if (router?.query?.id) return { scheduleId: router?.query?.id }
    return undefined
  }

  const normalizeData = (data: SubmitGameFormData) => {
    let usaPlayerId = "";
    let ussrPlayerId = "";

    if (data.usaPlayerId && data.ussrPlayerId) {
      usaPlayerId = data.usaPlayerId;
      ussrPlayerId = data.ussrPlayerId;
    }

    else if (data.playedAs === "1") {
      usaPlayerId = user?.id as string;
      ussrPlayerId = data.opponentWas;
    } else if (data.playedAs === "2") {
      ussrPlayerId = user?.id as string;
      usaPlayerId = data.opponentWas;
    }

    const baseData = {
      ...getScheduleId(),
      tournamentId: data.tournamentId || router?.query?.tid,
      usaPlayerId,
      ussrPlayerId,
      gameWinner: data.gameWinner as GameWinner,
      gameCode: data.gameCode,
      endMode: data.endMode,
      endTurn: data.endTurn,
      video1: data.video1 || undefined,
    };

    return baseData;
  };

  const isValidURL = (url: string) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)" +
        "((([a-zA-Z0-9\\-\\_]+\\.)+[a-zA-Z]{2,})|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-zA-Z0-9%_.~+]*)*" +
        "(\\?[;&a-zA-Z0-9%_.~+=-]*)?" +
        "(\\#[-a-zA-Z0-9_]*)?$",
      "i",
    );
    return pattern.test(url);
  };

  const validateForm = (data: SubmitGameFormData) => {
    let isValid = true;

    // Clear previous errors
    clearErrors();

    // Check if video URL is valid (if provided)
    if (data.video1 && !isValidURL(data.video1)) {
      setError("video1", { type: "manual", message: "Invalid URL format" });
      isValid = false;
    }

    // Only validate opponent in direct mode (not schedule mode)
    if (!data.usaPlayerId && !data.ussrPlayerId) {
      // Check if opponent is not the same as current user
      if (data.opponentWas === user?.id) {
        setError("opponentWas", { type: "manual", message: "You cannot play against yourself" });
        isValid = false;
      }
    }

    // Validate end turn and end mode combinations
    if (data.endMode === "Final Scoring" && data.endTurn !== "11") {
      setError("endTurn", { type: "manual", message: "Final Scoring must be on turn 11" });
      setError("endMode", { type: "manual", message: "Final Scoring must be on turn 11" });
      isValid = false;
    }

    if (
      data.endTurn === "11" &&
      data.endMode !== "Final Scoring" &&
      data.endMode !== "Europe Control"
    ) {
      setError("endTurn", { type: "manual", message: "Turn 11 can only end with Final Scoring or Europe Control" });
      setError("endMode", { type: "manual", message: "Turn 11 can only end with Final Scoring or Europe Control" });
      isValid = false;
    }

    // Wargames can only be used if turn 8, 9, 10
    if (data.endMode === "Wargames" && !["8", "9", "10"].includes(data.endTurn)) {
      setError("endTurn", { type: "manual", message: "Wargames can only end on turns 8, 9, or 10" });
      isValid = false;
    }

    // Cuban Missile Crisis cannot be on turns 1, 2, 3
    if (data.endMode === "Cuban Missile Crisis" && ["1", "2", "3"].includes(data.endTurn)) {
      setError("endTurn", { type: "manual", message: "Cuban Missile Crisis cannot end on turns 1, 2, or 3" });
      isValid = false;
    }

    return isValid;
  };

  const onSubmit = async (data: SubmitGameFormData) => {
    if (!user?.id && !isRecreateMode) {
      setError("root", { type: "manual", message: "Error submitting your result. Refresh the page and try again" });
      return;
    }

    if (!validateForm(data)) {
      return;
    }

    try {
      const normalizedData = normalizeData(data);

      await submitGameMutation.mutateAsync(normalizedData);

      router.push("/");
    } catch (e) {
      const errorMessage = isRecreateMode
        ? "There was an error recreating the game"
        : "There was an error submitting the result";
      setError("root", { type: "manual", message: errorMessage });
    }
  };

  if (loadingTournaments || loadingUsers) return null;

  const usersParsed: DropdownItemType[] =
    (usersResponse as UsersListResponse)?.results?.map((item) => ({
      value: item.id,
      text: item.name,
    })) || [];

  const leagueTypes: DropdownItemType[] =
    (tournaments as Tournament[])?.map((item) => ({
      value: item.id.toString(),
      text: item.tournament_name,
    })) || [];

  // Determine if we're in schedule mode (coming from schedule with player IDs)
  const usaPlayerId = watch("usaPlayerId");
  const ussrPlayerId = watch("ussrPlayerId");
  const isScheduleMode = !!(usaPlayerId && ussrPlayerId);

  // Get user names for the player IDs in schedule mode
  const usaPlayerName = usersParsed.find(user => user.value === usaPlayerId)?.text;
  const ussrPlayerName = usersParsed.find(user => user.value === ussrPlayerId)?.text;

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
      isScheduleMode={isScheduleMode}
      usaPlayerName={usaPlayerName}
      ussrPlayerName={ussrPlayerName}
    />
  );
};

export async function getServerSideProps({ req, res }: ServerType) {
  const payload = getInfoFromCookies(req, res);

  // if (!payload) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/login",
  //     },
  //   };
  // }

  // if (payload?.id === "2224") {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/login",
  //     },
  //   };
  // }
  return { props: { role: payload?.role || null } };
}

export default SubmitGameContainer;
