import { useState } from "react";
import { getInfoFromCookies } from "utils/cookies";
import {
  GameAPI,
  GameWinner,
  SubmitFormValue,
  SubmitFormState,
} from "types/game.types";
import SubmitForm from "./SubmitForm";
import { ServerType } from "types/types";
import getAxiosInstance from "utils/axios";
import { useSession } from "contexts/AuthProvider";
import useFetchInitialData from "hooks/useFetchInitialData";
import { useRouter } from "next/router";

type SubmitFormProps = {
  role: number;
};

const initialState: SubmitFormState = {
  gameWinner: {
    value: "1",
    error: false,
  },
  gameCode: {
    value: "",
    error: false,
  },
  gameType: {
    value: "",
    error: false,
  },
  opponentWas: {
    value: "",
    error: false,
  },
  playedAs: {
    value: "",
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

export type SubmitFormNormalizeType = (localForm: any) => GameAPI

const SubmitFormContainer = ({ role }: SubmitFormProps) => {
  const { id } = useSession();
  const router = useRouter();
  const [form, setForm] = useState<SubmitFormState>(initialState);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: users, isLoading: loadingUsers } = useFetchInitialData({ url: "/api/user", cacheId: "user-list" });
  const { data: tournaments, isLoading: loadingTournaments } = useFetchInitialData({
    url: `/api/game/tournaments`,
    cacheId: "tournament-list",
  });

  const normalizeData: SubmitFormNormalizeType = (localForm: SubmitFormState) => {
    
    // if (!recreate) {
    //   if (localForm.playedAs.value[0].code === "1") {
    //     payloadObject["usaPlayerId"] = id;
    //     payloadObject["ussrPlayerId"] = localForm.opponentWas.value[0].code;
    //   } else if (localForm.playedAs.value[0].code === "2") {
    //     payloadObject["ussrPlayerId"] = id;
    //     payloadObject["usaPlayerId"] = localForm.opponentWas.value[0].code;
    //   }
    // } else {
    //   payloadObject["oldId"] = localForm.oldId.value;
    // }
    let usaPlayerId = ''
    let ussrPlayerId = ''
    if (localForm.playedAs.value === "1") {
      usaPlayerId = id as string;
      ussrPlayerId = localForm.opponentWas.value;
    } else if (localForm.playedAs.value === "2") {
      ussrPlayerId = id  as string;
      usaPlayerId = localForm.opponentWas.value;
    }

    let payloadObject: GameAPI = {
      gameType: localForm.gameType.value,
      usaPlayerId: usaPlayerId,
      ussrPlayerId: ussrPlayerId,
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
      if (key !== "video1" && form[key as keyof SubmitFormState].value === "") {
        setForm((prevState: any) => ({
          ...prevState,
          [key]: {
            ...prevState[key],
            error: true,
          },
        }));
        submit = false;
      }
    })

    if (!submit) return submit;

    if (
      form.endMode.value === "Final Scoring" &&
      form.endTurn.value !== "11"
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
    if (
      form.endMode.value === "Wargames" &&
      !["8", "9", "10"].includes(form.endTurn.value)
    ) {
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

  const onInputValueChange = (key: keyof SubmitFormState, value: string | Date) => {
    if (key === "opponentWas") {
      setForm((prevState) => {
        const code = value?.[0]?.code;
        return {
          ...prevState,
          [key]: {
            value,
            error: prevState[key].error ? value === "" : false,
          },
        };
      });
      return;
    }

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
    if (!id) {
      setErrorMsg("Error submitting your result. Refresh the page and try again");
      return;
    }
    if (validated()) {
      try {
        setIsSubmitting(true);
        // @ts-ignore
        await getAxiosInstance().post(
          "/api/game/submit",
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
        console.log("error submitform", e);
        setErrorMsg("There was an error submitting the result");
      } finally {
        setIsSubmitting(false);
      }
    }
  }
  if (loadingTournaments || loadingUsers) return null

  const usersParsed = users?.map((item) => ({
    value: item.id,
    text: item.name,
  }));

  const leagueTypes = tournaments?.map((item) => ({
    value: item.text,
    text: item.text,
  }));

  return (
    <SubmitForm
      onSubmit={onSubmit}
      normalizeData={normalizeData}
      users={usersParsed}
      leagueTypes={leagueTypes}
      form={form}
      isSubmitting={isSubmitting}
      onInputValueChange={onInputValueChange}
      buttonDisabled={buttonDisabled}
      setButtonDisabled={setButtonDisabled}
      setForm={setForm}
    />
  );
};

export async function getServerSideProps({
  req,
  res,
}: ServerType) {
  const payload = getInfoFromCookies(req, res);

  if (!payload) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  return { props: { role: payload.role || null } };
}

export default SubmitFormContainer;
