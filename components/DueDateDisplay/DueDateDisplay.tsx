import React, { useState } from "react";
import { Flex, Box, Span } from "components/Atoms";
import Text from "components/Text";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { Button } from "components/Button";
import { format as formatDate } from "date-fns";
import { dateFormat } from "utils/dates";
import getAxiosInstance from "utils/axios";

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
  const [selectedDate, setSelectedDate] = useState<Date>(
    typeof dueDate === "string" ? new Date(dueDate) : dueDate,
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // if (!onSaveDate) return;
    setLoading(true);
    try {
      await getAxiosInstance().post("/api/schedule/", {
        data: {
          due_date: selectedDate,
          id: scheduleId,
        },
      });
    } finally {
      setLoading(false);
    }
  };
  // bg={color} px={3} py={1} borderRadius="md".   gap={2}
  const RenderLabelContent = ({
    description,
    date,
  }: {
    description: string;
    date: string | Date;
  }) => (
    <>
      <Text fontSize="small" css={{ marginLeft: 4 }}>
        {description}
      </Text>
      <Span css={{ margin: "0 4px 0 4px" }}>{formatDate(new Date(date), "yyyy/MM/dd")}</Span>
    </>
  );
  const renderLabel = (color: string) => (
    <Flex
      css={{
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
      <Flex css={{ align: "center" }}>
        <DayPickerInput
          value={selectedDate}
          format="YYYY/MM/DD"
          placeholder="YYYY/MM/DD"
          formatDate={dateFormat}
          onDayChange={(date: Date) => setSelectedDate(date)}
          dayPickerProps={{
            showWeekNumbers: true,
            todayButton: "Today",
          }}
        />
        <Button onClick={handleSave}>OK</Button>
      </Flex>
    );
  }

  if (gamePlayed) {
    return renderLabel("rgba(144, 238, 144, 0.4)"); // soft green
  }

  return renderLabel("rgba(255, 99, 71, 0.3)"); // soft red
};

export { DueDateDisplay };
