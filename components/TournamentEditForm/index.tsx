import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Spinner } from "@radix-ui/themes";
import styled from "styled-components";
import { Button } from "components/Button";
import { DropdownWithLabel, EditTextComponent } from "components/EditFormComponents";
import DateComponent from "components/EditFormComponents/DateComponent";
import { EditTextAreaComponent } from "components/EditFormComponents/EditTextArea";
import getAxiosInstance from "utils/axios";
import { TournamentsType } from "types/game.types";
import { tournamentStatus } from "utils/constants";
import UserTypeahead from "pages/submitform/UserTypeahead";
import { useTournamentAdmins, useAddTournamentAdmin, useRemoveTournamentAdmin } from "hooks/useTournaments";
import { useAllUsers } from "hooks/useUsers";
import { User, UsersListResponse } from "services/users.service";
import { DropdownItemType } from "types/types";

const EditFormContainer = styled.div`
  margin-top: 24px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background-color: white;
`;

const EditFormHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;
  border-radius: 8px 8px 0 0;
  font-weight: 500;
`;

const AdminSection = styled.div`
  margin-top: 24px;
  padding: 16px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background-color: #f8f9fa;
`;

const AdminSectionHeader = styled.h4`
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
`;

const AdminList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const AdminItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
`;

const AdminName = styled.span`
  font-size: 14px;
  color: #374151;
`;

const RemoveButton = styled.button`
  padding: 4px 8px;
  font-size: 12px;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #b91c1c;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const AddAdminContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const FormContainer = styled.form`
  align-items: flex-start;
  background-color: white;
  width: 100%;
  padding: 20px;
  gap: 16px;
  display: flex;
  flex-direction: column;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 14px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const CancelButton = styled(Button)`
  background-color: #6b7280;
`;

const SaveButton = styled(Button)`
  background-color: #3b82f6;
`;

const AddAdminButton = styled(Button)`
  background-color: #10b981;
  height: 40px;

  &:hover {
    background-color: #059669;
  }
`;

const inputWidth = "370px";

// Form data type for react-hook-form
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
  // Initialize react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors
  } = useForm<TournamentFormData>({
    defaultValues: {
      tournamentName: tournament.tournament_name || "",
      statusId: tournament.status_id?.toString() || "4",
      description: tournament.description || "",
      startingDate: tournament.starting_date ? new Date(tournament.starting_date) : new Date(),
    },
    mode: "onChange"
  });

  const [errorMsg, setErrorMsg] = useState("");

  // Admin management state
  const [selectedAdminUser, setSelectedAdminUser] = useState("");
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [removingAdminId, setRemovingAdminId] = useState<string | null>(null);

  // Fetch tournament admins
  const { data: tournamentAdmins, refetch: refetchAdmins } = useTournamentAdmins(parseInt(tournament.id));

  // Fetch all users for admin selection
  const { data: usersData } = useAllUsers(1, 100);

  // Admin management mutations
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

      await getAxiosInstance().put("/api/game/tournaments", {
        id: tournament.id,
        tournamentName: data.tournamentName,
        status: data.statusId,
        startingDate: data.startingDate,
        description: data.description
      });

      onSave?.();
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.error || "Failed to update tournament");
    }
  };

  // Admin management functions
  const handleAddAdmin = async () => {
    if (!selectedAdminUser) return;

    setIsAddingAdmin(true);
    try {
      await addAdminMutation.mutateAsync({
        tournamentId: parseInt(tournament.id),
        userId: selectedAdminUser
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
        userId: userId
      });
      refetchAdmins();
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || "Failed to remove admin");
    } finally {
      setRemovingAdminId(null);
    }
  };

  // Convert users data to dropdown format
  const usersForDropdown: DropdownItemType[] = (usersData as UsersListResponse)?.results ? (usersData as UsersListResponse).results.map((user: User) => ({
    value: user.id,
    text: user.name
  })) : [];

  // Filter out users who are already admins
  const availableUsers = usersForDropdown.filter(user =>
    !tournamentAdmins?.some(admin => admin.userId === user.value)
  );

  return (
    <EditFormContainer>
      <EditFormHeader>
        Edit Tournament
      </EditFormHeader>

      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="tournamentName"
          control={control}
          rules={{
            required: "Tournament name is required",
            maxLength: { value: 255, message: "Tournament name must be less than 255 characters" }
          }}
          render={({ field }) => (
            <EditTextComponent
              labelText="Tournament Name"
              inputValue={field.value}
              onInputValueChange={field.onChange}
              css={{ width: inputWidth }}
              error={!!errors.tournamentName}
              maxLength={255}
            />
          )}
        />

        <Controller
          name="statusId"
          control={control}
          rules={{ required: "Status is required" }}
          render={({ field }) => (
            <DropdownWithLabel
              labelText="Status"
              items={statusIds}
              error={!!errors.statusId}
              css={{ width: inputWidth }}
              selectedItem={field.value}
              placeholder="Status"
              onSelect={field.onChange}
            />
          )}
        />

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

        <Controller
          name="description"
          control={control}
          rules={{
            maxLength: { value: 1000, message: "Description must be less than 1000 characters" }
          }}
          render={({ field }) => (
            <EditTextAreaComponent
              labelText="Description"
              inputValue={field.value}
              onInputValueChange={field.onChange}
              css={{ width: "500px", height: "150px" }}
              error={!!errors.description}
              maxLength={1000}
            />
          )}
        />

        {/* Tournament Admins Management */}
        <AdminSection>
          <AdminSectionHeader>Tournament Admins</AdminSectionHeader>

          {/* Current Admins List */}
          {tournamentAdmins && tournamentAdmins.length > 0 && (
            <AdminList>
              {tournamentAdmins.map((admin) => (
                <AdminItem key={admin.userId}>
                  <AdminName>{admin.name}</AdminName>
                  <RemoveButton
                    onClick={() => handleRemoveAdmin(admin.userId)}
                    disabled={removingAdminId === admin.userId}
                  >
                    {removingAdminId === admin.userId ? "Removing..." : "Remove"}
                  </RemoveButton>
                </AdminItem>
              ))}
            </AdminList>
          )}

          {/* Add New Admin */}
          <AddAdminContainer>
            <UserTypeahead
              labelText="Add Admin"
              users={availableUsers}
              selectedItem={selectedAdminUser}
              onSelect={(item: DropdownItemType) => setSelectedAdminUser(item.value || "")}
              onBlur={() => {}}
              placeholder="Select user to add as admin..."
              css={{ width: "300px" }}
            />
            <AddAdminButton
              onClick={handleAddAdmin}
              disabled={!selectedAdminUser || isAddingAdmin}
            >
              {isAddingAdmin ? <Spinner size="2" /> : "Add Admin"}
            </AddAdminButton>
          </AddAdminContainer>
        </AdminSection>

        {/* Display form validation errors */}
        {Object.keys(errors).length > 0 && (
          <ErrorMessage>
            {Object.values(errors).map((error, index) => (
              <div key={index}>{error?.message}</div>
            ))}
          </ErrorMessage>
        )}

        {errorMsg && (
          <ErrorMessage>
            {errorMsg}
          </ErrorMessage>
        )}

        <ButtonContainer>
          <CancelButton
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </CancelButton>

          <SaveButton
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner size="2" /> : "Save Changes"}
          </SaveButton>
        </ButtonContainer>
      </FormContainer>
    </EditFormContainer>
  );
};

export default TournamentEditForm;
