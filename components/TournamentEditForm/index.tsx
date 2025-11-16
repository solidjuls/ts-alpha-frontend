import { useState, useEffect } from "react";
import { Spinner } from "@radix-ui/themes";
import { Form, Box } from "components/Atoms";
import { Button } from "components/Button";
import { DropdownWithLabel, EditTextComponent } from "components/EditFormComponents";
import DateComponent from "components/EditFormComponents/DateComponent";
import { EditTextAreaComponent } from "components/EditFormComponents/EditTextArea";
import getAxiosInstance from "utils/axios";
import { TournamentCreateState, TournamentsType } from "types/game.types";
import { tournamentStatus } from "utils/constants";
import { styled } from "stitches.config";
import UserTypeahead from "pages/submitform/UserTypeahead";
import { useTournamentAdmins, useAddTournamentAdmin, useRemoveTournamentAdmin } from "hooks/useTournaments";
import { useAllUsers } from "hooks/useUsers";
import { User, UsersListResponse } from "services/users.service";
import { DropdownItemType } from "types/types";

const EditFormContainer = styled("div", {
  marginTop: "24px",
  border: "1px solid #e9ecef",
  borderRadius: "8px",
  backgroundColor: "white",
});

const EditFormHeader = styled("div", {
  padding: "16px 20px",
  borderBottom: "1px solid #e9ecef",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px 8px 0 0",
  fontWeight: "500",
});

const AdminSection = styled("div", {
  marginTop: "24px",
  padding: "16px",
  border: "1px solid #e9ecef",
  borderRadius: "6px",
  backgroundColor: "#f8f9fa",
});

const AdminSectionHeader = styled("h4", {
  margin: "0 0 16px 0",
  fontSize: "16px",
  fontWeight: "500",
  color: "#374151",
});

const AdminList = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginBottom: "16px",
});

const AdminItem = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 12px",
  backgroundColor: "white",
  border: "1px solid #d1d5db",
  borderRadius: "4px",
});

const AdminName = styled("span", {
  fontSize: "14px",
  color: "#374151",
});

const RemoveButton = styled("button", {
  padding: "4px 8px",
  fontSize: "12px",
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#b91c1c",
  },
  "&:disabled": {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed",
  },
});

const AddAdminContainer = styled("div", {
  display: "flex",
  gap: "12px",
  alignItems: "flex-end",
});

const inputWidth = "370px";

const formStyles = {
  alignItems: "center",
  backgroundColor: "White",
  width: "100%",
  padding: "20px",
  gap: "16px",
};

interface TournamentEditFormProps {
  tournament: TournamentsType;
  onSave?: () => void;
  onCancel?: () => void;
}

const TournamentEditForm = ({ tournament, onSave, onCancel }: TournamentEditFormProps) => {
  const [form, setForm] = useState<TournamentCreateState>(() => ({
    tournamentName: {
      value: tournament.tournament_name || "",
      error: false,
    },
    statusId: {
      value: tournament.status_id?.toString() || "4",
      error: false,
    },
    description: {
      value: tournament.description || "",
      error: false,
    },
    startingDate: {
      value: tournament.starting_date ? new Date(tournament.starting_date) : new Date(),
      error: false,
    },
    admins: {
      value: "",
      error: false,
    },
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const validated = () => {
    let submit = true;
    Object.keys(form).forEach((key: string) => {
      if (["tournamentName", "statusId"].includes(key) &&
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

  const formattedDate = form?.startingDate.value ? new Date(form?.startingDate.value) : new Date();

  const handleSave = async () => {
    if (validated()) {
      try {
        setIsSubmitting(true);
        setErrorMsg("");

        await getAxiosInstance().put("/api/game/tournaments", {
          id: tournament.id,
          tournamentName: form?.tournamentName.value,
          status: form?.statusId.value,
          startingDate: form?.startingDate.value,
          description: form?.description.value
        });

        onSave?.();
      } catch (e: any) {
        setErrorMsg(e?.response?.data?.error || "Failed to update tournament");
      } finally {
        setIsSubmitting(false);
      }
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
      
      <Form css={formStyles} onSubmit={(e) => e.preventDefault()}>
        <EditTextComponent
          labelText="Tournament Name"
          inputValue={form?.tournamentName.value}
          onInputValueChange={(value) => onInputValueChange("tournamentName", value)}
          css={{ width: inputWidth }}
          error={form?.tournamentName.error}
        />
        
        <DropdownWithLabel
          labelText="Status"
          items={statusIds}
          error={form?.statusId?.error}
          css={{ width: inputWidth }}
          selectedItem={form.statusId?.value}
          placeholder="Status"
          onSelect={(value: string) => onInputValueChange("statusId", value)}
        />
        
        <DateComponent
          labelText="Starting Date"
          inputValue={formattedDate}
          onInputValueChange={(value) => onInputValueChange("startingDate", value)}
          error={form?.startingDate.error}
        />
        
        <EditTextAreaComponent
          labelText="Description"
          inputValue={form?.description.value}
          onInputValueChange={(value) => onInputValueChange("description", value)}
          css={{ width: "500px", height: "150px" }}
          error={form?.description.error}
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
              onSelect={(item: DropdownItemType) => setSelectedAdminUser(item.value)}
              onBlur={() => {}}
              placeholder="Select user to add as admin..."
              css={{ width: "300px" }}
            />
            <Button
              onClick={handleAddAdmin}
              disabled={!selectedAdminUser || isAddingAdmin}
              css={{
                backgroundColor: "#10b981",
                height: "40px",
                "&:hover": { backgroundColor: "#059669" }
              }}
            >
              {isAddingAdmin ? <Spinner size="2" /> : "Add Admin"}
            </Button>
          </AddAdminContainer>
        </AdminSection>

        {errorMsg && (
          <Box css={{ color: "#dc2626", fontSize: "14px", textAlign: "center" }}>
            {errorMsg}
          </Box>
        )}
        
        <Box css={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Button
            css={{ backgroundColor: "#6b7280" }}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button
            disabled={isSubmitting}
            css={{ backgroundColor: "#3b82f6" }}
            onClick={handleSave}
          >
            {isSubmitting ? <Spinner size="2" /> : "Save Changes"}
          </Button>
        </Box>
      </Form>
    </EditFormContainer>
  );
};

export default TournamentEditForm;
