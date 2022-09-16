import React, { useState } from "react";
import { TextComponent } from "./TextComponent";
import { Box } from "components/Atoms";
import { Checkbox } from "components/Checkbox";
import { Label } from "components/Label";
import { SubmitFormValue, SubmitFormState } from "types/game.types";

const RecreateRating = ({
  oldId,
  onInputValueChange,
  checked,
  setChecked,
}: {
  oldId: SubmitFormValue<string>;
  onInputValueChange: (
    key: keyof SubmitFormState,
    value: string | Date
  ) => void;
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Box>
      <Checkbox
        checked={checked}
        onCheckedChange={(value: boolean) => setChecked(value)}
        text="Activate rating recreation"
        css={{ marginBottom: "8px" }}
      />
      {checked && (
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
            Add the ID of the game you want recreated. Then, enter the new data
            using the form as usual{" "}
          </Label>
          <TextComponent
            labelText="oldId"
            inputValue={oldId.value}
            onInputValueChange={(value) => onInputValueChange("oldId", value)}
            css={{ width: "50px" }}
            error={oldId.error}
          />
        </Box>
      )}
    </Box>
  );
};

export { RecreateRating };
