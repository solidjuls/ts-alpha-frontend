import { useState } from "react";
import { Spinner } from "@radix-ui/themes";
import { Form } from "components/Atoms"
import { Button } from "components/Button";
import { DetailContainer } from "components/DetailContainer"
import { DropdownWithLabel, EditTextComponent } from "components/EditFormComponents";
import DateComponent from "components/EditFormComponents/DateComponent";
import { EditTextAreaComponent } from "components/EditFormComponents/EditTextArea";
import useFetchInitialData from "hooks/useFetchInitialData";
import UserTypeahead from "pages/submitform/UserTypeahead";
import getAxiosInstance from "utils/axios";
import { TournamentCreateState } from "types/game.types";
import { DropdownItemType } from "types/types";
import { UserType } from "types/user.types";
import { tournamentStatus } from "utils/constants";
import { useRouter } from "next/router";

const inputWidth = "370px";
const dropdownWidth = "370px";
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
    tournamentName: {
      value: "",
      error: false,
    },
    statusId: {
      value: "4",
      error: false,
    },
    description: {
      value: "",
      error: false,
    },
    startingDate: {
      value: new Date(),
      error: false,
    },
    admins: {
      value: "",
      error: false,
    },
  };
};

const TournamentCreate = () => {
  const router = useRouter();
  const [form, setForm] = useState<TournamentCreateState>(() => getInitialState());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { data: users, isLoading: loadingUsers } = useFetchInitialData<UserType[]>({
    url: "/api/user",
    cacheId: "user-list",
  });

  if (!users) return null

  const validated = () => {
    let submit = true;
    Object.keys(form).forEach((key: string) => {
      if (["tournamentName", "statusId", "admins"].includes(key) &&
        form[key as keyof TournamentCreateState].value === ""
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

  const onInputValueChange = (key: keyof TournamentCreateState, value: string | Date) => {
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

  const statusIds = Object.entries(tournamentStatus).map(([key, value]) => ({
    value: value.toString(),
    text: key,
  }));
    const usersParsed: DropdownItemType[] =
      users?.map((item) => ({
        value: item.id,
        text: item.name,
      })) || [];
  const formattedDate = form?.startingDate.value ? new Date(form?.startingDate.value) : new Date()

  return      <DetailContainer>
      <Form css={formStyles} onSubmit={(e) => e.preventDefault()}>
        <EditTextComponent
          labelText="tournamentName"
          inputValue={form?.tournamentName.value}
          onInputValueChange={(value) => onInputValueChange("tournamentName", value)}
          css={{ width: inputWidth }}
          error={form?.tournamentName.error}
        />
        <DropdownWithLabel
          labelText="statusId"
          items={statusIds}
          error={form?.statusId?.error}
          css={{ width: inputWidth }}
          selectedItem={form.statusId?.value}
          placeholder="Status Id"
          onSelect={(value: string) => onInputValueChange("statusId", value)}
        />
        <UserTypeahead
          labelText="admins"
          selectedItem={form.admins.value}
          error={form.admins.error}
          users={usersParsed}
          placeholder="Type the admin name..."
          css={{ width: dropdownWidth }}
          onBlur={() => {
            onInputValueChange("admins", "");
          }}
          onSelect={(value: DropdownItemType) =>
            onInputValueChange("admins", value?.value || "")
          }
        />
        <DateComponent
          labelText="startingDate"
          inputValue={formattedDate}
          onInputValueChange={(value) => onInputValueChange("startingDate", value)}
          error={form?.startingDate.error}
        />
        <EditTextAreaComponent
          labelText="tournamentDescription"
          inputValue={form?.description.value}
          onInputValueChange={(value) => onInputValueChange("description", value)}
          css={{ width: "500px", height: "200px" }}
          error={form?.description.error}
        />
        <Button
          disabled={isSubmitting}
          css={{ width: "200px", fontSize: "18px" }}
          onClick={async () => {
            if (validated()) {
              try {
                setIsSubmitting(true);
                // @ts-ignore
                await getAxiosInstance().patch("/api/game/tournaments", {
                  name: form?.tournamentName.value,
                  status: form?.statusId.value,
                  admins: form.admins.value,
                  startingDate: form?.startingDate.value,
                  description: form?.description.value
                });
                setConfirmationMsg("Tournament created correctly");
                router.push("/tournaments");
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
    </DetailContainer>
        
}

export default TournamentCreate
