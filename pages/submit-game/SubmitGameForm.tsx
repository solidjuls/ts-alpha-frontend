import React from "react";
import { Control, FieldErrors, UseFormHandleSubmit, UseFormWatch } from "react-hook-form";
import { Controller } from "react-hook-form";
import Text from "components/Text";
import TextComponent from "./TextComponent";
import { gameWinningOptions, endType, turns, gameSides } from "utils/constants";
import { Button } from "components/Button";
import { Box, Form } from "components/Atoms";
import UserTypeahead from "components/UserTypeahead";
import { DropdownWithLabel } from "components/EditFormComponents";
import { Spinner } from "@radix-ui/themes";
import { DropdownItemType } from "types/types";
import { SubmitGameFormData } from "./index";
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

const dropdownWidth = "370px";

type SubmitGameFormProps = {
  control: Control<SubmitGameFormData>;
  handleSubmit: UseFormHandleSubmit<SubmitGameFormData>;
  onSubmit: (data: SubmitGameFormData) => Promise<void>;
  errors: FieldErrors<SubmitGameFormData>;
  isSubmitting: boolean;
  leagueTypes: DropdownItemType[];
  users: DropdownItemType[];
  watch: UseFormWatch<SubmitGameFormData>;
  isScheduleMode: boolean;
  usaPlayerName: string;
  ussrPlayerName: string;
};

const SubmitGameForm = ({
  control,
  handleSubmit,
  onSubmit,
  users,
  leagueTypes,
  errors,
  isSubmitting,
  watch,
  isScheduleMode,
  usaPlayerName,
  ussrPlayerName,
}: SubmitGameFormProps) => {
  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <Banner>
        <b>Reminder:</b> Results for <b>ITSL Season 15</b> must be submitted through the{" "}
        <Link href="/schedule">my schedule</Link> page
      </Banner>
      <FormContainer>
        <Controller
          name="gameCode"
          control={control}
          rules={{ required: "Game code is required" }}
          render={({ field }) => (
            <TextComponent
              labelText="checkID"
              inputValue={field.value}
              placeholder="Game id"
              onInputValueChange={field.onChange}
              css={{ width: "80px" }}
              error={!!errors.gameCode}
              key="checkID"
            />
          )}
        />

        {isScheduleMode && (
          <>
            <Controller
              name="usaPlayerId"
              control={control}
              render={({ field }) => (
                <TextComponent
                  labelText="USA Player"
                  inputValue={usaPlayerName}
                  placeholder="USA Player"
                  onInputValueChange={() => {}} // Read-only
                  css={{ width: "250px" }}
                  key="usaPlayerId"
                  disabled
                  error={false}
                />
              )}
            />

            <Controller
              name="ussrPlayerId"
              control={control}
              render={({ field }) => (
                <TextComponent
                  labelText="USSR Player"
                  inputValue={ussrPlayerName}
                  placeholder="USSR Player"
                  onInputValueChange={() => {}} // Read-only
                  css={{ width: "250px" }}
                  key="ussrPlayerId"
                  disabled
                  error={false}
                />
              )}
            />
          </>
        )}



        <Controller
          name="tournamentId"
          control={control}
          rules={{ required: "Tournament is required" }}
          render={({ field }) => (
            <DropdownWithLabel
              labelText="typeOfGame"
              key="gameType"
              items={leagueTypes}
              selectedItem={field.value}
              placeholder="Select tournament"
              height="270px"
              error={!!errors.tournamentId}
              css={{ width: dropdownWidth }}
              onSelect={field.onChange}
            />
          )}
        />

        {!isScheduleMode && (
          <>
            <Controller
              name="playedAs"
              control={control}
              rules={{ required: "Please select which side you played as" }}
              render={({ field }) => (
                <DropdownWithLabel
                  labelText="PlayedAs"
                  placeholder="I played as..."
                  items={gameSides}
                  selectedItem={field.value}
                  selectedValueProperty="value"
                  selectedInputProperty="text"
                  error={!!errors.playedAs}
                  css={{ width: dropdownWidth }}
                  onSelect={field.onChange}
                />
              )}
            />

            <Controller
              name="opponentWas"
              control={control}
              rules={{ required: "Please select your opponent" }}
              render={({ field }) => (
                <UserTypeahead
                  labelText="opponentWas"
                  selectedItem={field.value}
                  error={!!errors.opponentWas}
                  placeholder="Type the opponent name..."
                  css={{ width: dropdownWidth }}
                  onBlur={() => {
                    // Don't clear on blur for react-hook-form
                  }}
                  onSelect={(value) =>
                    field.onChange(value?.value || "")
                  }
                />
              )}
            />
          </>
        )}

        <Controller
          name="gameWinner"
          control={control}
          rules={{ required: "Please select game winner" }}
          render={({ field }) => (
            <DropdownWithLabel
              labelText="gameWinner"
              placeholder="Game winner"
              items={gameWinningOptions}
              selectedItem={field.value}
              selectedValueProperty="value"
              selectedInputProperty="text"
              error={!!errors.playedAs}
              css={{ width: dropdownWidth }}
              onSelect={field.onChange}
            />
          )}
        />

        <Controller
          name="endTurn"
          control={control}
          rules={{ required: "End turn is required" }}
          render={({ field }) => (
            <DropdownWithLabel
              labelText="endTurn"
              placeholder="End turn"
              selectedItem={field.value}
              selectedValueProperty="value"
              selectedInputProperty="text"
              error={!!errors.endTurn}
              items={turns}
              css={{ width: dropdownWidth }}
              onSelect={field.onChange}
            />
          )}
        />

        <Controller
          name="endMode"
          control={control}
          rules={{ required: "Please select the victory type" }}
          render={({ field }) => (
            <DropdownWithLabel
              labelText="endType"
              placeholder="Victory type"
              items={endType}
              error={!!errors.endMode}
              css={{ width: dropdownWidth }}
              selectedItem={field.value}
              onSelect={field.onChange}
            />
          )}
        />

        <Controller
          name="video1"
          control={control}
          render={({ field }) => (
            <TextComponent
              labelText="videoLink1"
              inputValue={field.value}
              placeholder="Link to the video..."
              error={!!errors.video1}
              css={{ width: dropdownWidth }}
              onInputValueChange={field.onChange}
            />
          )}
        />

        <SubmitButton
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? <Spinner size="3" /> : "Submit"}
        </SubmitButton>

        {errors.root && <Text type="error">{errors.root.message}</Text>}
        {errors.gameCode && <Text type="error">{errors.gameCode.message}</Text>}
        {errors.tournamentId && <Text type="error">{errors.tournamentId.message}</Text>}
        {errors.playedAs && <Text type="error">{errors.playedAs.message}</Text>}
        {errors.opponentWas && <Text type="error">{errors.opponentWas.message}</Text>}
        {errors.gameWinner && <Text type="error">{errors.gameWinner.message}</Text>}
        {errors.endTurn && <Text type="error">{errors.endTurn.message}</Text>}
        {errors.endMode && <Text type="error">{errors.endMode.message}</Text>}
        {errors.video1 && <Text type="error">{errors.video1.message}</Text>}
      </FormContainer>
    </StyledForm>
  );
};

export default SubmitGameForm;
