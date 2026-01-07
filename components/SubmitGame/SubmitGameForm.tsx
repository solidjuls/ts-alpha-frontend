import React from "react";
import { Control, FieldErrors, UseFormHandleSubmit, UseFormWatch } from "react-hook-form";
import { Controller } from "react-hook-form";
import Text from "components/Text";
import { gameWinningOptions, endType, turns, gameSides } from "utils/constants";
import UserTypeahead from "components/UserTypeahead";
import { DropdownWithLabel } from "components/EditFormComponents";
import { Spinner } from "@radix-ui/themes";
import { DropdownItemType } from "types/types";
import { SubmitGameFormData } from "pages/submit-game/index";
import Link from "next/link";
import { 
  Banner,
  StyledForm,
  FormContainer,
  SubmitButton,
  SizedText,
 } from "./SubmitGameForm.styled";

const dropdownWidth = "390px";
const typeaheadWidth = "250px";

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
        <span>Reminder:</span> If you don&apos;t see your tournament here, please report through the <Link href="/schedule">My Schedule</Link> page.
      </Banner>
      <FormContainer>
        <Controller
          name="gameCode"
          control={control}
          rules={{ required: "Game Code is Required" }}
          render={({ field }) => (
            <SizedText $variant="small"
              labelText="checkID"
              inputValue={field.value}
              placeholder="Game ID"
              onInputValueChange={field.onChange}
              error={!!errors.gameCode}
              key="checkID"
            />
          )}
        />

        {isScheduleMode && (
          <>
            <Controller
              name="tournamentName"
              control={control}
              rules={{ required: "Tournament is required" }}
              render={({ field }) => (
                <SizedText
                  labelText="typeOfGame"
                  key="gameType"
                  inputValue={field.value}
                  placeholder="Select Tournament"
                  error={!!errors.tournamentId}
                  onInputValueChange={() => {}} // Read-only
                  disabled
                />
              )}
            />
            <Controller
              name="usaPlayerId"
              control={control}
              render={({ field }) => (
                <SizedText
                  labelText="USA Player"
                  inputValue={usaPlayerName}
                  placeholder="USA Player"
                  onInputValueChange={() => {}} // Read-only
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
                <SizedText
                  labelText="USSR Player"
                  inputValue={ussrPlayerName}
                  placeholder="USSR Player"
                  onInputValueChange={() => {}} // Read-only
                  key="ussrPlayerId"
                  disabled
                  error={false}
                />
              )}
            />
          </>
        )}


        {!isScheduleMode && (
          <>
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
                  error={!!errors.tournamentId}
                  css={{ width: dropdownWidth }}
                  onSelect={field.onChange}
                />
              )}
            />

            <Controller
              name="playedAs"
              control={control}
              rules={{ required: "Please select which side you played as" }}
              render={({ field }) => (
                <DropdownWithLabel
                  labelText="PlayedAs"
                  placeholder="My Side"
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
              rules={{ required: "My Opponent" }}
              render={({ field }) => (
                <UserTypeahead
                  labelText="opponentWas"
                  selectedItem={field.value}
                  error={!!errors.opponentWas}
                  placeholder="Type the Opponent Name..."
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
              placeholder="Game Winner"
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
              placeholder="Victory Type"
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
            <SizedText
              labelText="videoLink1"
              inputValue={field.value}
              placeholder="Link to the Video..."
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
          {isSubmitting ? <Spinner size="3" /> : "Submit Game"}
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
