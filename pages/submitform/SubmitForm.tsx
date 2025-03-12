import React from "react";
import Text from "components/Text";
import TextComponent from "./TextComponent";

import { gameWinningOptions, endType, turns, gameSides } from "utils/constants";
import { Button } from "components/Button";
import { Box, Form } from "components/Atoms";
import UserTypeahead from "./UserTypeahead";
import { DropdownWithLabel } from "components/EditFormComponents";

import { Spinner } from "@radix-ui/themes";
import { DropdownItemType } from "types/types";
import { SubmitFormNormalizeType, SubmitFormState } from ".";

const dropdownWidth = "370px";

const formStyles = {
  alignItems: "center",
  backgroundColor: "White",
  width: "640px",
  alignSelf: "center",
  padding: "12px",
  // boxShadow: "rgb(100 100 111 / 20%) 0px 7px 29px 0px",
  "@sm": {
    width: "100%",
  },
};

type SubmitFormProps = {
  errorMsg: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  form: SubmitFormState;
  onInputValueChange: (key: keyof SubmitFormState, value: string) => void;
  leagueTypes: DropdownItemType[];
  users: DropdownItemType[];
};

const SubmitForm = ({
  onSubmit,
  form,
  users,
  leagueTypes,
  onInputValueChange,
  errorMsg,
  isSubmitting,
}: SubmitFormProps) => {
  return (
    <Form css={formStyles} onSubmit={(e) => e.preventDefault()}>
      <Box
        css={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "15px",
        }}
      >
        <TextComponent
          labelText="checkID"
          inputValue={form.gameCode.value}
          placeholder="Game id"
          onInputValueChange={(value) => onInputValueChange("gameCode", value)}
          css={{ width: "80px" }}
          error={form.gameCode.error}
          key="checkID"
        />
        <DropdownWithLabel
          labelText="typeOfGame"
          key="gameType"
          items={leagueTypes}
          selectedItem={form.gameType.value}
          placeholder="Select tournament"
          error={form.gameType.error}
          css={{ width: dropdownWidth }}
          onSelect={(value) => onInputValueChange("gameType", value)}
        />
        <DropdownWithLabel
          labelText="PlayedAs"
          placeholder="I played as..."
          items={gameSides}
          selectedItem={form.playedAs.value}
          selectedValueProperty="value"
          selectedInputProperty="text"
          error={form.playedAs.error}
          css={{ width: dropdownWidth }}
          onSelect={(value) => onInputValueChange("playedAs", value)}
        />
        <UserTypeahead
          labelText="opponentWas"
          selectedItem={form.opponentWas.value}
          error={form.opponentWas.error}
          users={users}
          placeholder="Type the opponent name..."
          css={{ width: dropdownWidth }}
          onBlur={() => {
            onInputValueChange("opponentWas", "");
          }}
          onSelect={(value: DropdownItemType) => onInputValueChange("opponentWas", value?.value || "")}
        />
        <DropdownWithLabel
          labelText="gameWinner"
          placeholder="Game winner"
          items={gameWinningOptions}
          selectedItem={form.gameWinner.value as string}
          selectedValueProperty="value"
          selectedInputProperty="text"
          error={form.gameWinner.error}
          css={{ width: dropdownWidth }}
          onSelect={(value: string) => {
            onInputValueChange("gameWinner", value);
          }}
        />
        <DropdownWithLabel
          labelText="endTurn"
          placeholder="End turn"
          items={turns}
          error={form.endTurn.error}
          selectedItem={form.endTurn.value}
          css={{ width: dropdownWidth }}
          onSelect={(value: string) => onInputValueChange("endTurn", value)}
        />
        <DropdownWithLabel
          labelText="endType"
          placeholder="Victory type"
          items={endType}
          error={form.endMode.error}
          css={{ width: dropdownWidth }}
          selectedItem={form.endMode.value}
          onSelect={(value: string) => onInputValueChange("endMode", value)}
        />
        <TextComponent
          labelText="videoLink1"
          inputValue={form.video1.value}
          placeholder="Link to the video..."
          error={form.video1.error}
          css={{ width: "500px" }}
          onInputValueChange={(value: string) => onInputValueChange("video1", value)}
        />
        <Button
          disabled={isSubmitting}
          css={{ width: "200px", fontSize: "18px" }}
          onClick={onSubmit}
        >
          {isSubmitting ? <Spinner size="3" /> : "Submit"}
        </Button>
        {errorMsg && <Text type="error">{errorMsg}</Text>}
      </Box>
    </Form>
  );
};

export default SubmitForm;
