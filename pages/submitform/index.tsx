import { useState } from "react";
import { getInfoFromCookies } from "utils/cookies";
import { GameAPI, GameWinner, TournamentsType } from "types/game.types";
import SubmitForm from "./SubmitForm";
import { DropdownItemType, ServerType } from "types/types";
import getAxiosInstance from "utils/axios";
import { useSession } from "contexts/AuthProvider";
import useFetchInitialData from "hooks/useFetchInitialData";
import { useRouter } from "next/router";
import { UserType } from "types/user.types";
import { tournamentStatus } from "utils/constants";

type SubmitFormProps = {
  role: number;
};

export type SubmitFormValue<T> = {
  value: T;
  error: boolean;
};

export type SubmitFormState = {
  gameWinner: SubmitFormValue<GameWinner | "">;
  gameCode: SubmitFormValue<string>;
  gameType: SubmitFormValue<string>;
  opponentWas: SubmitFormValue<string>;
  playedAs: SubmitFormValue<string>;
  endTurn: SubmitFormValue<string>;
  endMode: SubmitFormValue<string>;
  video1: SubmitFormValue<string>;
};

const initialState: SubmitFormState = {
  gameWinner: {
    value: "",
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

export type SubmitFormNormalizeType = (localForm: SubmitFormState) => GameAPI;

const SubmitFormContainer = ({ role }: SubmitFormProps) => {
  const { id } = useSession();
  const router = useRouter();
  const [form, setForm] = useState<SubmitFormState>(initialState);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const normalizeData: SubmitFormNormalizeType = (localForm: SubmitFormState) => {
    let usaPlayerId = "";
    let ussrPlayerId = "";
    if (localForm.playedAs.value === "1") {
      usaPlayerId = id as string;
      ussrPlayerId = localForm.opponentWas.value;
    } else if (localForm.playedAs.value === "2") {
      ussrPlayerId = id as string;
      usaPlayerId = localForm.opponentWas.value;
    }

    let payloadObject: GameAPI = {
      gameType: localForm.gameType.value,
      usaPlayerId: usaPlayerId,
      ussrPlayerId: ussrPlayerId,
      gameWinner: localForm.gameWinner.value as GameWinner,
      gameCode: localForm.gameCode.value,
      endMode: localForm.endMode.value,
      endTurn: localForm.endTurn.value,
      video1: localForm.video1.value,
    };

    return payloadObject;
  };

  function isValidURL(url: string) {
    const pattern = new RegExp(
      "^(https?:\\/\\/)" + // protocol (http or https)
        "((([a-zA-Z0-9\\-\\_]+\\.)+[a-zA-Z]{2,})|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-zA-Z0-9%_.~+]*)*" + // port and path
        "(\\?[;&a-zA-Z0-9%_.~+=-]*)?" + // query string
        "(\\#[-a-zA-Z0-9_]*)?$",
      "i",
    ); // fragment locator
    return pattern.test(url);
  }

  const validated = () => {
    let submit = true;
    Object.keys(form).forEach((key: string) => {
      if (key !== "video1" && form[key as keyof SubmitFormState].value === "") {
        setForm((prevState: SubmitFormState) => ({
          ...prevState,
          [key]: {
            ...prevState[key as keyof SubmitFormState],
            error: true,
          },
        }));
        submit = false;
      }
    });

    if (!submit) return submit;

    if (form.video1.value && !isValidURL(form.video1.value)) {
      setForm((prevState: any) => ({
        ...prevState,
        ["video1"]: {
          ...prevState["video1"],
          error: true,
        },
      }));
      return false;
    }

    if (form.opponentWas.value === id) {
      setForm((prevState: any) => ({
        ...prevState,
        ["opponentWas"]: {
          ...prevState["opponentWas"],
          error: true,
        },
      }));
      return false;
    }

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

  const onInputValueChange = (key: keyof SubmitFormState, value: string) => {
    if (key === "opponentWas") {
      setForm((prevState) => {
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
        setErrorMsg("An error occurred while submitting the form");
      } finally {
        setIsSubmitting(false);
      }
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
    <SubmitForm
      onSubmit={onSubmit}
      users={usersParsed}
      leagueTypes={leagueTypes}
      form={form}
      isSubmitting={isSubmitting}
      onInputValueChange={onInputValueChange}
      errorMsg={errorMsg}
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
  return { props: { role: payload.role || null } };
}

export default SubmitFormContainer;
