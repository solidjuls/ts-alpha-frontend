import React, { useState } from "react";
import { Form } from "components/Atoms";
import { EditTextComponent } from "components/EditFormComponents";
import { UserProfileState } from "types/game.types";

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

// const initialState: UserProfileState = ;

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
      value: data.preferredGamingPlatform,
      error: false,
    },
    preferredGameDuration: {
      value: data.preferredGameDuration,
      error: false,
    },
    timeZoneId: {
      value: data.timeZoneId,
      error: false,
    },
  };
};

const UserProfileForm = ({ data }) => {
  const [form, setForm] = useState<UserProfileState>(getInitialState(data));

  const onInputValueChange = (key: keyof UserProfileState, value: string) => {
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

  return (
    <Form css={formStyles} onSubmit={(e) => e.preventDefault()}>
      <EditTextComponent
        labelText="First Name"
        inputValue={form?.firstName.value}
        onInputValueChange={(value) => onInputValueChange("firstName", value)}
        css={{ width: "50px" }}
        error={form?.firstName.error}
      />
      <EditTextComponent
        labelText="Last Name"
        inputValue={form?.lastName.value}
        onInputValueChange={(value) => onInputValueChange("lastName", value)}
        css={{ width: "50px" }}
        error={form?.lastName.error}
      />
      <EditTextComponent
        labelText="Playdeck Name"
        inputValue={form?.name.value}
        onInputValueChange={(value) => onInputValueChange("name", value)}
        css={{ width: "50px" }}
        error={form?.name.error}
      />
      <EditTextComponent
        labelText="Email"
        inputValue={form?.email.value}
        onInputValueChange={(value) => onInputValueChange("email", value)}
        css={{ width: "50px" }}
        error={form?.email.error}
      />
      <EditTextComponent
        labelText="Preferred Gaming Platform"
        inputValue={form?.preferredGamingPlatform.value}
        onInputValueChange={(value) => onInputValueChange("preferredGamingPlatform", value)}
        css={{ width: "50px" }}
        error={form?.preferredGamingPlatform.error}
      />
      <EditTextComponent
        labelText="Preferred Game Duration"
        inputValue={form?.preferredGameDuration.value}
        onInputValueChange={(value) => onInputValueChange("preferredGameDuration", value)}
        css={{ width: "50px" }}
        error={form?.preferredGameDuration.error}
      />
      <EditTextComponent
        labelText="Time Zone"
        inputValue={form?.timeZoneId.value}
        onInputValueChange={(value) => onInputValueChange("timeZoneId", value)}
        css={{ width: "50px" }}
        error={form?.timeZoneId.error}
      />
    </Form>
  );
};

export { UserProfileForm };
