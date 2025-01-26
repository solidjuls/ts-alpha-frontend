import React from "react";
import { GameWinner, SubmitFormValue } from "types/game.types";
import Text from "components/Text";
import TextComponent from "../submitform/TextComponent";
import DateComponent from "../submitform/DateComponent";

import { gameWinningOptions, endType, turns, gameSides } from "utils/constants";
import { Button } from "components/Button";
import { Box, Form } from "components/Atoms";
import UserTypeahead from "../submitform/UserTypeahead";
import { DropdownWithLabel } from "components/EditFormComponents";

import { Spinner } from "@radix-ui/themes";
import { SubmitFormState } from "../submitform";
import { DropdownItemType } from "types/types";

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

type RecreateFormState = {
  oldId: SubmitFormValue<string>;
  gameDate: SubmitFormValue<Date>;
  ussrPlayerId: SubmitFormValue<string>;
  usaPlayerId: SubmitFormValue<string>;
  gameWinner: SubmitFormValue<GameWinner>;
  gameCode: SubmitFormValue<string>;
  gameType: SubmitFormValue<string>;
  endTurn: SubmitFormValue<string>;
  endMode: SubmitFormValue<string>;
  video1: SubmitFormValue<string>;
};

type RecreateFormProps = {
  errorMsg: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  form: RecreateFormState;
  onInputValueChange: (key: keyof RecreateFormState, value: string | Date) => void;
  leagueTypes: DropdownItemType[];
  users: DropdownItemType[];
};

const RecreateRating = ({
  onSubmit,
  form,
  users,
  leagueTypes,
  onInputValueChange,
  errorMsg,
  isSubmitting,
}: RecreateFormProps) => {
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
          labelText="oldId"
          placeholder="Old game id"
          inputValue={form.oldId.value}
          onInputValueChange={(value) => onInputValueChange("oldId", value)}
          css={{ width: "80px" }}
          error={form.oldId.error}
        />
        <TextComponent
          labelText="checkID"
          inputValue={form.gameCode.value}
          placeholder="Game code"
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
        <UserTypeahead
          labelText="usaPlayer"
          selectedItem={form.usaPlayerId.value}
          selectedValueProperty="value"
          selectedInputProperty="text"
          error={form.usaPlayerId.error}
          users={users}
          placeholder="Type USA player name..."
          css={{ width: dropdownWidth }}
          onBlur={() => {
            onInputValueChange("usaPlayerId", "");
          }}
          onSelect={(value: DropdownItemType) => {
            onInputValueChange("usaPlayerId", value?.value);
          }}
        />
        <UserTypeahead
          labelText="ussrPlayer"
          selectedItem={form.ussrPlayerId.value}
          selectedValueProperty="value"
          selectedInputProperty="text"
          error={form.ussrPlayerId.error}
          users={users}
          placeholder="Type USSR player name..."
          css={{ width: dropdownWidth }}
          onBlur={() => {
            onInputValueChange("ussrPlayerId", "");
          }}
          onSelect={(value: DropdownItemType) => {
            onInputValueChange("ussrPlayerId", value?.value);
          }}
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
          onSelect={(value: string) => onInputValueChange("gameWinner", value)}
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
        <DateComponent
          labelText="gameDate"
          inputValue={form.gameDate.value}
          onInputValueChange={(value: Date) => onInputValueChange("gameDate", value)}
        />
        <TextComponent
          labelText="videoLink1"
          inputValue={form.video1.value}
          placeholder="Link to the video..."
          error={form.video1.error}
          css={{ width: "500px" }}
          onInputValueChange={(value: string) => onInputValueChange("video1", value)}
        />
        {errorMsg && <Text type="error">{errorMsg}</Text>}
        <Button
          disabled={isSubmitting}
          css={{ width: "200px", fontSize: "18px" }}
          onClick={onSubmit}
        >
          {isSubmitting ? <Spinner size="3" /> : "Recreate Game"}
        </Button>
      </Box>
    </Form>
  );
};

export default RecreateRating;
