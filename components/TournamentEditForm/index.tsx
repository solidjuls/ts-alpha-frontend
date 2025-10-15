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
