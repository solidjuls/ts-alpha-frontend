import React from "react";
import { useRouter } from "next/router";
import { trpc } from "contexts/APIProvider";
import TextComponent from "./TextComponent";
import DateComponent from "./DateComponent";
import RecreateRating from "./RecreateRating";
import { gameWinningOptions, endType, turns, leagueTypes } from "utils/constants";
import { Button } from "components/Button";
import { GAME_QUERY } from "utils/constants";
import { Box, Form } from "components/Atoms";
import UserTypeahead from "./UserTypeahead";
import { Checkbox } from "components/Checkbox";
import WithLabel from "./WithLabel";
import DropdownMenu, { DropdownItemType } from "components/DropdownMenu";
import type { SubmitFormState } from "types/game.types";

const dropdownWidth = "270px";
const typeaheadWidth = "250px";

const formStyles = {
  alignItems: "center",
  backgroundColor: "White",
  width: "640px",
  alignSelf: "center",
  // boxShadow: "rgb(100 100 111 / 20%) 0px 7px 29px 0px",
  "@sm": {
    width: "100%",
  },
};

type DropdownWithLabelProps = {
  labelText: string;
  selectedItem: string;
  onSelect: (value: string) => void;
  items: DropdownItemType[];
  selectedValueProperty?: string;
  selectedInputProperty?: string;
  error: boolean;
  css: any;
};

const DropdownWithLabel = ({
  labelText,
  selectedItem,
  onSelect,
  items,
  error,
  css,
  ...rest
}: DropdownWithLabelProps) => (
  <WithLabel labelText={labelText}>
    <DropdownMenu
      items={items}
      selectedItem={selectedItem}
      onSelect={onSelect}
      css={css}
      {...rest}
      error={error}
    />
  </WithLabel>
);

type SubmitFormProps = {
  validated: (
    form: SubmitFormState,
    setForm: React.Dispatch<React.SetStateAction<SubmitFormState>>,
  ) => boolean;
  role: number;
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  form: SubmitFormState;
  onInputValueChange: (key: keyof SubmitFormState, value: string | Date) => void;
  buttonDisabled: boolean;
  setButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setForm: React.Dispatch<React.SetStateAction<SubmitFormState>>;
};

const formatResultConfirmation = (result: string[]) =>
  result.reduce((prev, current) => {
    return `${prev} ${current} \n`;
  }, "");

const normalizeData = (form: any) => {
  let payloadObject: any = {};
  Object.keys(form).map((key: string) => {
    payloadObject[key] = form[key].value;
  });
  return payloadObject;
};

const SubmitForm = ({
  validated,
  role,
  checked,
  setChecked,
  form,
  onInputValueChange,
  buttonDisabled,
  setButtonDisabled,
  setForm,
}: SubmitFormProps) => {
  const router = useRouter();
  const trpcUtils = trpc.useContext();

  const gameSubmitMutation = trpc.useMutation(["game-submit"], {
    onSuccess: async () => {
      trpcUtils.queryClient.invalidateQueries();
      if (window) window.location.href = "/";
    },
    onError: (error, variables, context) =>
      console.log("error gameSubmitMutation", error, variables, context),
  });
  const gameConfirmRecreation = trpc.useMutation(["game-restoreConfirm"], {
    onSuccess: (props) => console.log("success gameConfirmRecreation", props),
    onError: (error, variables, context) =>
      console.log("error gameConfirmRecreation", error, variables, context),
    onSettled: (props) => console.log("onSettled gameConfirmRecreation", props),
  });
  const gameRecreationMutation = trpc.useMutation(["game-restore"], {
    onSuccess: () => trpcUtils.invalidateQueries(),
    onError: (error, variables, context) =>
      console.log("error gameRecreationMutation", error, variables, context),
    onSettled: (props) => console.log("onSettled gameRecreationMutation", props),
  });

  return (
    <Form css={formStyles} onSubmit={(e) => e.preventDefault()}>
      {role === 2 && (
        <>
          <Checkbox
            checked={checked}
            onCheckedChange={(value: boolean) => setChecked(value)}
            text="Activate rating recreation"
            css={{ marginBottom: "8px" }}
          />
          {checked && <RecreateRating oldId={form.oldId} onInputValueChange={onInputValueChange} />}
        </>
      )}
      <Box
        css={{
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "12px",
        }}
      >
        <TextComponent
          labelText="checkID"
          inputValue={form.gameCode.value}
          onInputValueChange={(value) => onInputValueChange("gameCode", value)}
          css={{ width: "50px" }}
          error={form.gameCode.error}
        />
        <DropdownWithLabel
          labelText="typeOfGame"
          items={leagueTypes}
          selectedItem={form.gameType.value}
          selectedValueProperty="value"
          selectedInputProperty="text"
          error={form.gameType.error}
          css={{ width: dropdownWidth }}
          onSelect={(value) => onInputValueChange("gameType", value)}
        />
        <UserTypeahead
          labelText="playerUSA"
          selectedItem={form.usaPlayerId.value}
          selectedValueProperty="value"
          selectedInputProperty="text"
          error={form.usaPlayerId.error}
          css={{ width: typeaheadWidth }}
          onSelect={(value: any) => onInputValueChange("usaPlayerId", value?.value)}
          onBlur={() => onInputValueChange("usaPlayerId", "")}
        />
        <UserTypeahead
          labelText="playerURSS"
          selectedItem={form.ussrPlayerId.value}
          error={form.ussrPlayerId.error}
          css={{ width: typeaheadWidth }}
          selectedValueProperty="value"
          selectedInputProperty="text"
          onSelect={(value: any) => onInputValueChange("ussrPlayerId", value?.value)}
          onBlur={() => onInputValueChange("ussrPlayerId", "")}
        />
        <DropdownWithLabel
          labelText="gameWinner"
          items={gameWinningOptions}
          selectedItem={form.gameWinner.value as string}
          error={form.gameWinner.error}
          css={{ width: dropdownWidth }}
          onSelect={(value: string) => onInputValueChange("gameWinner", value)}
        />
        <DropdownWithLabel
          labelText="endTurn"
          items={turns}
          error={form.endTurn.error}
          selectedItem={form.endTurn.value}
          css={{ width: dropdownWidth }}
          onSelect={(value: string) => onInputValueChange("endTurn", value)}
        />
        <DropdownWithLabel
          labelText="endType"
          items={endType}
          error={form.endMode.error}
          css={{ width: dropdownWidth }}
          selectedItem={form.endMode.value}
          onSelect={(value: string) => onInputValueChange("endMode", value)}
        />
        <DateComponent
          labelText="gameDate"
          inputValue={form.gameDate.value}
          // error={form.gameDate.error}
          onInputValueChange={(value: Date) => onInputValueChange("gameDate", value)}
        />
        <TextComponent
          labelText="videoLink1"
          inputValue={form.video1.value}
          error={form.video1.error}
          onInputValueChange={(value: string) => onInputValueChange("video1", value)}
        />
        {!checked && (
          <Button
            // disabled={buttonDisabled}
            css={{ width: "200px", fontSize: "18px" }}
            onClick={async (event) => {
              if (validated(form, setForm)) {
                event.currentTarget.disabled = true;
                // @ts-ignore
                await gameSubmitMutation.mutate({
                  data: normalizeData(form),
                });
              }
            }}
          >
            Submit
          </Button>
        )}
        {checked && (
          <Button
            // disabled={buttonDisabled}
            css={{ width: "200px", fontSize: "18px" }}
            onClick={async (event) => {
              // event.currentTarget.disabled = true;
              // @ts-ignore
              const result = await gameConfirmRecreation.mutateAsync({
                id: form.oldId.value,
              });
              console.log("result", result);
              if (
                window.confirm(
                  `This games will be recreated. \n ${formatResultConfirmation(
                    result,
                  )}. Do you want to proceed?`,
                )
              ) {
                if (validated(form, setForm)) {
                  // @ts-ignore
                  await gameRecreationMutation.mutateAsync({
                    data: normalizeData(form),
                  });
                  // setButtonDisabled(true);
                }
              }
            }}
          >
            Recreate Game
          </Button>
        )}
      </Box>
    </Form>
  );
};

export default SubmitForm;
