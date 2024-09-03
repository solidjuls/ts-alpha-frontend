import React, { useState } from "react";
import { Form } from "components/Atoms";
import { DropdownWithLabel, EditTextComponent } from "components/EditFormComponents";
import { UserProfileState } from "types/game.types";
import { Button } from "components/Button";
import getAxiosInstance from "utils/axios";
import { Spinner } from "@radix-ui/themes";
import Text from "components/Text";

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

const platforms = [
  {
    value: "PC - Steam (Playdek)",
    text: "PC - Steam (Playdek)",
  },
  {
    value: "In person (Physical Game)",
    text: "In person (Physical Game)",
  },
  {
    value: "Mobile - Android App (Playdek)",
    text: "Mobile - Android App (Playdek)",
  },
  {
    value: "Mobile - Ios App (Playdek)",
    text: "Mobile - Ios App (Playdek)",
  },
  {
    value: "Mac - Steam (Playdek)",
    text: "Mac - Steam (Playdek)",
  },
  {
    value: "PC - Saito",
    text: "PC - Saito",
  },
  {
    value: "PC - Wargamesroom",
    text: "PC - Wargamesroom",
  },
  {
    value: "Vassal",
    text: "Vassal",
  },
];

const gameDurations = [
  {
    value: "30 minutes",
    text: "30 minutes",
  },
  {
    value: "45 minutes",
    text: "45 minutes",
  },
  {
    value: "60 minutes",
    text: "60 minutes",
  },
  {
    value: "90 minutes",
    text: "90 minutes",
  },
  {
    value: "3 hours",
    text: "3 hours",
  },
  {
    value: "Asynch - 3 days",
    text: "Asynch - 3 days",
  },
  {
    value: "Asynch - 7 days",
    text: "Asynch - 7 days",
  },
  {
    value: "Asynch - 21 days",
    text: "Asynch - 21 days",
  },
  {
    value: "Asynch - 45 days",
    text: "Asynch - 45 days",
  },
];

const getInitialState = (data) => {
  return {
    name: {
      value: data.name,
      error: false,
    },
    preferredGamingPlatform: {
      value: data.preferred_gaming_platform,
      error: false,
    },
    preferredGameDuration: {
      value: data.preferred_game_duration,
      error: false,
    },
  };
};

const UserProfileForm = ({ data }) => {
  const [form, setForm] = useState<UserProfileState>(getInitialState(data));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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
        console.log("key", key, form[key as keyof UserProfileState].value);
        submit = false;
      }
    });
    return submit;
  };

  const onInputValueChange = (key: keyof UserProfileState, value: string | Date) => {
    setForm((prevState) => {
      console.log("key value", prevState, key, value);
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
