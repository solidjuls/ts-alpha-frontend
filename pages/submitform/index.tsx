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
console.log("formform", form)
  const validated = () => {
    let submit = true;
    Object.keys(form).forEach((key: string) => {
      if (["video1"].includes(key)) {
      } else {
        if (key === "gameCode" && form[key as keyof SubmitFormState].value === "") {
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
        
        if(["endMode","endTurn","gameType","gameWinner","opponentWas","playedAs"].includes(key) && form[key as keyof SubmitFormState].value.length === 0) {
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
    
    if (!submit) return

    if (form["endMode"].value[0].code === "Final Scoring" && form["endTurn"].value[0].code !== "11" ) {
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
    // If turn == final scoring, then end mode must also equal final scoring
    if ((form["endTurn"].value[0].code === "11" && form["endMode"].value[0].code !== "Final Scoring") ) {
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
    if (form["endMode"].value[0].code === "Wargames" && !["8", "9", "10"].includes(form["endTurn"].value[0].code)) {
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

  return (
    <SubmitForm
      validated={validated}
      role={role}
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
