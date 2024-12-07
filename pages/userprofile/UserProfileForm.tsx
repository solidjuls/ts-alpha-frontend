import React, { useState } from "react";
import { Form } from "components/Atoms";
import { DropdownWithLabel, EditTextComponent } from "components/EditFormComponents";
import { UserProfileState } from "types/game.types";
import { Button } from "components/Button";
import getAxiosInstance from "utils/axios";
import { Spinner } from "@radix-ui/themes";
import Text from "components/Text";
import { platforms, gameDurations } from "utils/constants";
import CitiesTypeahead from "pages/usercreate/CitiesTypeahead";
const inputWidth = "300px";
const dropdownWidth = "300px";

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
      value: data.preferred_gaming_platform ? [{ code: data.preferred_gaming_platform, name: data.preferred_gaming_platform }] : [],
      error: false,
    },
    preferredGameDuration: {
      value: data.preferred_game_duration ? [{ code: data.preferred_game_duration, name: data.preferred_game_duration }] : [],
      error: false,
    },
    city: {
      value: data.cities?.id,
      error: false,
    },
    phone: {
      value: data.phone_number,
      error: false,
    },
    country: {
      value: [{ code: data.countries?.id, name: data.countries?.country_name }],
      error: false,
    },
  };
};

const UserProfileForm = ({ data, countries }) => {
  const [form, setForm] = useState<UserProfileState>(getInitialState(data));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  console.log("form", form);
  const validated = () => {
    let submit = true;
    Object.keys(form).forEach((key: string) => {
      if (
        !["phone", "preferredGameDuration", "preferredGamingPlatform", "country"].includes(key) &&
        form[key as keyof UserProfileState].value === ""
      ) {
        setForm((prevState: any) => ({
          ...prevState,
          [key]: {
            ...prevState[key],
            error: true,
          },
        }));
        submit = false;
      }
      if (
        ["preferredGameDuration", "preferredGamingPlatform", "country"].includes(key) &&
        form[key as keyof UserProfileState].value.length === 0
      ) {
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

    payloadObject["city"] = form.city.value;
    payloadObject["name"] = form.name.value;
    payloadObject["phone"] = form.phone.value;
    payloadObject["email"] = data.email;
    payloadObject["preferredGameDuration"] = form.preferredGameDuration.value[0].code;
    payloadObject["preferredGamingPlatform"] = form.preferredGamingPlatform.value[0].code;
    payloadObject["country"] = form.country.value[0].code;

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
      <EditTextComponent
        labelText="phone"
        inputValue={form?.phone.value}
        onInputValueChange={(value) => onInputValueChange("phone", value)}
        css={{ width: inputWidth }}
        error={form?.phone.error}
      />
      <DropdownWithLabel
        labelText="preferredGamingPlatform"
        placeholder="Preferred gaming platform"
        items={platforms}
        error={form?.preferredGamingPlatform.error}
        css={{ width: dropdownWidth }}
        selectedItem={form.preferredGamingPlatform.value}
        onSelect={(value: string) => onInputValueChange("preferredGamingPlatform", value)}
      />
      <DropdownWithLabel
        labelText="preferredGameDuration"
        placeholder="Preferred game duration"
        items={gameDurations}
        error={form?.preferredGameDuration.error}
        css={{ width: dropdownWidth }}
        selectedItem={form.preferredGameDuration.value}
        onSelect={(value: string) => onInputValueChange("preferredGameDuration", value)}
      />
      <DropdownWithLabel
        labelText="country"
        items={countries}
        error={form?.country.error}
        css={{ width: dropdownWidth }}
        selectedItem={form.country.value}
        placeholder="Type the country name..."
        onSelect={(value: string) => onInputValueChange("country", value)}
      />
      <CitiesTypeahead
        labelText="city"
        selectedItem={form.city.value}
        selectedValueProperty="value"
        selectedInputProperty="text"
        error={form.city.error}
        placeholder="Type the city name..."
        css={{ width: "300px" }}
        onBlur={() => {
          onInputValueChange("city", "");
        }}
        onSelect={(value) => {
          console.log("sdf", value);
          onInputValueChange("city", value?.value);
        }}
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
