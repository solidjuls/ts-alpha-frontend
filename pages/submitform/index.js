import { useState } from "react";
import { trpc } from "utils/trpc";
import { styled } from "@stitches/react";
import { FormattedMessage } from "react-intl";
import { getSession } from "next-auth/react";

import { Button } from "components/Button";
import { Input } from "components/Input";
import { Label } from "components/Label";
import DropdownMenu from "components/DropdownMenu";

import "react-day-picker/lib/style.css";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { isError } from "react-query";

const Form = styled("form", {
  alignItems: "center",
  backgroundColor: "White",
  width: "640px",
  alignSelf: "center",
  //boxShadow: "rgb(100 100 111 / 20%) 0px 7px 29px 0px",
  padding: "12px",
});
const Flex = styled("div", { display: "flex" });
const TextArea = styled("textarea", { height: "300px", width: "500px" });

const cssLabel = { marginRight: 15, width: "140px", maxWidth: "140px" };
const cssFlexTextDateComponent = { marginBottom: "16px" };
const cssLayout = { flexDirection: "column", alignItems: "flex-start" };

const initialState = {
  game_type: "National League",
  game_code: "C000",
  game_winner: "413",
  end_turn: 10,
  end_mode: "DEFCON",
  game_date: "2021-11-17T09:49:22",
  usa_player_id: "345",
  ussr_player_id: "413",
  video1: "http://www.brown.com/est-aut-aut-dicta-velit-possimus-expedita",
  video2: "http://russel.com/eos-occaecati-culpa-nulla-libero.html",
  video3: "http://www.kunde.com/ut-sunt-velit-hic-necessitatibus",
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

const DisplayData = ({ data, labelText }) => {
  return (
    <Flex css={cssLayout}>
      <Label htmlFor="send" css={cssLabel}>
        {labelText}
      </Label>
      <TextArea
        name="send"
        value={JSON.stringify(data, undefined, 2)}
        readonly
      ></TextArea>
    </Flex>
  );
};

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
    .then((result) => { console.log("successful", result); responseCallback(result)})
    .catch((err) => { console.log("error", err); responseCallback(err)});
};

const leagueTypes = [
  {
    text: "National League",
    value: "National League",
  },
  {
    text: "ITSL",
    value: "ITSL",
  },
  {
    text: "OTSL",
    value: "OTSL",
  },
  {
    text: "RTSL",
    value: "RTSL",
  },
];

const turns = [
  {
    text: "1",
    value: "1",
  },
  {
    text: "2",
    value: "2",
  },
  {
    text: "3",
    value: "3",
  },
  {
    text: "4",
    value: "4",
  },
  {
    text: "5",
    value: "5",
  },
  {
    text: "6",
    value: "6",
  },
  {
    text: "7",
    value: "7",
  },
  {
    text: "8",
    value: "8",
  },
  {
    text: "9",
    value: "9",
  },
  {
    text: "10",
    value: "10",
  },
];

const endType = [
  {
    value: "VP Track (+20)",
    text: "VP Track (+20)",
  },
  {
    value: "Final Scoring",
    text: "Final Scoring",
  },
  {
    value: "Wargames",
    text: "Wargames",
  },
  {
    value: "DEFCON",
    text: "DEFCON",
  },
  {
    value: "Forfeit",
    text: "Forfeit",
  },
  {
    value: "Timer Expired",
    text: "Timer Expired",
  },
  {
    value: "Europe Control",
    text: "Europe Control",
  },
  {
    value: "Scoring Card Held",
    text: "Scoring Card Held",
  },
  {
    value: "Cuban Missile Crisis",
    text: "Cuban Missile Crisis",
  },
];
const SubmitForm = () => {
  const { data } = trpc.useQuery(["user-get-all"]);
  const [form, setForm] = useState(initialState);
  const [date, setDate] = useState(new Date());
  const [sendInfo, setSendInfo] = useState("");
  const [responseInfo, setResponseInfo] = useState("");
  const [url, setUrl] = useState("https://tsalpha.klckh.com/api/game-results");
  const t = () => {};

  const onInputValueChange = (key, value) => {
    setForm((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
const userList  = data?.map(user => ({ value: user.id, text: user.name })) 
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
        {/* {userList && <DropdownLabelComponent
          labelText="playerUSA"
          items={userList}
          selectedItem={form.usa_player_id}
          width="230px"
          onSelect={(value) => onInputValueChange("usa_player_id", value)}
        />}
        {userList && <DropdownLabelComponent
          labelText="playerURSS"
          items={userList}
          selectedItem={form.ussr_player_id}
          width="230px"
          onSelect={(value) => onInputValueChange("ussr_player_id", value)}
        />} */}
        <TextComponent
          labelText="playerUSA"
          inputValue={form.usa_player_id}
          onInputValueChange={(value) =>
            onInputValueChange("usa_player_id", value)
          }
        />
        <TextComponent
          labelText="playerURSS"
          inputValue={form.ussr_player_id}
          onInputValueChange={(value) =>
            onInputValueChange("ussr_player_id", value)
          }
        />
        <TextComponent
          labelText="gameWinner"
          inputValue={form.game_winner}
          onInputValueChange={(value) =>
            onInputValueChange("game_winner", value)
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
              sendCallback: setSendInfo,
              responseCallback: setResponseInfo,
            })
          }
        >
          Submit
        </Button>
        {responseInfo && <strong>Result submitted correctly</strong>}
      </Flex>
      {/* <Flex>
        <DisplayData labelText="Send" data={sendInfo} />
        <DisplayData labelText="Response" data={responseInfo} />
      </Flex> */}
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
