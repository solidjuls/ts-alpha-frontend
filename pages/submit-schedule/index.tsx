import getAxiosInstance from "utils/axios";
import { useEffect, useState } from "react";
import { getInfoFromCookies } from "utils/cookies";
import { GameRecreate, GameWinner } from "types/game.types";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import useFetchInitialData from "hooks/useFetchInitialData";
import { useRouter } from "next/router";
import SubmitSchedule from "./SubmitSchedule";
import { ScheduleType } from "types/types";

type SubmitFormProps = {
  role: number;
};

export type SubmitFormValue<T> = {
  value: T;
  error: boolean;
};

export type ScheduleFormState = {
  scheduleId: SubmitFormValue<string>;
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

export type RecreateFormNormalizeType = (localForm: ScheduleFormState) => GameRecreate;

type InitializeStateType = (searchParams: ReadonlyURLSearchParams) => ScheduleFormState;
const initializeState: InitializeStateType = (searchParams: ReadonlyURLSearchParams) => {
  const scheduleId = searchParams.get("id") || "";
  const game_code = searchParams.get("gc") || "";
  const gameType = searchParams.get("tid") || "";
  const ussrPlayerId = searchParams.get("idUssr") || "";
  const usaPlayerId = searchParams.get("idUsa") || "";

  return {
    scheduleId: {
      value: scheduleId,
      error: false,
    },
    gameDate: {
      value: new Date(),
      error: false,
    },
    gameWinner: {
      value: "",
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
      value: "",
      error: false,
    },
    endMode: {
      value: "",
      error: false,
    },
    video1: {
      value: "",
      error: false,
    },
  };
};

const RecreateFormContainer = ({ role }: SubmitFormProps) => {
  const searchParams = useSearchParams();
  const [form, setForm] = useState<ScheduleFormState>(() => initializeState(searchParams));
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { data: users, isLoading: loadingUsers } = useFetchInitialData({
    url: "/api/user",
    cacheId: "user-list",
  });
  const { data: tournaments, isLoading: loadingTournaments } = useFetchInitialData({
    url: `/api/game/tournaments?id=${form.gameType.value}`,
    cacheId: "tournament-list",
  });

  const normalizeData: RecreateFormNormalizeType = (localForm: ScheduleFormState) => {
    let payloadObject: ScheduleType = {
      id: localForm.scheduleId.value,
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
      if (key !== "video1" && form[key as keyof ScheduleFormState].value === "") {
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

  const onInputValueChange = (key: keyof ScheduleFormState, value: string | Date) => {
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
          "/api/schedule",
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

  useEffect(() => {
    setForm((prevState: any) => ({
        ...prevState,
        gameType: {
          value: tournaments?.id,
          error: false,
        }
      }));
    }, [tournaments?.id])

  if (loadingTournaments || loadingUsers) return null;

  const usersParsed = users?.map((item) => ({
    value: item.id,
    text: item.name,
  }));

  return (
    <SubmitSchedule
      role={role}
      form={form}
      onSubmit={onSubmit}
      users={usersParsed}
      tournamentId={tournaments?.id.toString()}
      tournamentName={tournaments?.tournament_name}
      onInputValueChange={onInputValueChange}
      buttonDisabled={buttonDisabled}
      setButtonDisabled={setButtonDisabled}
      isSubmitting={isSubmitting}
      setForm={setForm}
      recreate={true}
    />
  );
};

// validate a schedule cannot be submitted twice. add protections to schedule submit form
// check on schedule form that game results are leaded
// change the UI according to the game result
// Add schedule edit functionality. Replace users
// test game recreation/deletion
// allow recreate form to submit any result


// export async function getServerSideProps({ req, res }: ServerType) {
//   const payload = getInfoFromCookies(req, res);

//   if (!payload || payload?.role !== userRoles.SUPERADMIN) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: "/login",
//       },
//     };
//   }
//   return { props: { role: payload.role || null } };
// }

export default RecreateFormContainer;
