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
          borderRadius: "4px",
        }}
      >
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
