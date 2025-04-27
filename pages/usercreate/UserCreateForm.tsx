import React, { useState } from "react";
import { Spinner } from "@radix-ui/themes";
import { Form } from "components/Atoms";
import { DropdownWithLabel, EditTextComponent } from "components/EditFormComponents";
import { UserCreateState } from "types/game.types";
import { Button } from "components/Button";
import getAxiosInstance from "utils/axios";
import Text from "components/Text";
import CitiesTypeahead from "./CitiesTypeahead";
import { platforms, gameDurations } from "utils/constants";
import { DropdownItemType } from "types/types";
import CountriesTypeahead from "./CountriesTypeahead";

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

const getInitialState = () => {
  return {
    name: {
      value: "",
      error: false,
    },
    preferredGamingPlatform: {
      value: undefined,
      error: false,
    },
    preferredGameDuration: {
      value: undefined,
      error: false,
    },
    city: {
      value: "",
      error: false,
    },
    phone: {
      value: "",
      error: false,
    },
    country: {
      value: "",
      error: false,
    },
    first_name: {
      value: "",
      error: false,
    },
    last_name: {
      value: "",
      error: false,
    },
    email: {
      value: "",
      error: false,
    },
  };
};

type UserCreateFormProps = {
  countries?: DropdownItemType[];
  cities?: DropdownItemType[];
};

const UserCreateForm: React.FC<UserCreateFormProps> = ({ countries, cities }) => {
  const [form, setForm] = useState<UserCreateState>(() => getInitialState());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const validated = () => {
    let submit = true;
    Object.keys(form).forEach((key: string) => {
      if (
        !["phone", "preferredGameDuration", "preferredGamingPlatform", "country"].includes(key) &&
        form[key as keyof UserCreateState].value === ""
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
        form[key as keyof UserCreateState].value.length === 0
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

  const onInputValueChange = (key: keyof UserCreateState, value: string | Date) => {
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
  
  const normalizeData = (localForm: UserCreateState) => {
    let payloadObject: Partial<Record<keyof UserCreateState, string>> = {};

    payloadObject["city"] = localForm.city.value;
    payloadObject["first_name"] = localForm.first_name.value;
    payloadObject["last_name"] = localForm.last_name.value;
    payloadObject["name"] = localForm.name.value;
    payloadObject["email"] = localForm.email.value;
    payloadObject["phone"] = localForm.phone.value;

    payloadObject["preferredGameDuration"] = localForm.preferredGameDuration.value;
    payloadObject["preferredGamingPlatform"] = localForm.preferredGamingPlatform.value;
    payloadObject["country"] = localForm.country.value;

    return payloadObject;
  };

  return (
    <Form css={formStyles} onSubmit={(e) => e.preventDefault()}>
      <EditTextComponent
        labelText="firstName"
        inputValue={form?.first_name.value}
        onInputValueChange={(value) => onInputValueChange("first_name", value)}
        css={{ width: inputWidth }}
        error={form?.first_name.error}
      />
      <EditTextComponent
        labelText="lastName"
        inputValue={form?.last_name.value}
        onInputValueChange={(value) => onInputValueChange("last_name", value)}
        css={{ width: inputWidth }}
        error={form?.last_name.error}
      />
      <EditTextComponent
        labelText="mail"
        inputValue={form?.email.value}
        onInputValueChange={(value) => onInputValueChange("email", value)}
        css={{ width: inputWidth }}
        error={form?.email.error}
      />
      <EditTextComponent
        labelText="playdekName"
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
        items={platforms}
        error={form?.preferredGamingPlatform?.error}
        css={{ width: dropdownWidth }}
        selectedItem={form.preferredGamingPlatform?.value}
        placeholder="Preferred gaming platform"
        onSelect={(value: string) => onInputValueChange("preferredGamingPlatform", value)}
      />
      <DropdownWithLabel
        labelText="preferredGameDuration"
        items={gameDurations}
        error={form?.preferredGameDuration.error}
        css={{ width: dropdownWidth }}
        selectedItem={form.preferredGameDuration.value}
        placeholder="Preferred game duration"
        onSelect={(value: string) => onInputValueChange("preferredGameDuration", value)}
      />
      <CountriesTypeahead
        labelText="country"
        placeholder="Type the federation name..."
        css={{ width: "300px" }}
        onBlur={() => {
          onInputValueChange("country", "");
        }}
        onSelect={(value) => onInputValueChange("country", value?.value)}
        items={countries}
        error={form?.country.error}
        selectedItem={form.country.value}
      />
      <CitiesTypeahead
        labelText="city"
        items={cities}
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
              await getAxiosInstance().put("/api/user/", {
                ...normalizeData(form),
              });
              setConfirmationMsg("Profile updated correctly");
            } catch (e) {
              setErrorMsg(e?.response?.data);
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

export default UserCreateForm;
