import type { NextApiRequest, NextApiResponse } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { trpc } from "contexts/APIProvider";
import { TextComponent } from "./TextComponent";
import { DateComponent } from "./DateComponent";
import {
  gameWinningOptions,
  endType,
  turns,
  leagueTypes,
} from "utils/constants";
import DropdownMenu, { DropdownItemType } from "components/DropdownMenu";
import { Button } from "components/Button";
import { Box, Form } from "components/Atoms";
import WithLabel from "./WithLabel";
import UserTypeahead from "./UserTypeahead";
import { getInfoFromCookies } from "utils/cookies";
import { GameAPI, GameWinner, GameRecreate } from "types/game.types";

const formStyles = {
  alignItems: "center",
  backgroundColor: "White",
  width: "640px",
  alignSelf: "center",
  //boxShadow: "rgb(100 100 111 / 20%) 0px 7px 29px 0px",
  padding: "12px",
};

const dropdownWidth = "270px";
const typeaheadWidth = "250px";

type SubmitFormProps = {
  role: number;
};

type SubmitFormValue<T> = {
  value: T;
  error: boolean;
};

type SubmitFormState = {
  gameRecreateId: SubmitFormValue<string>;
  gameDate: SubmitFormValue<Date>;
  gameWinner: SubmitFormValue<GameWinner>;
  gameCode: SubmitFormValue<string>;
  gameType: SubmitFormValue<string>;
  usaPlayerId: SubmitFormValue<string>;
  ussrPlayerId: SubmitFormValue<string>;
  endTurn: SubmitFormValue<string>;
  endMode: SubmitFormValue<string>;
  video1: SubmitFormValue<string>;
  video2: SubmitFormValue<string>;
  video3: SubmitFormValue<string>;
};

type DropdownWithLabelProps = {
  labelText: string;
  selectedItem: string;
  onSelect: (value: string) => void;
  items: DropdownItemType[];
  selectedValueProperty?: string;
  selectedInputProperty?: string;
  error: boolean;
  css: any;
};

const normalizeData = (form: any) => {
  let payloadObject: any = {};
  Object.keys(form).map((key: string) => {
    payloadObject[key] = form[key].value;
  });
  return payloadObject;
};

const DropdownWithLabel = ({
  labelText,
  selectedItem,
  onSelect,
  items,
  error,
  css,
  ...rest
}: DropdownWithLabelProps) => (
  <WithLabel labelText={labelText}>
    <DropdownMenu
      items={items}
      selectedItem={selectedItem}
      onSelect={onSelect}
      css={css}
      {...rest}
      error={error}
    />
  </WithLabel>
);

const initialState: SubmitFormState = {
  gameRecreateId: {
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

const validated = (form: any, setForm: any) => {
  let submit = true;
  if (form["usaPlayerId"].value === form["ussrPlayerId"].value) {
    setForm((prevState: any) => ({
      ...prevState,
      ["usaPlayerId"]: {
        ...prevState["usaPlayerId"],
        error: true,
      },
      ["ussrPlayerId"]: {
        ...prevState["ussrPlayerId"],
        error: true,
      },
    }));
    return false;
  }

  Object.keys(form).forEach((key: string) => {
    if (["video1", "video2", "video3"].includes(key)) {
    } else {
      if (form[key].value === "") {
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

const SubmitForm = ({ role }: SubmitFormProps) => {
  const router = useRouter();
  const [form, setForm] = useState<SubmitFormState>(initialState);
  const [disabled, setDisabled] = useState(false);

  const gameSubmitMutation = trpc.useMutation(["game-submit"], {
    onSuccess: () => setDisabled(false),
    onError: (error, variables, context) => setDisabled(false),
    onSettled: () => setDisabled(false),
  });

  useEffect(() => {
    async function submitMutate() {
      if (disabled === true) {
        await gameSubmitMutation.mutate({
          data: normalizeData(form),
        });
        router.push("/");
      }
    }
    submitMutate();
  }, [disabled]);

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
    <Form css={formStyles} onSubmit={(e) => e.preventDefault()}>
      {role === 2 && (
        <TextComponent
          labelText="gameRecreateId"
          inputValue={form.gameRecreateId.value}
          onInputValueChange={(value) =>
            onInputValueChange("gameRecreateId", value)
          }
          css={{ width: "50px" }}
          error={form.gameRecreateId.error}
        />
      )}
      <Box css={{ flexDirection: "column", alignItems: "flex-start" }}>
        <TextComponent
          labelText="checkID"
          inputValue={form.gameCode.value}
          onInputValueChange={(value) => onInputValueChange("gameCode", value)}
          css={{ width: "50px" }}
          error={form.gameCode.error}
        />
        <DropdownWithLabel
          labelText="typeOfGame"
          items={leagueTypes}
          selectedItem={form.gameType.value}
          selectedValueProperty="value"
          selectedInputProperty="text"
          error={form.gameType.error}
          css={{ width: dropdownWidth }}
          onSelect={(value) => onInputValueChange("gameType", value)}
        />
        <UserTypeahead
          labelText="playerUSA"
          selectedItem={form.usaPlayerId.value}
          selectedValueProperty="value"
          selectedInputProperty="text"
          error={form.usaPlayerId.error}
          css={{ width: typeaheadWidth }}
          onSelect={(value: any) =>
            onInputValueChange("usaPlayerId", value?.value)
          }
          onBlur={() => onInputValueChange("usaPlayerId", "")}
        />
        <UserTypeahead
          labelText="playerURSS"
          selectedItem={form.ussrPlayerId.value}
          error={form.ussrPlayerId.error}
          css={{ width: typeaheadWidth }}
          selectedValueProperty="value"
          selectedInputProperty="text"
          onSelect={(value: any) =>
            onInputValueChange("ussrPlayerId", value?.value)
          }
          onBlur={() => onInputValueChange("ussrPlayerId", "")}
        />
        <DropdownWithLabel
          labelText="gameWinner"
          items={gameWinningOptions}
          selectedItem={form.gameWinner.value as string}
          error={form.gameWinner.error}
          css={{ width: dropdownWidth }}
          onSelect={(value: string) => onInputValueChange("gameWinner", value)}
        />
        <DropdownWithLabel
          labelText="endTurn"
          items={turns}
          error={form.endTurn.error}
          selectedItem={form.endTurn.value}
          css={{ width: dropdownWidth }}
          onSelect={(value: string) => onInputValueChange("endTurn", value)}
        />
        <DropdownWithLabel
          labelText="endType"
          items={endType}
          error={form.endMode.error}
          css={{ width: dropdownWidth }}
          selectedItem={form.endMode.value}
          onSelect={(value: string) => onInputValueChange("endMode", value)}
        />
        <DateComponent
          labelText="gameDate"
          inputValue={form.gameDate.value}
          // error={form.gameDate.error}
          onInputValueChange={(value: Date) =>
            onInputValueChange("gameDate", value)
          }
        />
        <TextComponent
          labelText="videoLink1"
          inputValue={form.video1.value}
          error={form.video1.error}
          onInputValueChange={(value: string) =>
            onInputValueChange("video1", value)
          }
        />
        <TextComponent
          labelText="videoLink2"
          inputValue={form.video2.value}
          error={form.video2.error}
          onInputValueChange={(value) => onInputValueChange("video2", value)}
        />
        <TextComponent
          labelText="videoLink3"
          inputValue={form.video3.value}
          error={form.video3.error}
          onInputValueChange={(value) => onInputValueChange("video3", value)}
        />
        <Button
          disabled={disabled}
          onClick={() => {
            if (validated(form, setForm)) {
              setDisabled(true);
            }
          }}
        >
          Submit
        </Button>
      </Box>
    </Form>
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

export default SubmitForm;
