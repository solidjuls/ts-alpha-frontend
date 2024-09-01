import React, { useState } from "react";
import { useRouter } from "next/router";
import Text from "components/Text";
import TextComponent from "./TextComponent";
import DateComponent from "./DateComponent";
import RecreateRating from "./RecreateRating";
import { gameWinningOptions, endType, turns, leagueTypes, gameSides } from "utils/constants";
import { Button } from "components/Button";
import { GAME_QUERY } from "utils/constants";
import { Box, Form } from "components/Atoms";
import UserTypeahead from "./UserTypeahead";
import { Checkbox } from "components/Checkbox";
import type { SubmitFormState } from "types/game.types";
import { DropdownWithLabel } from "components/EditFormComponents";
import getAxiosInstance from "utils/axios";
import { Spinner } from "@radix-ui/themes";
import { useSession } from "contexts/AuthProvider";

const dropdownWidth = "270px";
const typeaheadWidth = "250px";

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
  const { id } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  // const gameSubmitMutation = trpc.useMutation(["game-submit"], {
  //   onSuccess: async () => {
  //     trpcUtils.queryClient.invalidateQueries();
  //     if (window) window.location.href = "/";
  //   },
  //   onError: (error, variables, context) =>
  //     console.log("error gameSubmitMutation", error, variables, context),
  // });
  // const gameConfirmRecreation = trpc.useMutation(["game-restoreConfirm"], {
  //   onSuccess: (props) => console.log("success gameConfirmRecreation", props),
  //   onError: (error, variables, context) =>
  //     console.log("error gameConfirmRecreation", error, variables, context),
  //   onSettled: (props) => console.log("onSettled gameConfirmRecreation", props),
  // });
  // const gameRecreationMutation = trpc.useMutation(["game-restore"], {
  //   onSuccess: () => trpcUtils.invalidateQueries(),
  //   onError: (error, variables, context) =>
  //     console.log("error gameRecreationMutation", error, variables, context),
  //   onSettled: (props) => console.log("onSettled gameRecreationMutation", props),
  // });

  const normalizeData = (localForm: any) => {
    let payloadObject: any = {};
    if (localForm.playedAs.value === "1") {
      payloadObject["usaPlayerId"] = id;
      payloadObject["ussrPlayerId"] = localForm.opponentWas.value;
    } else if (localForm.playedAs.value === "2") {
      payloadObject["ussrPlayerId"] = id;
      payloadObject["usaPlayerId"] = localForm.opponentWas.value;
    }

    Object.keys(localForm).map((key: string) => {
      if (key !== "playedAs" && key !== "opponentWas") {
        payloadObject[key] = localForm[key].value;
      }
    });
    console.log("payloadObject", payloadObject);
    return payloadObject;
  };
  console.log("form", form);
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
        <DropdownWithLabel
          labelText="PlayedAs"
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
          selectedValueProperty="value"
          selectedInputProperty="text"
          error={form.opponentWas.error}
          css={{ width: typeaheadWidth }}
          placeholder="Type the player name..."
          onSelect={(value: any) => onInputValueChange("opponentWas", value?.value)}
          onBlur={() => onInputValueChange("opponentWas", "")}
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
            disabled={isSubmitting}
            css={{ width: "200px", fontSize: "18px" }}
            onClick={async () => {
              if (validated(form, setForm)) {
                try {
                  setIsSubmitting(true);
                  // @ts-ignore
                  await getAxiosInstance().post(
                    "/api/game/submit",
                    {
                      data: normalizeData(form),
                    },
                    {
                      cache: {
                        update: {
                          "game-list": "delete",
                        },
                      },
                    },
                  );
                  router.push("/");
                } catch (e) {
                  console.log("error", e);
                  setErrorMsg("There was an error submitting the result");
                } finally {
                  setIsSubmitting(false);
                }
              }
            }}
          >
            {isSubmitting ? <Spinner size="3" /> : "Submit"}
          </Button>
        )}
        {errorMsg && <Text type="error">{errorMsg}</Text>}
        {checked && (
          <Button
            // disabled={buttonDisabled}
            css={{ width: "200px", fontSize: "18px" }}
            onClick={async (event) => {
              // event.currentTarget.disabled = true;
              // @ts-ignore
              // const result = await gameConfirmRecreation.mutateAsync({
              //   id: form.oldId.value,
              // });
              // console.log("result", result);
              // if (
              //   window.confirm(
              //     `This games will be recreated. \n ${formatResultConfirmation(
              //       result,
              //     )}. Do you want to proceed?`,
              //   )
              // ) {
              //   if (validated(form, setForm)) {
              //     // @ts-ignore
              //     await gameRecreationMutation.mutateAsync({
              //       data: normalizeData(form),
              //     });
              //     // setButtonDisabled(true);
              //   }
              // }
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
