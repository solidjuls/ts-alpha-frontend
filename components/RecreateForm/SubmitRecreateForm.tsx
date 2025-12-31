import React from "react";
import { Control, FieldErrors, UseFormHandleSubmit, UseFormWatch } from "react-hook-form";
import { Controller } from "react-hook-form";
import Text from "components/Text";
import TextComponent from "./TextComponent";
import UserTypeahead from "./UserTypeahead";
import { gameWinningOptions, endType, turns } from "utils/constants";
import { Button } from "components/Button";
import { Box, Form } from "components/Atoms";
import { DropdownWithLabel } from "components/EditFormComponents";
import { Spinner } from "@radix-ui/themes";
import { DropdownItemType } from "types/types";
import styled from "styled-components";

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

const dropdownWidth = "390px";
const typeaheadWidth = "350px";

// Define the form data interface
export interface RecreateGameFormData {
  oldId: string;
  gameCode: string;
  usaPlayerId: string;
  ussrPlayerId: string;
  tournamentId: string;
  gameWinner: string;
  endTurn: string;
  endMode: string;
  video1?: string;
}

export type SubmitGameFormProps = {
  control: Control<RecreateGameFormData>;
  handleSubmit: UseFormHandleSubmit<RecreateGameFormData>;
  onSubmit: (data: RecreateGameFormData) => Promise<void>;
  errors: FieldErrors<RecreateGameFormData>;
  isSubmitting: boolean;
  leagueTypes: DropdownItemType[];
  users: DropdownItemType[];
  watch: UseFormWatch<RecreateGameFormData>;
};

const SubmitRecreateForm = ({
  control,
  handleSubmit,
  onSubmit,
  users,
  leagueTypes,
  errors,
  isSubmitting,
  watch,
}: SubmitGameFormProps) => {

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <Banner>
        <b>Recreate Game:</b> This will recalculate all ratings from this game onwards.
      </Banner>
      <FormContainer>
        <Controller
          name="oldId"
          control={control}
          render={({ field }) => (
            <TextComponent
              labelText="Old Game ID"
              inputValue={field.value}
              placeholder="Enter the old game ID to recreate"
              onInputValueChange={field.onChange}
              css={{ width: dropdownWidth }}
              error={!!errors.oldId}
            />
          )}
        />

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
            />
          )}
        />

        <Controller
          name="usaPlayerId"
          control={control}
          rules={{ required: "Please select USA player" }}
          render={({ field }) => (
            <UserTypeahead
              labelText="USA Player"
              selectedItem={field.value || null}
              error={!!errors.usaPlayerId}
              placeholder="Type USA player name..."
              width={typeaheadWidth}
              css={{ width: dropdownWidth }}
              users={users}
              onSelect={(selectedItem: DropdownItemType | null) => {
                field.onChange(selectedItem?.value || "");
              }}
            />
          )}
        />

        <Controller
          name="ussrPlayerId"
          control={control}
          rules={{ required: "Please select USSR player" }}
          render={({ field }) => (
            <UserTypeahead
              labelText="USSR Player"
              selectedItem={field.value || null}
              error={!!errors.ussrPlayerId}
              placeholder="Type USSR player name..."
              css={{ width: dropdownWidth }}
              width={typeaheadWidth}
              users={users}
              onSelect={(selectedItem: DropdownItemType | null) => {
                field.onChange(selectedItem?.value || "");
              }}
            />
          )}
        />

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
              error={!!errors.gameWinner}
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
              inputValue={field.value || ""}
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
          {isSubmitting ? <Spinner size="3" /> : "Recreate Game"}
        </SubmitButton>

        {errors.root && <Text type="error">{errors.root.message}</Text>}
        {errors.oldId && <Text type="error">{errors.oldId.message}</Text>}
        {errors.gameCode && <Text type="error">{errors.gameCode.message}</Text>}
        {errors.usaPlayerId && <Text type="error">{errors.usaPlayerId.message}</Text>}
        {errors.ussrPlayerId && <Text type="error">{errors.ussrPlayerId.message}</Text>}
        {errors.tournamentId && <Text type="error">{errors.tournamentId.message}</Text>}
        {errors.gameWinner && <Text type="error">{errors.gameWinner.message}</Text>}
        {errors.endTurn && <Text type="error">{errors.endTurn.message}</Text>}
        {errors.endMode && <Text type="error">{errors.endMode.message}</Text>}
        {errors.video1 && <Text type="error">{errors.video1.message}</Text>}
      </FormContainer>
    </StyledForm>
  );
};

export default SubmitRecreateForm;
