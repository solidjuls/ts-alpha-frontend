import React, { useState } from "react";
import { Form } from "components/Atoms";
import { DropdownWithLabel, EditTextComponent } from "components/EditFormComponents";
import { UserProfileState } from "types/game.types";
import { Button } from "components/Button";
import getAxiosInstance from "utils/axios";
import { Spinner } from "@radix-ui/themes";
import Text from "components/Text";
import { platforms, gameDurations } from 'utils/constants'
const inputWidth = "200px";
const dropdownWidth = "270px";

const formStyles = {
  alignItems: "center",
  backgroundColor: "White",
  width: "640px",
  padding: "12px",
  alignSelf: "center",
  // boxShadow: "rgb(100 100 111 / 20%) 0px 7px 29px 0px",
  "@sm": {
    width: "100%",
  },
};

const getInitialState = (data) => {
  return {
    name: {
      value: data.name,
      error: false,
    },
    preferredGamingPlatform: {
      value: [{ code: data.preferred_gaming_platform, name: data.preferred_gaming_platform }],
      error: false,
    },
    preferredGameDuration: {
      value: [{ code: data.preferred_game_duration, name: data.preferred_game_duration }],
      error: false,
    },
  };
};

const UserProfileForm = ({ data }) => {
  const [form, setForm] = useState<UserProfileState>(getInitialState(data));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
console.log("form", form)
  const validated = () => {
    let submit = true;
    Object.keys(form).forEach((key: string) => {
      if (form[key as keyof UserProfileState].value === "") {
        setForm((prevState: any) => ({
          ...prevState,
          [key]: {
            ...prevState[key],
            error: true,
          },
        }));
        submit = false;
      }
    });
    return submit;
  };

  const onInputValueChange = (key: keyof UserProfileState, value: string | Date) => {
    setForm((prevState) => {
      return {
        ...prevState,
        [key]: {
          value,
          error: prevState[key].error ? value === "" : false,
        },
      };
    });
  };
  const normalizeData = (form: any) => {
    let payloadObject: any = {};
    Object.keys(form).map((key: string) => {
      payloadObject[key] = form[key].value;
    });
    return payloadObject;
  };

  return (
    <Form css={formStyles} onSubmit={(e) => e.preventDefault()}>
      <EditTextComponent
        labelText="playdeckName"
        inputValue={form?.name.value}
        onInputValueChange={(value) => onInputValueChange("name", value)}
        css={{ width: inputWidth }}
        error={form?.name.error}
      />
      <DropdownWithLabel
        labelText="preferredGamingPlatform"
        items={platforms}
        error={form?.preferredGamingPlatform.error}
        css={{ width: dropdownWidth }}
        selectedItem={form.preferredGamingPlatform.value}
        onSelect={(value: string) => onInputValueChange("preferredGamingPlatform", value)}
      />
      <DropdownWithLabel
        labelText="preferredGameDuration"
        items={gameDurations}
        error={form?.preferredGameDuration.error}
        css={{ width: dropdownWidth }}
        selectedItem={form.preferredGameDuration.value}
        onSelect={(value: string) => onInputValueChange("preferredGameDuration", value)}
      />
      {confirmationMsg && <Text css={{ color: "green" }}>{confirmationMsg}</Text>}
      {errorMsg && <Text type="error">{errorMsg}</Text>}
      <Button
        disabled={isSubmitting}
        css={{ width: "200px", fontSize: "18px" }}
        onClick={async () => {
          if (validated()) {
            try {
              setIsSubmitting(true);
              // @ts-ignore
              await getAxiosInstance().post("/api/user/", {
                ...normalizeData(form),
              });
              setConfirmationMsg("Profile updated correctly");
            } catch {
              setErrorMsg("There was an error updating the profile");
            } finally {
              setIsSubmitting(false);
            }
          }
        }}
      >
        {isSubmitting ? <Spinner size="3" /> : "Submit"}
      </Button>
    </Form>
  );
};

export default UserProfileForm;
