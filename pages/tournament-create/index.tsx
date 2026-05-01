import { useMemo, useState, useRef } from "react";
import "react-day-picker/lib/style.css";
import { Spinner } from "@radix-ui/themes";
import { DetailContainer } from "components/DetailContainer";
import { DropdownWithLabel, EditTextComponent } from "components/EditFormComponents";
import DateComponent from "components/EditFormComponents/DateComponent";
import { EditTextAreaComponent } from "components/EditFormComponents/EditTextArea";
import { useCreateTournament, useTournamentsByStatus, useCreateSubtournament } from "hooks/useTournaments";
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

 interface Player {
   userName: string | null;
   userId: number | null;
   playoffSquare?: string;
   playoffName?: string;
   seed: number | null;
   nextSquare: string | null;
 }



const getInitialState = (): TournamentCreateState => ({
  tournamentName: { value: "", error: false },
  statusId: { value: "4", error: false },
  description: { value: "", error: false },
  startingDate: { value: new Date(), error: false },
  admins: { value: "", error: false },
});

type TournamentType = "standard" | "playoff";

const TournamentCreate = () => {
  const router = useRouter();

  const [form, setForm] = useState<TournamentCreateState>(() => getInitialState());
  const [confirmationMsg, setConfirmationMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [tournamentType, setTournamentType] = useState<TournamentType>("standard");
  const [parentTournamentId, setParentTournamentId] = useState<string>("");

  const createTournamentMutation = useCreateTournament();
  const createSubtournamentMutation = useCreateSubtournament();

  const { data: openTournaments, isLoading: loadingTournaments } = useTournamentsByStatus([4]);

  const tournamentTypeOptions = [
    { value: "standard", text: "Standard Tournament" },
    { value: "playoff", text: "Playoff Tournament" },
  ];

  const parentTournamentOptions = useMemo(() => {
    if (!openTournaments) return [];
    return openTournaments.map((t) => ({
      value: t.id.toString(),
      text: t.tournament_name,
    }));
  }, [openTournaments]);

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

    // // Common validation
    // (Object.keys(form) as (keyof TournamentCreateState)[]).forEach((key) => {
    //   if (["tournamentName", "admins"].includes(key as string) && form[key].value === "") {
    //     setForm((prev) => ({
    //       ...prev,
    //       [key]: {
    //         ...prev[key],
    //         error: true,
    //       },
    //     }));
    //     submit = false;
    //   }
    // });

    // // Playoff-specific validation
    // if (tournamentType === "playoff") {
    //   if (!parentTournamentId) {
    //     setErrorMsg("Please select a parent tournament");
    //     submit = false;
    //   }
    //   if (importedPlayers.length === 0) {
    //     setErrorMsg("Please upload a CSV with players");
    //     submit = false;
    //   }
    // }

    return submit;
  };

  const onInputValueChange = (key: keyof TournamentCreateState, value: string | Date) => {
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
      if (tournamentType === "playoff") {
        await createSubtournamentMutation.mutateAsync({
          parentId: Number(parentTournamentId),
          data: {
            tournamentName: form.tournamentName.value || "",
            description: form.description.value || undefined,
            startingDate: form.startingDate.value,
            status: 4,
          },
        });
        setConfirmationMsg("Playoff Tournament Created Correctly");
      } else {
        await createTournamentMutation.mutateAsync({
          tournamentName: form.tournamentName.value || "",
          status: Number(form.statusId.value),
          admins: form.admins.value || undefined,
          startingDate: form.startingDate.value,
          description: form.description.value || undefined,
        });
        setConfirmationMsg("Tournament Created Correctly");
      }
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
            {/* Tournament Type Toggle */}
            <Field>
              <DropdownWithLabel
                labelText="tournamentType"
                items={tournamentTypeOptions}
                error={false}
                css={{ width: "100%" }}
                selectedItem={tournamentType}
                placeholder="Tournament Type"
                onSelect={(value: string) => setTournamentType(value as TournamentType)}
              />
            </Field>

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

            {/* Standard Tournament Fields */}
            {tournamentType === "standard" && (
              <>
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
                      onInputValueChange("admins", "");
                    }}
                    onSelect={(value) => onInputValueChange("admins", value?.value || "")}
                  />
                </Field>
              </>
            )}

            {/* Playoff Tournament Fields */}
            {tournamentType === "playoff" && (
              <>
                <Field>
                  <DropdownWithLabel
                    labelText="parentTournament"
                    items={parentTournamentOptions}
                    error={!parentTournamentId && !!errorMsg}
                    css={{ width: "100%" }}
                    selectedItem={parentTournamentId}
                    placeholder={loadingTournaments ? "Loading..." : "Select Parent Tournament"}
                    onSelect={(value: string) => setParentTournamentId(value)}
                  />
                </Field>
              </>
            )}

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
              <SubmitButton
                disabled={createTournamentMutation.isPending || createSubtournamentMutation.isPending}
                onClick={handleSubmit}
              >
                {(createTournamentMutation.isPending || createSubtournamentMutation.isPending)
                  ? <Spinner size="3" />
                  : tournamentType === "playoff" ? "Create Playoff Tournament" : "Create Tournament"}
              </SubmitButton>
            </ActionsRow>
          </StyledForm>
        </Card>
      </Page>
    </DetailContainer>
  );
};

export default TournamentCreate;
