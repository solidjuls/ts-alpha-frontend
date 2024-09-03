import { useDebounce } from "use-debounce";
import type { NextApiRequest, NextApiResponse } from "next";
import { useState, useEffect, SetStateAction, Dispatch, useMemo } from "react";
import { getInfoFromCookies } from "utils/cookies";
import {
  GameAPI,
  GameWinner,
  GameRecreate,
  SubmitFormValue,
  SubmitFormState,
} from "types/game.types";
import SubmitForm from "./SubmitForm";

type SubmitFormProps = {
  role: number;
};

const restoreDataFromAPI = (data: any, id: any) => {
  return {
    oldId: {
      value: id,
      error: false,
    },
    gameDate: {
      value: data.game_date,
      error: false,
    },
    gameWinner: {
      value: data.game_winner,
      error: false,
    },
    gameCode: {
      value: data.game_code,
      error: false,
    },
    gameType: {
      value: data.game_type,
      error: false,
    },
    usaPlayerId: {
      value: data.usa_player_id.toString(),
      error: false,
    },
    ussrPlayerId: {
      value: data.ussr_player_id.toString(),
      error: false,
    },
    endTurn: {
      value: data.end_turn.toString(),
      error: false,
    },
    endMode: {
      value: data.end_mode,
      error: false,
    },
    video1: {
      value: data.video1 || "",
      error: false,
    },
  };
};

const initialState: SubmitFormState = {
  oldId: {
    value: "",
    error: false,
  },
  gameDate: {
    value: new Date(),
    error: false,
  },
  gameWinner: {
    value: null,
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

const SubmitFormContainer = ({ role }: SubmitFormProps) => {
  const [form, setForm] = useState<SubmitFormState>(initialState);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [checked, setChecked] = useState(false);

  const validated = () => {
    let submit = true;
    Object.keys(form).forEach((key: string) => {
      if (["video1"].includes(key)) {
      } else {
        if (
          (key !== "oldId" && form[key as keyof SubmitFormState].value === "") ||
          (checked && form[key as keyof SubmitFormState].value === "")
        ) {
          // form[key].error = true;
          setForm((prevState: any) => ({
            ...prevState,
            [key]: {
              ...prevState[key],
              error: true,
            },
          }));
          submit = false;
        }
      }
    });
    // If turn == final scoring, then end mode must also equal final scoring
    if (form["endTurn"].value === "11" && form["endMode"].value !== "Final Scoring") {
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
    return submit;
  };

  const onInputValueChange = (key: keyof SubmitFormState, value: string | Date) => {
    setForm((prevState) => {
      console.log("key value", prevState, key, value);
      return {
        ...prevState,
        [key]: {
          value,
          error: prevState[key].error ? value === "" : false,
        },
      };
    });
  };

  return (
    <SubmitForm
      validated={validated}
      role={role}
      checked={checked}
      setChecked={setChecked}
      form={form}
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
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
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
