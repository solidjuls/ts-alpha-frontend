import { useDebounce } from "use-debounce";
import { trpc } from "contexts/APIProvider";
import type { NextApiRequest, NextApiResponse } from "next";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
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

const restoreDataFromAPI = (data: any) => {
  return {
    oldId: {
      value: data.game_code,
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
      value: data.video1,
      error: false,
    },
    video2: {
      value: data.video2,
      error: false,
    },
    video3: {
      value: data.video3,
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
  usaPlayerId: {
    value: "",
    error: false,
  },
  ussrPlayerId: {
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
    value: "http://youtube.com",
    error: false,
  },
  video2: {
    value: "http://youtube.com",
    error: false,
  },
  video3: {
    value: "http://youtube.com",
    error: false,
  },
};

const SubmitFormContainer = ({ role }: SubmitFormProps) => {
  const [form, setForm] = useState<SubmitFormState>(initialState);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [checked, setChecked] = useState(false);

  const [id] = useDebounce(form.oldId.value, 1000);
  const { data, isLoading } = trpc.useQuery(["game-getDataByGame", { id }], {
    enabled: form.oldId.value !== "",
    onSuccess: (data) => {
      if (data) setForm(restoreDataFromAPI(data));
    },
  });

  const validated = () => {
    let submit = true;
    Object.keys(form).forEach((key: string) => {
      if (["video1", "video2", "video3"].includes(key)) {
      } else {
        if (
          (key !== "oldId" &&
            form[key as keyof SubmitFormState].value === "") ||
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
    return submit;
  };

  const onInputValueChange = (
    key: keyof SubmitFormState,
    value: string | Date
  ) => {
    setForm((prevState) => ({
      ...prevState,
      [key]: {
        value,
        error: prevState[key].error ? value === "" : false,
      },
    }));
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
  console.log("payload", payload);
  if (!payload) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  return { props: { role: payload.role } };
}

export default SubmitFormContainer;
