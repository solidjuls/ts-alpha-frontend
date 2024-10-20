import React, { useState } from "react";
import { useRouter } from "next/router";
import Text from "components/Text";
import TextComponent from "./TextComponent";
import DateComponent from "./DateComponent";
import RecreateRating from "./RecreateRating";

import { gameWinningOptions, endType, turns, gameSides } from "utils/constants";
import { Button } from "components/Button";
import { Box, Form } from "components/Atoms";
import UserTypeahead from "./UserTypeahead";
import type { SubmitFormState } from "types/game.types";
import { DropdownWithLabel } from "components/EditFormComponents";
import getAxiosInstance from "utils/axios";
import { Spinner } from "@radix-ui/themes";
import { useSession } from "contexts/AuthProvider";
import useFetchInitialData from "hooks/useFetchInitialData";

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
  const { data: users } = useFetchInitialData({ url: "/api/user", cacheId: "user-list" });
  const { id } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { data } = useFetchInitialData({
    url: `/api/game/tournaments`,
    cacheId: "tournament-list",
  });
  const leagueTypes = data?.map((item) => ({
    value: item.code,
    text: item.text,
  }));
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

    return payloadObject;
  };
console.log("state", form)
//users?.map((item) => ({ code: item.id, name: item.name }))
  const opponentFormProp = !recreate ? "opponentWas" : "ussrPlayerId";
  return (
    <Form css={formStyles} onSubmit={(e) => e.preventDefault()}>
      {recreate && <RecreateRating oldId={form.oldId} onInputValueChange={onInputValueChange} />}
      <Box
        css={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "15px"
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
          // selectedValueProperty="value"
          // selectedInputProperty="text"
          error={form.gameType.error}
          css={{ width: dropdownWidth }}
          onSelect={(value) => onInputValueChange("gameType", value)}
        />
        {/* <Box css={{ width: dropdownWidth }}>
          <MultiSelect
            items={leagueTypes.map((item) => ({ code: item.value, name: item.text }))}
            placeholder="Select tournament..."
            selectedValues={form.gameType.value}
            setSelectedValues={(value) => onInputValueChange("gameType", value)}
            selectionLimit={1}
          />
        </Box> */}
        {!recreate ? (
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
        <DropdownWithLabel
          labelText={!recreate ? "opponentWas" : "ussrPlayer"}
          placeholder="Your opponent was..."
          items={gameWinningOptions}
          selectedItem={form.gameWinner.value as string}
          selectedValueProperty="value"
          selectedInputProperty="text"
          error={form.gameWinner.error}
          css={{ width: dropdownWidth }}
          onSelect={(value: string) => onInputValueChange("gameWinner", value)}
        />
        {/* <UserTypeahead
          labelText={!recreate ? "opponentWas" : "ussrPlayer"}
          selectedItem={form[opponentFormProp].value}
          selectedValueProperty="value"
          selectedInputProperty="text"
          error={form[opponentFormProp].error}
          css={{ width: typeaheadWidth }}
          placeholder="Type the player name..."
          onSelect={(value: any) => onInputValueChange(opponentFormProp, value?.value)}
          onBlur={() => onInputValueChange(opponentFormProp, "")}
        /> */}
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
        <TextComponent
          labelText="videoLink1"
          inputValue={form.video1.value}
          placeholder="Link to the video..."
          error={form.video1.error}
          css={{ width: "500px" }}
          onInputValueChange={(value: string) => onInputValueChange("video1", value)}
        />
        <DateComponent
          labelText="gameDate"
          inputValue={form.gameDate.value}
          // error={form.gameDate.error}
          onInputValueChange={(value: Date) => onInputValueChange("gameDate", value)}
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
                  console.log("error submitform", e);
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
                  setErrorMsg(e.response.data || "There was an error submitting the result");
                } finally {
                  setIsSubmitting(false);
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
