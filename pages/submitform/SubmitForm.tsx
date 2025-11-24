import React from "react";
import Text from "components/Text";
import TextComponent from "./TextComponent";

import { gameWinningOptions, endType, turns, gameSides } from "utils/constants";
import { Button } from "components/Button";
import { Box, Form } from "components/Atoms";
import UserTypeahead from "components/UserTypeahead";
import { DropdownWithLabel } from "components/EditFormComponents";

import { Spinner } from "@radix-ui/themes";
import { DropdownItemType } from "types/types";
import { SubmitFormState } from ".";
import styled from "styled-components";
import Link from "next/link";

const Banner = styled.div`
  align-items: flex-start;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid hsl(210 20% 85%);
  box-shadow: 0 6px 18px rgba(15,15,15,0.04);
  max-width: 100%;
  margin-bottom: 12px;
  background-color: hsl(210 20% 97%);
  color: hsl(210 30% 8%);
`;

const StyledForm = styled(Form)`
  align-items: center;
  background-color: white;
  width: 640px;
  align-self: center;
  padding: 12px;
  /* box-shadow: rgb(100 100 111 / 20%) 0px 7px 29px 0px; */

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
`;

const SubmitButton = styled(Button)`
  width: 200px;
  font-size: 18px;
`;

const StyledTextComponent = styled(TextComponent)`
  width: 80px;
`;

const WideTextComponent = styled(TextComponent)`
  width: 370px;
`;

const StyledDropdownWithLabel = styled(DropdownWithLabel)`
  width: 370px;
`;

const StyledUserTypeahead = styled(UserTypeahead)`
  width: 370px;
`;

const dropdownWidth = "370px";

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
    <StyledForm onSubmit={(e) => e.preventDefault()}>
      <Banner><b>Reminder:</b> Results for <b>ITSL Season 15</b> must be submitted through the <Link href="/schedule">my schedule</Link> page</Banner>
      <FormContainer>
        <StyledTextComponent
          labelText="checkID"
          inputValue={form.gameCode.value}
          placeholder="Game id"
          onInputValueChange={(value) => onInputValueChange("gameCode", value)}
          error={form.gameCode.error}
          key="checkID"
        />
        <StyledDropdownWithLabel
          labelText="typeOfGame"
          key="gameType"
          items={leagueTypes}
          selectedItem={form.gameType.value}
          placeholder="Select tournament"
          height="270px"
          error={form.gameType.error}
          onSelect={(value) => onInputValueChange("gameType", value)}
        />
        <StyledDropdownWithLabel
          labelText="PlayedAs"
          placeholder="I played as..."
          items={gameSides}
          selectedItem={form.playedAs.value}
          selectedValueProperty="value"
          selectedInputProperty="text"
          error={form.playedAs.error}
          onSelect={(value) => onInputValueChange("playedAs", value)}
        />
        <StyledUserTypeahead
          labelText="opponentWas"
          selectedItem={form.opponentWas.value}
          error={form.opponentWas.error}
          placeholder="Type the opponent name..."
          onBlur={() => {
            onInputValueChange("opponentWas", "");
          }}
          onSelect={(value) =>
            onInputValueChange("opponentWas", value?.value || "")
          }
        />
        <StyledDropdownWithLabel
          labelText="gameWinner"
          placeholder="Game winner"
          items={gameWinningOptions}
          selectedItem={form.gameWinner.value as string}
          selectedValueProperty="value"
          selectedInputProperty="text"
          error={form.gameWinner.error}
          onSelect={(value: string) => {
            onInputValueChange("gameWinner", value);
          }}
        />
        <StyledDropdownWithLabel
          labelText="endTurn"
          placeholder="End turn"
          items={turns}
          error={form.endTurn.error}
          selectedItem={form.endTurn.value}
          onSelect={(value: string) => onInputValueChange("endTurn", value)}
        />
        <StyledDropdownWithLabel
          labelText="endType"
          placeholder="Victory type"
          items={endType}
          error={form.endMode.error}
          selectedItem={form.endMode.value}
          onSelect={(value: string) => onInputValueChange("endMode", value)}
        />
        <WideTextComponent
          labelText="videoLink1"
          inputValue={form.video1.value}
          placeholder="Link to the video..."
          error={form.video1.error}
          onInputValueChange={(value: string) => onInputValueChange("video1", value)}
        />
        <SubmitButton
          disabled={isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? <Spinner size="3" /> : "Submit"}
        </SubmitButton>
        {errorMsg && <Text type="error">{errorMsg}</Text>}
      </FormContainer>
    </StyledForm>
  );
};

export default SubmitForm;
