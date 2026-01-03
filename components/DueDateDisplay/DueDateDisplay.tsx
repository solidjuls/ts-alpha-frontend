import React, { useEffect, useState } from "react";
import { Flex } from "components/Atoms";
import Text from "components/Text";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { Button } from "components/Button";
import { format as formatDate } from "date-fns";
import { dateFormat } from "utils/dates";
import { useUpdateSchedule } from "hooks/useSchedule";
import { Spinner } from "@radix-ui/themes";
import { DateSpan } from "./DueDateDisplay.styled";

interface DueDateDisplayProps {
  dueDate: string | Date;
  gameDate: string | Date;
  admin: boolean;
  gamePlayed: boolean;
  scheduleId: string;
}

const DueDateDisplay: React.FC<DueDateDisplayProps> = ({
  dueDate,
  admin,
  gamePlayed,
  gameDate,
  scheduleId,
}) => {
  const initialDate = typeof dueDate === "string" ? new Date(dueDate) : dueDate
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  useEffect(() => {
    if(typeof dueDate === "string") {
      setSelectedDate(new Date(dueDate));
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
      console.error('Error Updating Schedule Due Date:', error);
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
  const renderLabel = (color: string) => (
    <Flex
      style={{
        display: "flex",
        flexDirection: "column",
        width: "140px",
      }}
    >
      {gameDate ? (
        <RenderLabelContent description="Game Played" date={gameDate} />
      ) : (
        <RenderLabelContent description="Due Date" date={dueDate} />
      )}
    </Flex>
  );

  if (admin) {
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
            style: { cursor: "pointer", margin: '4px', color: 'var(--primary-text)' },
          }}
          dayPickerProps={{
            showWeekNumbers: true,
            todayButton: "Today",
          }}
        />
        <Button
          onClick={handleSave}
          disabled={updateScheduleMutation.isPending}
        >
          {updateScheduleMutation.isPending ? <Spinner size="3" /> : "Update"}
        </Button>
      </Flex>
    );
  }

  if (gamePlayed) {
    return renderLabel("var(--usa)"); 
  }

  return renderLabel("var(--ussr)"); 
};

export { DueDateDisplay };
