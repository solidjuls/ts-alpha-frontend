import getAxiosInstance from "utils/axios";
import { useState } from "react";
import { getInfoFromCookies } from "utils/cookies";
import { GameRecreate, GameWinner } from "types/game.types";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { tournamentStatus, userRoles } from "utils/constants";
import { ServerType } from "types/types";
import RecreateRating from "pages/recreateform/RecreateRating";
import useFetchInitialData from "hooks/useFetchInitialData";
import { useRouter } from "next/router";

type SubmitFormProps = {
  role: number;
};

export type SubmitFormValue<T> = {
  value: T;
  error: boolean;
};

export type RecreateFormState = {
  oldId: SubmitFormValue<string>;
  gameDate: SubmitFormValue<Date>;
  gameWinner: SubmitFormValue<GameWinner>;
  gameCode: SubmitFormValue<string>;
  gameType: SubmitFormValue<string>;
  ussrPlayerId: SubmitFormValue<string>;
  usaPlayerId: SubmitFormValue<string>;
  endTurn: SubmitFormValue<string>;
  endMode: SubmitFormValue<string>;
  video1: SubmitFormValue<string>;
};

export type RecreateFormNormalizeType = (localForm: RecreateFormState) => GameRecreate;

type InitializeStateType = (searchParams: ReadonlyURLSearchParams) => RecreateFormState;
const initializeState: InitializeStateType = (searchParams: ReadonlyURLSearchParams) => {
  const oldId = searchParams.get("id") || "";
  const gameDate = searchParams.get("gameDate");
  const gameWinner = searchParams.get("gameWinner") as GameWinner;
  const game_code = searchParams.get("game_code") || "";
  const gameType = searchParams.get("gameType") || "";
  const endTurn = searchParams.get("endTurn") || "";
  const endMode = searchParams.get("endMode") || "";
  const video1 = searchParams.get("video1") || "";
  const ussrPlayerId = searchParams.get("ussrPlayerId") || "";
  const usaPlayerId = searchParams.get("usaPlayerId") || "";

  return {
    oldId: {
      value: oldId,
      error: false,
    },
    gameDate: {
      value: gameDate ? new Date(gameDate) : new Date(),
      error: false,
    },
    gameWinner: {
      value: gameWinner,
      error: false,
    },
    gameCode: {
      value: game_code,
      error: false,
    },
    gameType: {
      value: gameType,
      error: false,
    },
    ussrPlayerId: {
      value: ussrPlayerId,
      error: false,
    },
    usaPlayerId: {
      value: usaPlayerId,
      error: false,
    },
    endTurn: {
      value: endTurn,
      error: false,
    },
    endMode: {
      value: endMode,
      error: false,
    },
    video1: {
      value: video1,
      error: false,
    },
  };
};

const RecreateFormContainer = ({ role }: SubmitFormProps) => {
  const searchParams = useSearchParams();
  const [form, setForm] = useState<RecreateFormState>(() => initializeState(searchParams));
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { data: users, isLoading: loadingUsers } = useFetchInitialData({
    url: "/api/user",
    cacheId: "user-list",
  });
  const { data: tournaments, isLoading: loadingTournaments } = useFetchInitialData({
    url: `/api/game/tournaments?status=${tournamentStatus["open"]}`,
    cacheId: "tournament-list",
  });

  const normalizeData: RecreateFormNormalizeType = (localForm: RecreateFormState) => {
    let payloadObject: GameRecreate = {
      oldId: localForm.oldId.value,
      gameDate: localForm.gameDate.value.toISOString(),
      gameType: localForm.gameType.value,
      usaPlayerId: localForm.usaPlayerId.value,
      ussrPlayerId: localForm.ussrPlayerId.value,
      gameWinner: localForm.gameWinner.value,
      gameCode: localForm.gameCode.value,
      endMode: localForm.endMode.value,
      endTurn: localForm.endTurn.value,
      video1: localForm.video1.value,
    };

    return payloadObject;
  };

  const validated = () => {
    let submit = true;
    Object.keys(form).forEach((key: string) => {
      if (key !== "video1" && form[key as keyof RecreateFormState].value === "") {
        setForm((prevState: any) => ({
          ...prevState,
          [key]: {
            ...prevState[key],
            error: true,
          },
        }));
        submit = false;
      }
    });

    if (!submit) return submit;

    if (form.endMode.value === "Final Scoring" && form.endTurn.value !== "11") {
      setForm((prevState: any) => ({
        ...prevState,
        ["endTurn"]: {
          ...prevState["endTurn"],
          error: true,
        },
        ["endMode"]: {
          ...prevState["endMode"],
          error: true,
        },
      }));
      submit = false;
    }

    if (
      form.endTurn.value === "11" &&
      form.endMode.value !== "Final Scoring" &&
      form.endMode.value !== "Europe Control"
    ) {
      setForm((prevState: any) => ({
        ...prevState,
        ["endTurn"]: {
          ...prevState["endTurn"],
          error: true,
        },
        ["endMode"]: {
          ...prevState["endMode"],
          error: true,
        },
      }));
      submit = false;
    }

    // Wargammes can only be used if turn 8, 9, 10
    if (form.endMode.value === "Wargames" && !["8", "9", "10"].includes(form.endTurn.value)) {
      setForm((prevState: any) => ({
        ...prevState,
        ["endTurn"]: {
          ...prevState["endTurn"],
          error: true,
        },
      }));
      submit = false;
    }

    return submit;
  };

  const onInputValueChange = (key: keyof RecreateFormState, value: string | Date) => {
    setForm((prevState) => {
      return {
        ...prevState,
        [key]: {
          value,
          error: prevState[key].error ? value === "" : false,
        },
      };
    });
  };

  const onSubmit = async () => {
    if (validated()) {
      try {
        setIsSubmitting(true);
        // @ts-ignore
        await getAxiosInstance().post(
          "/api/game/recreate",
          {
            data: normalizeData(form),
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
        setErrorMsg(e?.response?.data || "There was an error submitting the result");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loadingTournaments || loadingUsers) return null;

  const usersParsed = users?.map((item) => ({
    value: item.id,
    text: item.name,
  }));

  const leagueTypes = tournaments?.map((item) => ({
    value: item.text,
    text: item.text,
  }));

  return (
    <RecreateRating
      role={role}
      form={form}
      onSubmit={onSubmit}
      users={usersParsed}
      leagueTypes={leagueTypes}
      onInputValueChange={onInputValueChange}
      buttonDisabled={buttonDisabled}
      setButtonDisabled={setButtonDisabled}
      isSubmitting={isSubmitting}
      setForm={setForm}
      recreate={true}
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
