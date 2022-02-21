import { useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import { styled } from "stitches.config";
import { FormattedMessage } from "react-intl";
import { getSession } from "next-auth/react";

import { gameWinningOptions, endType, turns, leagueTypes } from "./constants";
import { Button } from "components/Button";
import { Input } from "components/Input";
import { Label } from "components/Label";
import DropdownMenu from "components/DropdownMenu";

import "react-day-picker/lib/style.css";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { Typeahead } from "components/Autocomplete/Typeahead";

const Form = styled("form", {
  alignItems: "center",
  backgroundColor: "White",
  width: "640px",
  alignSelf: "center",
  //boxShadow: "rgb(100 100 111 / 20%) 0px 7px 29px 0px",
  padding: "12px",
});
const Flex = styled("div", { display: "flex" });

const cssLabel = { marginRight: 15, width: "140px", maxWidth: "140px" };
const cssFlexTextDateComponent = { marginBottom: "16px" };
const cssLayout = { flexDirection: "column", alignItems: "flex-start" };

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
    <Flex css={cssFlexTextDateComponent}>
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
        <Typeahead.Input placeholder="Type the player name..." />
        {userSuggestions.length > 0 && (
          <Typeahead.List>
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
    </Flex>
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
  <Flex css={cssFlexTextDateComponent}>
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
  </Flex>
);
const TextComponent = ({
  labelText,
  inputValue,
  onInputValueChange = () => {},
  css,
  ...rest
}) => (
  <Flex css={cssFlexTextDateComponent}>
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
  </Flex>
);

const DateComponent = ({
  labelText,
  inputValue,
  onInputValueChange = () => {},
  ...rest
}) => (
  <Flex css={cssFlexTextDateComponent}>
    <Label htmlFor="gameDate" css={cssLabel}>
      <FormattedMessage id={labelText} />
    </Label>
    <DayPickerInput
      id="gameDate"
      format="YYYY-MM-DD"
      onDayChange={(value) => onInputValueChange(value)}
      dayPickerProps={{
        showWeekNumbers: true,
        todayButton: "Today",
      }}
    />
  </Flex>
);

const callAPI = ({ url, data, sendCallback, responseCallback }) => {
  sendCallback(data);
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

const SubmitForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({});
  const onInputValueChange = (key, value) => {
    setForm((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <Flex css={cssLayout}>
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
          width="230px"
          onSelect={(value) => onInputValueChange("game_type", value)}
        />
        <TypeaheadLabelComponent
          labelText="playerUSA"
          selectedItem={form.usa_player_id}
          width="230px"
          onSelect={(value) =>
            onInputValueChange("usa_player_id", value?.value)
          }
        />
        <TypeaheadLabelComponent
          labelText="playerURSS"
          selectedItem={form.ussr_player_id}
          width="230px"
          onSelect={(value) =>
            onInputValueChange("ussr_player_id", value?.value)
          }
        />
        <DropdownLabelComponent
          labelText="endTurn"
          items={turns}
          selectedItem={form.end_turn}
          width="230px"
          onSelect={(value) => onInputValueChange("end_turn", value)}
        />
        <DropdownLabelComponent
          labelText="gameWinner"
          items={gameWinningOptions}
          selectedItem={getSelectedItem(form.game_winner, gameWinningOptions)}
          width="230px"
          onSelect={(value) => onInputValueChange("game_winner", value)}
        />
        <DropdownLabelComponent
          labelText="endTurn"
          items={turns}
          selectedItem={form.end_turn}
          width="230px"
          onSelect={(value) => onInputValueChange("end_turn", value)}
        />
        <DropdownLabelComponent
          labelText="endType"
          items={endType}
          width="230px"
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
              url,
              data: form,
              responseCallback: () => router.push("/"),
            })
          }
        >
          Submit
        </Button>
        <strong>Result submitted correctly</strong>
      </Flex>
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
