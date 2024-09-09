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
  recreate,
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

  const normalizeData = (localForm: any) => {
    let payloadObject: any = {};
    if (!recreate) {
      if (localForm.playedAs.value === "1") {
        payloadObject["usaPlayerId"] = id;
        payloadObject["ussrPlayerId"] = localForm.opponentWas.value;
      } else if (localForm.playedAs.value === "2") {
        payloadObject["ussrPlayerId"] = id;
        payloadObject["usaPlayerId"] = localForm.opponentWas.value;
      }
    }

    Object.keys(localForm).map((key: string) => {
      if (key !== "playedAs" && key !== "opponentWas") {
        payloadObject[key] = localForm[key].value;
      }
    });
    console.log("payloadObject", payloadObject);
    return payloadObject;
  };
  console.log("id", recreate);
  const opponentFormProp = !recreate ? "opponentWas" : "ussrPlayerId";
  return (
    <Form css={formStyles} onSubmit={(e) => e.preventDefault()}>
      {/* {role === 2 && (
        <>
          {recreate && <RecreateRating oldId={form.oldId} onInputValueChange={onInputValueChange} />}
        </>
      )} */}
      {recreate && <RecreateRating oldId={form.oldId} onInputValueChange={onInputValueChange} />}
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
          key="checkID"
        />
        <DropdownWithLabel
          labelText="typeOfGame"
          key="gameType"
          items={leagueTypes}
          selectedItem={form.gameType.value}
          selectedValueProperty="value"
          selectedInputProperty="text"
          error={form.gameType.error}
          css={{ width: dropdownWidth }}
          onSelect={(value) => onInputValueChange("gameType", value)}
        />
        {!recreate ? (
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
        ) : (
          <UserTypeahead
            labelText="usaPlayer"
            selectedItem={form.usaPlayerId.value}
            selectedValueProperty="value"
            selectedInputProperty="text"
            error={form.usaPlayerId.error}
            placeholder="Type the player name..."
            css={{ width: typeaheadWidth }}
            onSelect={(value) => onInputValueChange("usaPlayerId", value?.value)}
          />
        )}
        <UserTypeahead
          labelText={!recreate ? "opponentWas" : "ussrPlayer"}
          selectedItem={form[opponentFormProp].value}
          selectedValueProperty="value"
          selectedInputProperty="text"
          error={form[opponentFormProp].error}
          css={{ width: typeaheadWidth }}
          placeholder="Type the player name..."
          onSelect={(value: any) => onInputValueChange(opponentFormProp, value?.value)}
          onBlur={() => onInputValueChange(opponentFormProp, "")}
        />
        <DropdownWithLabel
          labelText="gameWinner"
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
        {!recreate && (
          <Button
            disabled={isSubmitting}
            css={{ width: "200px", fontSize: "18px" }}
            onClick={async () => {
              if (!id) {
                setErrorMsg("Error submitting your result. Refresh the page and try again");
                return;
              }
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
        {recreate && (
          <Button
            // disabled={buttonDisabled}
            css={{ width: "200px", fontSize: "18px" }}
            onClick={async (event) => {
              if (validated(form, setForm)) {
                try {
                  setIsSubmitting(true);
                  // @ts-ignore
                  await getAxiosInstance().post(
                    "/api/game/recreate",
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
