import { useState } from "react";
import { Spinner } from "@radix-ui/themes";
import { Form } from "components/Atoms"
import { Button } from "components/Button";
import { DetailContainer } from "components/DetailContainer"
import { DropdownWithLabel, EditTextComponent } from "components/EditFormComponents";
import DateComponent from "components/EditFormComponents/DateComponent";
import { EditTextAreaComponent } from "components/EditFormComponents/EditTextArea";
import { useAllUsers } from "hooks/useUsers";
import { useCreateTournament } from "hooks/useTournaments";
import { User, UsersListResponse } from "services/users.service";
import UserTypeahead from "pages/submitform/UserTypeahead";
import { TournamentCreateState } from "types/game.types";
import { DropdownItemType } from "types/types";
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
  const [confirmationMsg, setConfirmationMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // React Query hooks
  const { data: users, isLoading: loadingUsers } = useAllUsers(1, 1000); // Get all users for dropdown
  const createTournamentMutation = useCreateTournament();

  if (loadingUsers) return <DetailContainer><Spinner size="3" /></DetailContainer>;
  if (!users?.results) return null;

  const usersData = users as UsersListResponse;

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

  const handleSubmit = async () => {
    if (!validated()) return;

    try {
      await createTournamentMutation.mutateAsync({
        tournamentName: form.tournamentName.value || "",
        status: Number(form.statusId.value),
        admins: form.admins.value || undefined,
        startingDate: form.startingDate.value,
        description: form.description.value || undefined,
      });

      setConfirmationMsg("Tournament created correctly");
      router.push("/tournaments");
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || error?.message || "Failed to create tournament");
    }
  };

  const statusIds = Object.entries(tournamentStatus).map(([key, value]) => ({
    value: value.toString(),
    text: key,
  }));

  const usersParsed: DropdownItemType[] =
    usersData.results?.map((item: User) => ({
      value: item.id,
      text: item.name,
    })) || [];
  const formattedDate = form?.startingDate.value ? new Date(form?.startingDate.value) : new Date()

  return (
    <DetailContainer>
      {confirmationMsg && (
        <div style={{ color: 'green', marginBottom: '16px', textAlign: 'center' }}>
          {confirmationMsg}
        </div>
      )}
      {errorMsg && (
        <div style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}
      <Form css={formStyles} onSubmit={(e) => e.preventDefault()}>
        <EditTextComponent
          labelText="tournamentName"
          inputValue={form?.tournamentName.value || ""}
          onInputValueChange={(value) => onInputValueChange("tournamentName", value)}
          css={{ width: inputWidth }}
          error={form?.tournamentName.error}
          maxLength={100}
        />
        <DropdownWithLabel
          labelText="statusId"
          items={statusIds}
          error={form?.statusId?.error}
          css={{ width: inputWidth }}
          selectedItem={form.statusId?.value || ""}
          placeholder="Status Id"
          onSelect={(value: string) => onInputValueChange("statusId", value)}
        />
        <UserTypeahead
          labelText="admins"
          selectedItem={form.admins.value || ""}
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
        />
        <EditTextAreaComponent
          labelText="tournamentDescription"
          inputValue={form?.description.value || ""}
          onInputValueChange={(value) => onInputValueChange("description", value)}
          css={{ width: "500px", height: "200px" }}
          error={form?.description.error}
          maxLength={1000}
        />
        <Button
          disabled={createTournamentMutation.isPending}
          css={{ width: "200px", fontSize: "18px" }}
          onClick={handleSubmit}
        >
          {createTournamentMutation.isPending ? <Spinner size="3" /> : "Submit"}
        </Button>
      </Form>
    </DetailContainer>
  );
};

export default TournamentCreate
