import { useMemo, useState } from "react";
import "react-day-picker/lib/style.css";
import { Spinner } from "@radix-ui/themes";
import { DetailContainer } from "components/DetailContainer";
import { DropdownWithLabel, EditTextComponent } from "components/EditFormComponents";
import DateComponent from "components/EditFormComponents/DateComponent";
import { EditTextAreaComponent } from "components/EditFormComponents/EditTextArea";
import { useCreateTournament } from "hooks/useTournaments";
import UserTypeahead from "components/UserTypeahead";
import { TournamentCreateState } from "types/game.types";
import { tournamentStatus } from "utils/constants";
import { useRouter } from "next/router";
import { 
  Page,
  Card,
  Header,
  Title,
  StyledForm,
  Field,
  ActionsRow,
  SubmitButton,
  Alert
 } from "styles/tournamentCreate.styled";


const getInitialState = (): TournamentCreateState => ({
  tournamentName: { value: "", error: false },
  statusId: { value: "4", error: false },
  description: { value: "", error: false },
  startingDate: { value: new Date(), error: false },
  admins: { value: "", error: false },
});

const TournamentCreate = () => {
  const router = useRouter();

  const [form, setForm] = useState<TournamentCreateState>(() => getInitialState());
  const [confirmationMsg, setConfirmationMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const createTournamentMutation = useCreateTournament();

  const statusIds = useMemo(
    () =>
      Object.entries(tournamentStatus).map(([key, value]) => ({
        value: value.toString(),
        text: key,
      })),
    [],
  );

  const validated = () => {
    let submit = true;

    (Object.keys(form) as (keyof TournamentCreateState)[]).forEach((key) => {
      if (["tournamentName", "statusId", "admins"].includes(key as string) && form[key].value === "") {
        setForm((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            error: true,
          },
        }));
        submit = false;
      }
    });

    return submit;
  };

  const onInputValueChange = (key: keyof TournamentCreateState, value: string | Date) => {
    // clear global messages once the user edits anything
    if (confirmationMsg) setConfirmationMsg("");
    if (errorMsg) setErrorMsg("");

    setForm((prev) => ({
      ...prev,
      [key]: {
        value,
        error: prev[key].error ? value === "" : false,
      },
    }));
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

      setConfirmationMsg("Tournament Created Correctly");
      router.push("/tournaments");
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || error?.message || "Failed to create tournament");
    }
  };

  const formattedDate = form.startingDate.value ? new Date(form.startingDate.value) : new Date();

  return (
    <DetailContainer>
      <Page>
        <Card>
          <Header>
            <Title>Create Tournament</Title>
          </Header>

          {confirmationMsg && <Alert $variant="success">{confirmationMsg}</Alert>}
          {errorMsg && <Alert $variant="error">{errorMsg}</Alert>}

          <StyledForm onSubmit={(e) => e.preventDefault()}>
            <Field>
              <EditTextComponent
                labelText="tournamentName"
                inputValue={form.tournamentName.value || ""}
                onInputValueChange={(value) => onInputValueChange("tournamentName", value)}
                css={{ width: "100%" }}
                error={form.tournamentName.error}
                maxLength={100}
              />
            </Field>

            <Field>
              <DropdownWithLabel
                labelText="statusId"
                items={statusIds}
                error={form.statusId.error}
                css={{ width: "100%" }}
                selectedItem={form.statusId.value || ""}
                placeholder="Status"
                onSelect={(value: string) => onInputValueChange("statusId", value)}
              />
            </Field>

            <Field>
              <UserTypeahead
                labelText="admins"
                selectedItem={form.admins.value || ""}
                error={form.admins.error}
                placeholder="Type the Admin Name..."
                css={{ width: "100%" }}
                onBlur={() => {
                  // keep your existing behavior (clear on blur)
                  onInputValueChange("admins", "");
                }}
                onSelect={(value) => onInputValueChange("admins", value?.value || "")}
              />
            </Field>

            <Field>
              <DateComponent
                labelText="startingDate"
                inputValue={formattedDate}
                onInputValueChange={(value) => onInputValueChange("startingDate", value)}
              />
            </Field>

            <Field>
              <EditTextAreaComponent
                labelText="tournamentDescription"
                inputValue={form.description.value || ""}
                onInputValueChange={(value) => onInputValueChange("description", value)}
                css={{ width: "100%", height: "200px", borderColor: "var(--border)", color: "var(--primary-text)" }}
                error={form.description.error}
                maxLength={1000}
              />
            </Field>

            <ActionsRow>
              <SubmitButton disabled={createTournamentMutation.isPending} onClick={handleSubmit}>
                {createTournamentMutation.isPending ? <Spinner size="3" /> : "Create Tournament"}
              </SubmitButton>
            </ActionsRow>
          </StyledForm>
        </Card>
      </Page>
    </DetailContainer>
  );
};

export default TournamentCreate;
