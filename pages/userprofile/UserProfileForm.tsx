import React, { useState } from "react";
import { Form } from "components/Atoms";
import { DropdownWithLabel, EditTextComponent } from "components/EditFormComponents";
import { UserProfileState } from "types/game.types";
import { Button } from "components/Button";
import { trpc } from "contexts/APIProvider";

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
    firstName: {
      value: data.first_name,
      error: false,
    },
    lastName: {
      value: data.last_name,
      error: false,
    },
    name: {
      value: data.name,
      error: false,
    },
    email: {
      value: data.email,
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
    timeZoneId: {
      value: data.timezone_id,
      error: false,
    },
  };
};

const initialState: UserProfileState = {
  firstName: {
    value: "",
    error: false,
  },
  lastName: {
    value: "",
    error: false,
  },
  name: {
    value: "",
    error: false,
  },
  email: {
    value: "",
    error: false,
  },
  preferredGamingPlatform: {
    value: "",
    error: false,
  },
  preferredGameDuration: {
    value: "",
    error: false,
  },
  timeZoneId: {
    value: "",
    error: false,
  },
};

const UserProfileForm = ({ data }) => {
  const [form, setForm] = useState<UserProfileState>(getInitialState(data) || initialState);
  const userUpdateMutation = trpc.useMutation(["user-update-profile"], {
    onSuccess: (props) => console.log("success gameConfirmRecreation", props),
    onError: (error, variables, context) =>
      console.log("error gameConfirmRecreation", error, variables, context),
    onSettled: (props) => console.log("onSettled gameConfirmRecreation", props),
  });

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
          console.log("key", key, form[key as keyof UserProfileState].value)
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
console.log("form", form)
  return (
    <Form css={formStyles} onSubmit={(e) => e.preventDefault()}>
      <EditTextComponent
        labelText="firstName"
        inputValue={form?.firstName.value}
        onInputValueChange={(value) => onInputValueChange("firstName", value)}
        css={{ width: inputWidth }}
        error={form?.firstName.error}
      />
      <EditTextComponent
        labelText="lastName"
        inputValue={form?.lastName.value}
        onInputValueChange={(value) => onInputValueChange("lastName", value)}
        css={{ width: inputWidth }}
        error={form?.lastName.error}
      />
      <EditTextComponent
        labelText="playdeckName"
        inputValue={form?.name.value}
        onInputValueChange={(value) => onInputValueChange("name", value)}
        css={{ width: inputWidth }}
        error={form?.name.error}
      />
      <EditTextComponent
        labelText="mail"
        inputValue={form?.email.value}
        onInputValueChange={(value) => onInputValueChange("email", value)}
        css={{ width: inputWidth }}
        error={form?.email.error}
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
      <EditTextComponent
        labelText="timeZone"
        inputValue={form?.timeZoneId.value}
        onInputValueChange={(value) => onInputValueChange("timeZoneId", value)}
        css={{ width: inputWidth }}
        error={form?.timeZoneId.error}
      />
      <Button
            // disabled={buttonDisabled}
            css={{ width: "200px", fontSize: "18px" }}
            onClick={async (event) => {
              if (validated()) {
                event.currentTarget.disabled = true;
                // @ts-ignore
                const ddd = normalizeData(form)
                console.log("valida", ddd)
                await userUpdateMutation.mutate({
                  ...normalizeData(form),
                });
              }
            }}
          >
            Submit
          </Button>
    </Form>
  );
};

export { UserProfileForm };
