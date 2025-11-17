import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { getInfoFromCookies } from "utils/cookies";
import { GameWinner, TournamentsType } from "types/game.types";
import { DropdownItemType, ServerType } from "types/types";
import getAxiosInstance from "utils/axios";
import { useSession } from "contexts/AuthProvider";
import useFetchInitialData from "hooks/useFetchInitialData";
import { UserType } from "types/user.types";
import { tournamentStatus } from "utils/constants";
import SubmitGameForm from "./SubmitGameForm";

type SubmitGameProps = {
  role: number;
};

export interface SubmitGameFormData {
  gameWinner: GameWinner | "";
  gameCode: string;
  gameType: string;
  opponentWas: string;
  playedAs: string;
  endTurn: string;
  endMode: string;
  video1: string;
}

const SubmitGameContainer = ({ role }: SubmitGameProps) => {
  const { id } = useSession();
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
      gameType: "",
      opponentWas: "",
      playedAs: "",
      endTurn: "",
      endMode: "",
      video1: "",
    },
  });

  const { data: users, isLoading: loadingUsers } = useFetchInitialData<UserType[]>({
    url: "/api/user",
    cacheId: "user-list",
  });
  
  const { data: tournaments, isLoading: loadingTournaments } = useFetchInitialData<
    TournamentsType[]
  >({
    url: `/api/game/tournaments?status=${tournamentStatus["open"]}`,
    cacheId: "tournament-list",
  });

  // Prefill form from URL query parameters
  useEffect(() => {
    if (router.isReady) {
      const {
        gameWinner,
        gameCode,
        gameType,
        opponentWas,
        playedAs,
        endTurn,
        endMode,
        video1,
      } = router.query;

      if (gameWinner && typeof gameWinner === "string") {
        setValue("gameWinner", gameWinner as GameWinner);
      }
      if (gameCode && typeof gameCode === "string") {
        setValue("gameCode", gameCode);
      }
      if (gameType && typeof gameType === "string") {
        setValue("gameType", gameType);
      }
      if (opponentWas && typeof opponentWas === "string") {
        setValue("opponentWas", opponentWas);
      }
      if (playedAs && typeof playedAs === "string") {
        setValue("playedAs", playedAs);
      }
      if (endTurn && typeof endTurn === "string") {
        setValue("endTurn", endTurn);
      }
      if (endMode && typeof endMode === "string") {
        setValue("endMode", endMode);
      }
      if (video1 && typeof video1 === "string") {
        setValue("video1", video1);
      }
    }
  }, [router.isReady, router.query, setValue]);

  const normalizeData = (data: SubmitGameFormData) => {
    let usaPlayerId = "";
    let ussrPlayerId = "";
    
    if (data.playedAs === "1") {
      usaPlayerId = id as string;
      ussrPlayerId = data.opponentWas;
    } else if (data.playedAs === "2") {
      ussrPlayerId = id as string;
      usaPlayerId = data.opponentWas;
    }

    return {
      gameType: data.gameType,
      usaPlayerId,
      ussrPlayerId,
      gameWinner: data.gameWinner as GameWinner,
      gameCode: data.gameCode,
      endMode: data.endMode,
      endTurn: data.endTurn,
      video1: data.video1 || undefined,
    };
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

    // Check if opponent is not the same as current user
    if (data.opponentWas === id) {
      setError("opponentWas", { type: "manual", message: "You cannot play against yourself" });
      isValid = false;
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
    if (!id) {
      setError("root", { type: "manual", message: "Error submitting your result. Refresh the page and try again" });
      return;
    }

    if (!validateForm(data)) {
      return;
    }

    try {
      await getAxiosInstance().post(
        "/api/games/submit",
        {
          data: normalizeData(data),
        },
        {
          cache: {
            update: {
              "game-list": "delete",
            },
          },
        },
      );
      router.push("/");
    } catch (e) {
      console.log("error submit-game", e);
      setError("root", { type: "manual", message: "There was an error submitting the result" });
    }
  };

  if (loadingTournaments || loadingUsers) return null;

  const usersParsed: DropdownItemType[] =
    users?.map((item) => ({
      value: item.id,
      text: item.name,
    })) || [];

  const leagueTypes: DropdownItemType[] =
    tournaments?.map((item) => ({
      value: item.id.toString(),
      text: item.tournament_name,
    })) || [];

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
    />
  );
};

export async function getServerSideProps({ req, res }: ServerType) {
  const payload = getInfoFromCookies(req, res);

  if (!payload) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  if (payload?.id === "2224") {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  return { props: { role: payload.role || null } };
}

export default SubmitGameContainer;
