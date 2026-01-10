import React, { useEffect, useState } from "react";
import { Flex } from "components/Atoms";
import Text from "components/Text";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { format as formatDate } from "date-fns";
import { dateFormat } from "utils/dates";
import { useUpdateSchedule } from "hooks/useSchedule";
import { Spinner } from "@radix-ui/themes";
import { DateSpan, ActionButton } from "./DueDateDisplay.styled";
import { DangerButton } from "components/DangerButton/DangerButton";

interface DueDateDisplayProps {
  dueDate: string | Date;
  gameDate: string | Date;
  admin: boolean;
  gamePlayed: boolean;
  scheduleId: string;

  // Optional delete support (for admins)
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  deleteConfirmText?: string; // optional override
}

const DueDateDisplay: React.FC<DueDateDisplayProps> = ({
  dueDate,
  admin,
  gamePlayed,
  gameDate,
  scheduleId,
  onDelete,
  isDeleting = false,
  deleteConfirmText,
}) => {
  const initialDate = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  useEffect(() => {
    if (typeof dueDate === "string") {
      setSelectedDate(new Date(dueDate));
    } else {
      setSelectedDate(dueDate);
    }
  }, [dueDate]);

  const updateScheduleMutation = useUpdateSchedule();

  const handleSave = async () => {
    if (!selectedDate) return;

    try {
      await updateScheduleMutation.mutateAsync({
        id: scheduleId,
        dueDate: selectedDate.toISOString(),
      });
    } catch (error) {
      console.error("Error Updating Schedule Due Date:", error);
    }
  };

  const handleDelete = () => {
    if (!onDelete) return;

    const msg =
      deleteConfirmText ??
      "Are you sure you want to delete this scheduled game?";

    if (window.confirm(msg)) {
      onDelete(scheduleId);
    }
  };

  const RenderLabelContent = ({
    description,
    date,
  }: {
    description: string;
    date: string | Date;
  }) => (
    <>
      <Text fontSize="small" style={{ marginLeft: 4 }}>
        {description}
      </Text>
      <DateSpan>{formatDate(new Date(date), "yyyy/MM/dd")}</DateSpan>
    </>
  );

  const renderLabel = (description: string, date: string | Date) => (
    <Flex
      style={{
        display: "flex",
        flexDirection: "column",
        width: "140px",
      }}
    >
      <RenderLabelContent description={description} date={date} />
    </Flex>
  );

  // Admin: editable date + Update + optional Delete
  if (admin) {
    const isUpdating = updateScheduleMutation.isPending;

    return (
      <Flex style={{ alignItems: "center" }}>
        <DayPickerInput
          value={selectedDate}
          format="YYYY/MM/DD"
          placeholder="YYYY/MM/DD"
          formatDate={dateFormat}
          onDayChange={(date: Date) => setSelectedDate(date)}
          inputProps={{
            readOnly: true,
            style: {
              cursor: "pointer",
              margin: "4px",
              color: "var(--primary-text)",
            },
          }}
          dayPickerProps={{
            showWeekNumbers: true,
            todayButton: "Today",
          }}
        />

        <Flex style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <ActionButton onClick={handleSave} disabled={isUpdating || isDeleting}>
            {isUpdating ? <Spinner size="3" /> : "Update"}
          </ActionButton>

          {onDelete && (
            <DangerButton
              onClick={handleDelete}
              disabled={isDeleting || isUpdating}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </DangerButton>
          )}
        </Flex>
      </Flex>
    );
  }

  // Non-admin: read-only label
  if (gamePlayed && gameDate) {
    return renderLabel("Game Played", gameDate);
  }

  return renderLabel("Due Date", dueDate);
};

export { DueDateDisplay };
