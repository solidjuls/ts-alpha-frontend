import React from "react";

import TextComponent from "./TextComponent";
import { Box } from "components/Atoms";

import { Label } from "components/Label";
import { SubmitFormValue, SubmitFormState } from "types/game.types";

const RecreateRating = ({
  oldId,
  onInputValueChange,
}: {
  oldId: SubmitFormValue<string>;
  onInputValueChange: (key: keyof SubmitFormState, value: string | Date) => void;
}) => {
  return (
    <Box>
      <Box
        css={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid black",
          borderRadius: "4px",
          padding: "8px",
        }}
      >
        <Label>
          Add the ID of the game you want recreated. Then, enter the new data using the form as
          usual{" "}
        </Label>
        <TextComponent
          labelText="oldId"
          inputValue={oldId.value}
          onInputValueChange={(value) => onInputValueChange("oldId", value)}
          css={{ width: "50px" }}
          error={oldId.error}
        />
      </Box>
    </Box>
  );
};

export default RecreateRating;
