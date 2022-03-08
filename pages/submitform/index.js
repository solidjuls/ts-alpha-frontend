import { useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import { FormattedMessage } from "react-intl";
import { getSession } from "next-auth/react";

import {
  gameWinningOptions,
  endType,
  turns,
  leagueTypes,
} from "utils/constants";
import { Button } from "components/Button";
import { Input } from "components/Input";
import { Label } from "components/Label";
import DropdownMenu from "components/DropdownMenu";
import { Box, Form } from "components/Atoms";

import "react-day-picker/lib/style.css";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { Typeahead } from "components/Autocomplete/Typeahead";
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
const cssLabel = { marginBottom: 8, marginRight: 15, width: "160px" };
const cssFlexTextDateComponent = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "16px",
};

const normalizeData = (form) => {
  let payloadObject = {};
  Object.keys(form).forEach((key) => {
    payloadObject[key] = form[key].value;
  });
  return payloadObject;
};
const useTypeaheadState = () => {
  const { data } = trpc.useQuery(["user-get-all"]);
  const userList =
    data?.map((user) => ({ value: user.id, text: user.name })) || [];
  const [userSuggestions, setUserSuggestions] = useState([]);
  //console.log("userList", userList);
  const onChange = (input) => {
    setUserSuggestions(
      userList?.filter((user) => {
        if (user.text.toLowerCase().includes(input.toLowerCase())) {
          return true;
        }
      })
    );
  };

  return { userSuggestions, onChange };
};
const TypeaheadLabelComponent = ({
  labelText,
  selectedItem,
  onSelect,
  css,
  error,
  ...rest
}) => {
  const { userSuggestions, onChange } = useTypeaheadState();

  return (
    <Box css={cssFlexTextDateComponent}>
      <Label htmlFor="dropdown" css={cssLabel}>
        <FormattedMessage id={labelText} />
      </Label>
      <Typeahead
        debounceTime={300}
        onChange={onChange}
        minChars={1}
        selectedValueProperty="value"
        selectedInputProperty="text"
        onSelect={onSelect}
        selectedValue={selectedItem}
        // onBlur={setValue}
        {...rest}
      >
        <Typeahead.Input
          css={css}
          error={error}
          placeholder="Type the player name..."
        />
        {userSuggestions.length > 0 && (
          <Typeahead.List css={css}>
            {userSuggestions.map(({ value, text }, index) => (
              <Typeahead.Item
                key={value}
                value={{ value, text }}
                index={index}
                id={value}
              >
                <div>{text}</div>
              </Typeahead.Item>
            ))}
          </Typeahead.List>
        )}
      </Typeahead>
    </Box>
  );
};

const DropdownLabelComponent = ({
  labelText,
  selectedItem,
  onSelect,
  items,
  error,
  css,
  ...rest
}) => (
  <Box css={cssFlexTextDateComponent}>
    <Label htmlFor="dropdown" css={cssLabel}>
      <FormattedMessage id={labelText} />
    </Label>
    <DropdownMenu
      id="dropdown"
      items={items}
      selectedItem={selectedItem}
      onSelect={onSelect}
      css={css}
      {...rest}
      error={error}
    />
  </Box>
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
    <Box css={cssFlexTextDateComponent}>
      <Label htmlFor="video1" css={cssLabel}>
        <FormattedMessage id={labelText} />
      </Label>
      <Input
        type="text"
        id="video1"
        defaultValue={inputValue}
        onChange={(event) => onInputValueChange(event.target.value)}
        css={css}
        {...rest}
        border={error ? "error" : undefined}
      />
    </Box>
  );
};

const DateComponent = ({
  labelText,
  inputValue,
  onInputValueChange = () => {},
  ...rest
}) => (
  <Box css={cssFlexTextDateComponent}>
    <Label htmlFor="gameDate" css={cssLabel}>
      <FormattedMessage id={labelText} />
    </Label>
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
  </Box>
);

const callAPI = ({ url, data, sendCallback, responseCallback }) => {
  console.log("url", url, data);
  fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((result) => {
      console.log("successful", result);
      responseCallback(result);
    })
    .catch((err) => {
      console.log("error", err);
      responseCallback(err);
    });
};

const getSelectedItem = (value, list) =>
  list.find((item) => item.value === value)?.text || list[0].text;

const initialState = {
  game_date: {
    value: new Date(),
  },
  game_winner: {
    value: "1",
    error: false,
  },
  game_code: {
    value: "",
    error: false,
  },
  game_type: {
    value: "",
    error: false,
  },
  usa_player_id: {
    value: "",
    error: false,
  },
  ussr_player_id: {
    value: "",
    error: false,
  },
  end_turn: {
    value: "",
    error: false,
  },
  end_mode: {
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
const SubmitForm = () => {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [disabled, setDisabled] = useState(false);
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
    console.log("form", form);
    if (form["usa_player_id"].value === form["ussr_player_id"].value) {
      setForm((prevState) => ({
        ...prevState,
        ['usa_player_id']: {
          ...prevState['usa_player_id'],
          error: true,
        },
        ['ussr_player_id']: {
          ...prevState['ussr_player_id'],
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
      <Box css={{ flexDirection: "column", alignItems: "flex-start" }}>
        <TextComponent
          labelText="checkID"
          inputValue={form.game_code.value}
          onInputValueChange={(value) => onInputValueChange("game_code", value)}
          css={{ width: "50px" }}
          error={form.game_code.error}
        />
        <DropdownLabelComponent
          labelText="typeOfGame"
          items={leagueTypes}
          selectedItem={form.game_type.value}
          error={form.game_type.error}
          css={{ width: dropdownWidth }}
          onSelect={(value) => onInputValueChange("game_type", value)}
        />
        <TypeaheadLabelComponent
          labelText="playerUSA"
          selectedItem={form.usa_player_id.value}
          selectedValueProperty="value"
          selectedInputProperty="text"
          error={form.usa_player_id.error}
          css={{ width: typeaheadWidth }}
          onSelect={(value) =>
            onInputValueChange("usa_player_id", value?.value)
          }
          onBlur={() => onInputValueChange("usa_player_id", "")}
        />
        <TypeaheadLabelComponent
          labelText="playerURSS"
          selectedItem={form.ussr_player_id.value}
          error={form.ussr_player_id.error}
          css={{ width: typeaheadWidth }}
          selectedValueProperty="value"
          selectedInputProperty="text"
          onSelect={(value) =>
            onInputValueChange("ussr_player_id", value?.value)
          }
          onBlur={() => onInputValueChange("ussr_player_id", "")}
        />
        <DropdownLabelComponent
          labelText="gameWinner"
          items={gameWinningOptions}
          selectedItem={getSelectedItem(
            form.game_winner.value,
            gameWinningOptions
          )}
          error={form.game_winner.error}
          css={{ width: dropdownWidth }}
          onSelect={(value) => onInputValueChange("game_winner", value)}
        />
        <DropdownLabelComponent
          labelText="endTurn"
          items={turns}
          error={form.end_turn.error}
          selectedItem={form.end_turn.value}
          css={{ width: dropdownWidth }}
          onSelect={(value) => onInputValueChange("end_turn", value)}
        />
        <DropdownLabelComponent
          labelText="endType"
          items={endType}
          error={form.end_mode.error}
          css={{ width: dropdownWidth }}
          selectedItem={form.end_mode.value}
          onSelect={(value) => onInputValueChange("end_mode", value)}
        />
        <DateComponent
          labelText="gameDate"
          inputValue={form.game_date.value}
          error={form.game_date.error}
          onInputValueChange={(value) => onInputValueChange("game_date", value)}
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
              callAPI({
                url: "https://tsalpha.klckh.com/api/game-results",
                data: normalizeData(form),
                responseCallback: () => {
                  setDisabled(false);
                  router.push("/");
                },
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

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  return { props: {} };
}

export default SubmitForm;
