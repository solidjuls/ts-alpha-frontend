import React from "react";
import {Control, FieldErrors, UseFormHandleSubmit, UseFormWatch, Controller} from "react-hook-form";
import { Spinner } from "@radix-ui/themes";
import Text from "components/Text";
import TextComponent from "./TextComponent";
import UserTypeahead from "./UserTypeahead";
import { gameWinningOptions, endType, turns } from "utils/constants";
import { DropdownWithLabel } from "components/EditFormComponents";
import { DropdownItemType } from "types/types";
import { 
  StyledForm,
  FormContainer,
  Banner,
  BannerTitle,
  Grid,
  Cell,
  FullRow,
  ActionsRow,
  SubmitButton,
  ErrorBox,
  ErrorTitle,
  ErrorList
 } from "./SubmitRecreateForm.styled";

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

const dropdownCss = { width: "100%" };

const SubmitRecreateForm = ({
  control,
  handleSubmit,
  onSubmit,
  users,
  leagueTypes,
  errors,
  isSubmitting,
}: SubmitGameFormProps) => {
  // Consolidate error messages so we don’t render 10+ lines
  const errorMessages: string[] = [
    errors.root?.message as string,
    errors.oldId?.message as string,
    errors.gameCode?.message as string,
    errors.usaPlayerId?.message as string,
    errors.ussrPlayerId?.message as string,
    errors.tournamentId?.message as string,
    errors.gameWinner?.message as string,
    errors.endTurn?.message as string,
    errors.endMode?.message as string,
    errors.video1?.message as string,
  ].filter(Boolean);

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <FormContainer>
        <Banner>
          <BannerTitle>Recreate Game:</BannerTitle>{" "}
          This will recalculate all ratings from this game onwards.
        </Banner>

        {errorMessages.length > 0 && (
          <ErrorBox>
            <ErrorTitle>Fix the Following</ErrorTitle>
            <ErrorList>
              {errorMessages.map((msg, idx) => (
                <li key={`${msg}-${idx}`}>
                  <Text type="error">{msg}</Text>
                </li>
              ))}
            </ErrorList>
          </ErrorBox>
        )}

        <Grid>
          <Cell>
            <Controller
              name="oldId"
              control={control}
              render={({ field }) => (
                <TextComponent
                  labelText="Old Game ID"
                  inputValue={field.value}
                  placeholder="Enter the Game ID to Recreate"
                  onInputValueChange={field.onChange}
                  css={dropdownCss}
                  error={!!errors.oldId}
                />
              )}
            />
          </Cell>

          <Cell>
            <Controller
              name="gameCode"
              control={control}
              rules={{ required: "Game code is required" }}
              render={({ field }) => (
                <TextComponent
                  labelText="Game Code"
                  inputValue={field.value}
                  placeholder="Game Code"
                  onInputValueChange={field.onChange}
                  css={{ width: "100%", maxWidth: "220px" }}
                  error={!!errors.gameCode}
                />
              )}
            />
          </Cell>
        </Grid>

      <Grid>
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

          <Cell>
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
                  placeholder="Select Tournament"
                  height="270px"
                  error={!!errors.tournamentId}
                  css={dropdownCss}
                  onSelect={field.onChange}
                />
              )}
            />
          </Cell>

          {/* Winner */}
          <Cell>
            <Controller
              name="gameWinner"
              control={control}
              rules={{ required: "Please select game winner" }}
              render={({ field }) => (
                <DropdownWithLabel
                  labelText="gameWinner"
                  placeholder="Game Winner"
                  items={gameWinningOptions}
                  selectedItem={field.value}
                  selectedValueProperty="value"
                  selectedInputProperty="text"
                  error={!!errors.gameWinner}
                  css={dropdownCss}
                  onSelect={field.onChange}
                />
              )}
            />
          </Cell>

          {/* End turn */}
          <Cell>
            <Controller
              name="endTurn"
              control={control}
              rules={{ required: "End turn is required" }}
              render={({ field }) => (
                <DropdownWithLabel
                  labelText="endTurn"
                  placeholder="End Turn"
                  selectedItem={field.value}
                  selectedValueProperty="value"
                  selectedInputProperty="text"
                  error={!!errors.endTurn}
                  items={turns}
                  css={dropdownCss}
                  onSelect={field.onChange}
                />
              )}
            />
          </Cell>

          {/* End mode */}
          <Cell>
            <Controller
              name="endMode"
              control={control}
              rules={{ required: "Please select the victory type" }}
              render={({ field }) => (
                <DropdownWithLabel
                  labelText="endType"
                  placeholder="Victory Type"
                  items={endType}
                  error={!!errors.endMode}
                  css={dropdownCss}
                  selectedItem={field.value}
                  onSelect={field.onChange}
                />
              )}
            />
          </Cell>

          {/* Video link full width */}
          <FullRow>
            <Controller
              name="video1"
              control={control}
              render={({ field }) => (
                <TextComponent
                  labelText="videoLink1"
                  inputValue={field.value || ""}
                  placeholder="Link to the Video..."
                  error={!!errors.video1}
                  css={dropdownCss}
                  onInputValueChange={field.onChange}
                />
              )}
            />
          </FullRow>
        </Grid>

        <ActionsRow>
          <SubmitButton disabled={isSubmitting} type="submit">
            {isSubmitting ? <Spinner size="3" /> : "Recreate Game"}
          </SubmitButton>
        </ActionsRow>
      </FormContainer>
    </StyledForm>
  );
};

export default SubmitRecreateForm;
