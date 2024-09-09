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
import SubmitForm from "../SubmitForm/SubmitForm";
import RecreateRating from "../SubmitForm/RecreateRating";
import TextComponent from "../SubmitForm/TextComponent";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

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
// {
//   "id": "19173",
//   "created_at": "2024-09-08T16:17:07.000Z",
//   "endMode": "",
//   "endTurn": 0,
//   "usaPlayerId": "2389",
//   "ussrPlayerId": "1807",
//   "usaCountryCode": "CA",
//   "ussrCountryCode": "US",
//   "usaPlayer": "Marty Davis",
//   "ussrPlayer": "Dave Rubin",
//   "gameType": "ITSL 2006 - Season 1",
//   "game_code": "D000",
//   "gameDate": "2005-12-31T23:00:00.000Z",
//   "videoURL": null,
//   "gameWinner": "2",
//   "ratingsUSA": {
//       "rating": 4723,
//       "previousRating": 4819
//   },
//   "ratingsUSSR": {
//       "rating": 4987,
//       "previousRating": 4891
//   }
// }
const initializeState = (searchParams: ReadonlyURLSearchParams) => {
  const oldId = searchParams.get("id");
  const gameDate = searchParams.get("gameDate");
  const gameWinner = searchParams.get("gameWinner") as GameWinner;
  const game_code = searchParams.get("game_code");
  const gameType = searchParams.get("gameType");
  const endTurn = searchParams.get("endTurn");
  const endMode = searchParams.get("endMode");
  const video1 = searchParams.get("video1");

  return {
    oldId: {
      value: oldId ? oldId : "",
      error: false,
    },
    gameDate: {
      value: gameDate ? new Date(gameDate) : new Date(),
      error: false,
    },
    gameWinner: {
      value: gameWinner ? gameWinner : null,
      error: false,
    },
    gameCode: {
      value: game_code ? game_code : "",
      error: false,
    },
    gameType: {
      value: gameType ? gameType : "",
      error: false,
    },
    ussrPlayerId: {
      value: "",
      error: false,
    },
    usaPlayerId: {
      value: "",
      error: false,
    },
    endTurn: {
      value: endTurn ? endTurn : "",
      error: false,
    },
    endMode: {
      value: endMode ? endMode : "",
      error: false,
    },
    video1: {
      value: video1 ? video1 : "",
      error: false,
    },
  };
};

const RecreateFormContainer = ({ role }: SubmitFormProps) => {
  const searchParams = useSearchParams();
  const [form, setForm] = useState<SubmitFormState>(() => initializeState(searchParams));
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
    // Wargammes can only be used if turn 8, 9, 10
    if (form["endMode"].value === "Wargames" && !["8", "9", "10"].includes(form["endTurn"].value)) {
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
      setChecked={setChecked}
      form={form}
      onInputValueChange={onInputValueChange}
      buttonDisabled={buttonDisabled}
      setButtonDisabled={setButtonDisabled}
      setForm={setForm}
      recreate={true}
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

export default RecreateFormContainer;
