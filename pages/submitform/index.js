import { useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "contexts/APIProvider";

import {
  gameWinningOptions,
  endType,
  turns,
  leagueTypes,
} from "utils/constants";
import { Button } from "components/Button";
import { Input } from "components/Input";
import UserTypeahead from "./UserTypeahead";
import DropdownMenu from "components/DropdownMenu";
import { Box, Form } from "components/Atoms";
import WithLabel from "./WithLabel";
import { getInfoFromCookies } from "utils/cookies";
import "react-day-picker/lib/style.css";
import DayPickerInput from "react-day-picker/DayPickerInput";

import { dateFormat } from "utils/dates";

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

const normalizeData = (form) => {
  let payloadObject = {};
  Object.keys(form).forEach((key) => {
    payloadObject[key] = form[key].value;
  });
  return payloadObject;
};

const UserDropdown = ({
  labelText,
  selectedItem,
  onSelect,
  items,
  error,
  css,
  ...rest
}) => (
  <WithLabel labelText={labelText}>
    <DropdownMenu
      id="dropdown"
      items={items}
      selectedItem={selectedItem}
      onSelect={onSelect}
      css={css}
      {...rest}
      error={error}
    />
  </WithLabel>
);
const TextComponent = ({
  labelText,
  inputValue,
  onInputValueChange = () => {},
  error,
  css,
  ...rest
}) => {
  return (
    <WithLabel labelText={labelText}>
      <Input
        type="text"
        id="video1"
        defaultValue={inputValue}
        onChange={(event) => onInputValueChange(event.target.value)}
        css={css}
        {...rest}
        border={error ? "error" : undefined}
      />
    </WithLabel>
  );
};

const DateComponent = ({
  labelText,
  inputValue,
  onInputValueChange = () => {},
  ...rest
}) => (
  <WithLabel labelText={labelText}>
    <DayPickerInput
      id="gameDate"
      value={inputValue}
      format="YYYY/MM/DD"
      placeholder="YYYY/MM/DD"
      formatDate={dateFormat}
      onDayChange={(value) => onInputValueChange(value)}
      dayPickerProps={{
        showWeekNumbers: true,
        todayButton: "Today",
      }}
    />
  </WithLabel>
);

const getSelectedItem = (value, list) =>
  list.find((item) => item.value === value)?.text || list[0].text;

const initialState = {
  gameRecreateId: {
    value: "",
    error: false,
  },
  gameDate: {
    value: new Date(),
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

const SubmitForm = ({ role }) => {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [disabled, setDisabled] = useState(false);
  const gameSubmitMutation = trpc.useMutation(["game-submit"], {
    onSuccess: () => setDisabled(false),
    onError: (error, variables, context) => setDisabled(false),
    onSettled: () => setDisabled(false),
  });

  const onInputValueChange = (key, value) => {
    setForm((prevState) => ({
      ...prevState,
      [key]: {
        value,
        error: prevState[key].error ? value === "" : false,
      },
    }));
  };

  const validated = () => {
    let submit = true;
    if (form["usaPlayerId"].value === form["ussrPlayerId"].value) {
      setForm((prevState) => ({
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

    Object.keys(form).forEach((key) => {
      if (["video1", "video2", "video3"].includes(key)) {
      } else {
        if (form[key].value === "") {
          // form[key].error = true;
          setForm((prevState) => ({
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

  return (
    <Form css={formStyles} onSubmit={(e) => e.preventDefault()}>
      {role === 2 && (
        <TextComponent
          labelText="gameRecreateId"
          inputValue={form.gameRecreateId.value}
          onInputValueChange={(value) => onInputValueChange("gameRecreateId", value)}
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
        <UserDropdown
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
          onSelect={(value) => onInputValueChange("usaPlayerId", value?.value)}
          onBlur={() => onInputValueChange("usaPlayerId", "")}
        />
        <UserTypeahead
          labelText="playerURSS"
          selectedItem={form.ussrPlayerId.value}
          error={form.ussrPlayerId.error}
          css={{ width: typeaheadWidth }}
          selectedValueProperty="value"
          selectedInputProperty="text"
          onSelect={(value) => onInputValueChange("ussrPlayerId", value?.value)}
          onBlur={() => onInputValueChange("ussrPlayerId", "")}
        />
        <UserDropdown
          labelText="gameWinner"
          items={gameWinningOptions}
          selectedItem={getSelectedItem(
            form.gameWinner.value,
            gameWinningOptions
          )}
          error={form.gameWinner.error}
          css={{ width: dropdownWidth }}
          onSelect={(value) => onInputValueChange("gameWinner", value)}
        />
        <UserDropdown
          labelText="endTurn"
          items={turns}
          error={form.endTurn.error}
          selectedItem={form.endTurn.value}
          css={{ width: dropdownWidth }}
          onSelect={(value) => onInputValueChange("endTurn", value)}
        />
        <UserDropdown
          labelText="endType"
          items={endType}
          error={form.endMode.error}
          css={{ width: dropdownWidth }}
          selectedItem={form.endMode.value}
          onSelect={(value) => onInputValueChange("endMode", value)}
        />
        <DateComponent
          labelText="gameDate"
          inputValue={form.gameDate.value}
          error={form.gameDate.error}
          onInputValueChange={(value) => onInputValueChange("gameDate", value)}
        />
        <TextComponent
          labelText="videoLink1"
          inputValue={form.video1.value}
          error={form.video1.error}
          onInputValueChange={(value) => onInputValueChange("video1", value)}
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
            if (validated()) {
              setDisabled(true);
              gameSubmitMutation.mutate({
                data: normalizeData(form),
              });
            }
          }}
        >
          Submit
        </Button>
      </Box>
    </Form>
  );
};

export async function getServerSideProps({ req, res }) {
  const payload = getInfoFromCookies({ req, res });
console.log("payload", payload)
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
