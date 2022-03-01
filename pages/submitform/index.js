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
        <Typeahead.Input css={css} placeholder="Type the player name..." />
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
    />
  </Box>
);
const TextComponent = ({
  labelText,
  inputValue,
  onInputValueChange = () => {},
  css,
  ...rest
}) => (
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
    />
  </Box>
);

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

const SubmitForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    game_date: new Date(),
    game_winner: '1'
  });
  const onInputValueChange = (key, value) => {
    setForm((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <Form css={formStyles} onSubmit={(e) => e.preventDefault()}>
      <Box css={{ flexDirection: "column", alignItems: "flex-start" }}>
        <TextComponent
          labelText="checkID"
          inputValue={form.game_code}
          onInputValueChange={(value) => onInputValueChange("game_code", value)}
          css={{ width: "50px" }}
        />
        <DropdownLabelComponent
          labelText="typeOfGame"
          items={leagueTypes}
          selectedItem={form.game_type}
          css={{ width: dropdownWidth }}
          onSelect={(value) => onInputValueChange("game_type", value)}
        />
        <TypeaheadLabelComponent
          labelText="playerUSA"
          selectedItem={form.usa_player_id}
          selectedValueProperty="value"
          selectedInputProperty="text"
          css={{ width: typeaheadWidth }}
          onSelect={(value) =>
            onInputValueChange("usa_player_id", value?.value)
          }
        />
        <TypeaheadLabelComponent
          labelText="playerURSS"
          selectedItem={form.ussr_player_id}
          css={{ width: typeaheadWidth }}
          selectedValueProperty="value"
          selectedInputProperty="text"
          onSelect={(value) =>
            onInputValueChange("ussr_player_id", value?.value)
          }
        />
        <DropdownLabelComponent
          labelText="endTurn"
          items={turns}
          selectedItem={form.end_turn}
          css={{ width: dropdownWidth }}
          onSelect={(value) => onInputValueChange("end_turn", value)}
        />
        <DropdownLabelComponent
          labelText="gameWinner"
          items={gameWinningOptions}
          selectedItem={getSelectedItem(form.game_winner, gameWinningOptions)}
          css={{ width: dropdownWidth }}
          onSelect={(value) => onInputValueChange("game_winner", value)}
        />
        <DropdownLabelComponent
          labelText="endType"
          items={endType}
          css={{ width: dropdownWidth }}
          selectedItem={form.end_mode}
          onSelect={(value) => onInputValueChange("end_mode", value)}
        />
        <DateComponent
          labelText="gameDate"
          inputValue={form.game_date}
          onInputValueChange={(value) => onInputValueChange("game_date", value)}
        />
        <TextComponent
          labelText="videoLink1"
          inputValue={form.video1}
          onInputValueChange={(value) => onInputValueChange("video1", value)}
        />
        <TextComponent
          labelText="videoLink2"
          inputValue={form.video2}
          onInputValueChange={(value) => onInputValueChange("video2", value)}
        />
        <TextComponent
          labelText="videoLink3"
          inputValue={form.video3}
          onInputValueChange={(value) => onInputValueChange("video3", value)}
        />
        <Button
          onClick={() =>
            callAPI({
              url: "https://tsalpha.klckh.com/api/game-results",
              data: form,
              responseCallback: () => router.push("/"),
            })
          }
        >
          Submit
        </Button>
        <strong>Result submitted correctly</strong>
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
