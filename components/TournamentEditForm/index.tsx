import { useState } from "react";
import "react-day-picker/lib/style.css";
import { useForm, Controller } from "react-hook-form";
import { Spinner } from "@radix-ui/themes";
import { DropdownWithLabel, EditTextComponent } from "components/EditFormComponents";
import DateComponent from "components/EditFormComponents/DateComponent";
import { EditTextAreaComponent } from "components/EditFormComponents/EditTextArea";
import { TournamentsType } from "types/game.types";
import { tournamentStatus } from "utils/constants";
import UserTypeahead from "components/UserTypeahead";
import { useTournamentAdmins, useAddTournamentAdmin, useRemoveTournamentAdmin, useUpdateTournament } from "hooks/useTournaments";
import { DropdownItemType } from "types/types";
import { 
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  FieldWrap,
  WideFieldWrap,
  Section,
  SectionHeaderRow,
  SectionTitle,
  SectionHint,
  AdminList,
  AdminItem,
  AdminName,
  AddAdminButton,
  AddAdminRow,
  ButtonRow,
  PrimaryButton,
  DangerButton,
  InlineError,
  ErrorText
 } from "./TournamentEditForm.styled";

interface TournamentFormData {
  tournamentName: string;
  statusId: string;
  description: string;
  startingDate: Date;
}

interface TournamentEditFormProps {
  tournament: TournamentsType;
  onSave?: () => void;
  onCancel?: () => void;
}

const TournamentEditForm = ({ tournament, onSave, onCancel }: TournamentEditFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<TournamentFormData>({
    defaultValues: {
      tournamentName: tournament.tournament_name || "",
      statusId: tournament.status_id?.toString() || "4",
      description: tournament.description || "",
      startingDate: tournament.starting_date ? new Date(tournament.starting_date) : new Date(),
    },
    mode: "onChange",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const [selectedAdminUser, setSelectedAdminUser] = useState("");
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [removingAdminId, setRemovingAdminId] = useState<string | null>(null);

  const { data: tournamentAdmins, refetch: refetchAdmins } = useTournamentAdmins(
    parseInt(tournament.id),
  );

  const updateTournamentMutation = useUpdateTournament();
  const addAdminMutation = useAddTournamentAdmin();
  const removeAdminMutation = useRemoveTournamentAdmin();

  const statusIds = Object.entries(tournamentStatus).map(([key, value]) => ({
    value: value.toString(),
    text: key,
  }));

  const onSubmit = async (data: TournamentFormData) => {
    try {
      setErrorMsg("");
      clearErrors();

      await updateTournamentMutation.mutateAsync({
        id: parseInt(tournament.id),
        tournamentName: data.tournamentName,
        status: parseInt(data.statusId),
        startingDate: data.startingDate,
        description: data.description,
      });

      onSave?.();
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.message || e?.message || "Failed to update tournament");
    }
  };

  const handleAddAdmin = async () => {
    if (!selectedAdminUser) return;

    setIsAddingAdmin(true);
    try {
      await addAdminMutation.mutateAsync({
        tournamentId: parseInt(tournament.id),
        userId: selectedAdminUser,
      });
      setSelectedAdminUser("");
      refetchAdmins();
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || "Failed to add admin");
    } finally {
      setIsAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this admin?")) return;

    setRemovingAdminId(userId);
    try {
      await removeAdminMutation.mutateAsync({
        tournamentId: parseInt(tournament.id),
        userId,
      });
      refetchAdmins();
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || "Failed to remove admin");
    } finally {
      setRemovingAdminId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Tournament</CardTitle>
      </CardHeader>

      <CardBody onSubmit={handleSubmit(onSubmit)}>
        <FieldWrap>
          <Controller
            name="tournamentName"
            control={control}
            rules={{
              required: "Tournament name is required",
              maxLength: { value: 255, message: "Tournament name must be less than 255 characters" },
            }}
            render={({ field }) => (
              <EditTextComponent
                labelText="Tournament Name"
                inputValue={field.value}
                onInputValueChange={field.onChange}
                css={{ width: "100%" }}
                error={!!errors.tournamentName}
                maxLength={255}
              />
            )}
          />
        </FieldWrap>

        <FieldWrap>
          <Controller
            name="statusId"
            control={control}
            rules={{ required: "Status is required" }}
            render={({ field }) => (
              <DropdownWithLabel
                labelText="Status"
                items={statusIds}
                error={!!errors.statusId}
                css={{ width: "100%" }}
                selectedItem={field.value}
                placeholder="Status"
                onSelect={field.onChange}
              />
            )}
          />
        </FieldWrap>

        <FieldWrap>
          <Controller
            name="startingDate"
            control={control}
            rules={{ required: "Starting date is required" }}
            render={({ field }) => (
              <DateComponent
                labelText="Starting Date"
                inputValue={field.value}
                onInputValueChange={field.onChange}
              />
            )}
          />
        </FieldWrap>

        <WideFieldWrap>
          <Controller
            name="description"
            control={control}
            rules={{ maxLength: { value: 1000, message: "Description must be less than 1000 characters" } }}
            render={({ field }) => (
              <EditTextAreaComponent
                labelText="Description"
                inputValue={field.value}
                onInputValueChange={field.onChange}
                css={{ width: "100%", height: "150px", color: "var(--primary-text)", borderColor: "var(--border)" }}
                error={!!errors.description}
                maxLength={1000}
              />
            )}
          />
        </WideFieldWrap>

        <Section>
          <SectionHeaderRow>
            <SectionTitle>Tournament Admins</SectionTitle>
            <SectionHint>Admins can manage registration and status.</SectionHint>
          </SectionHeaderRow>

          {tournamentAdmins && tournamentAdmins.length > 0 ? (
            <AdminList>
              {tournamentAdmins.map((admin) => (
                <AdminItem key={admin.userId}>
                  <AdminName title={admin.name}>{admin.name}</AdminName>

                  <DangerButton
                    type="button"
                    onClick={() => handleRemoveAdmin(admin.userId)}
                    disabled={removingAdminId === admin.userId}
                  >
                    {removingAdminId === admin.userId ? "Removing..." : "Remove"}
                  </DangerButton>
                </AdminItem>
              ))}
            </AdminList>
          ) : (
            <SectionHint>No admins yet.</SectionHint>
          )}

          <AddAdminRow>
            <div style={{ width: "min(420px, 100%)" }}>
              <UserTypeahead
                labelText="Add Admin"
                selectedItem={selectedAdminUser}
                onSelect={(item: DropdownItemType | null) =>
                  setSelectedAdminUser(item?.value || "")
                }
                onBlur={() => {}}
                placeholder="Select user to add as admin..."
                css={{ width: "100%" }}
              />
            </div>

            <AddAdminButton
              type="button"
              onClick={handleAddAdmin}
              disabled={!selectedAdminUser || isAddingAdmin}
            >
              {isAddingAdmin ? <Spinner size="2" /> : "Add Admin"}
            </AddAdminButton>
          </AddAdminRow>
        </Section>

        {(Object.keys(errors).length > 0 || errorMsg) && (
          <InlineError>
            {Object.keys(errors).length > 0 && (
              <ErrorText>
                {Object.values(errors).map((err, idx) => (
                  <div key={idx}>{err?.message}</div>
                ))}
              </ErrorText>
            )}
            {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
          </InlineError>
        )}

        <ButtonRow>
          <PrimaryButton type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </PrimaryButton>

          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner size="2" /> : "Save Changes"}
          </PrimaryButton>
        </ButtonRow>
      </CardBody>
    </Card>
  );
};

export default TournamentEditForm;
