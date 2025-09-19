import React, { useState } from 'react';
import { Flex, Box, Span } from 'components/Atoms'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { Button } from 'components/Button'
import { format as formatDate } from 'date-fns';
import { dateFormat } from "utils/dates";
import getAxiosInstance from 'utils/axios';

interface DueDateDisplayProps {
  dueDate: string | Date;
  admin: boolean;
  gamePlayed: boolean;
  scheduleId: string;
}

const DueDateDisplay: React.FC<DueDateDisplayProps> = ({
  dueDate,
  admin,
  gamePlayed,
  scheduleId
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(
    typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // if (!onSaveDate) return;
    setLoading(true);
    try {
      await getAxiosInstance().post('/api/schedule/', {
            data: {
              due_date: selectedDate,
              id: scheduleId
            },
          })
    } finally {
      setLoading(false);
    }
  };
// bg={color} px={3} py={1} borderRadius="md".   gap={2}
  const renderLabel = (color: string) => (
    <Box>
      <Span css={{ margin: "0 4px 0 4px" }}>{formatDate(new Date(dueDate), 'yyyy/MM/dd')}</Span>
    </Box>
  );

  if (admin) {
    return (
      <Flex css={{ align: "center" }} >
        <DayPickerInput
          value={selectedDate}
          format="YYYY/MM/DD"
          placeholder="YYYY/MM/DD"
          formatDate={dateFormat}
          onDayChange={(date: Date) => setSelectedDate(date)}
          dayPickerProps={{
            showWeekNumbers: true,
            todayButton: 'Today',
          }}
        />
        <Button onClick={handleSave}>
          OK
        </Button>
      </Flex>
    );
  }

  if (gamePlayed) {
    return renderLabel('rgba(144, 238, 144, 0.4)'); // soft green
  }

  return renderLabel('rgba(255, 99, 71, 0.3)'); // soft red
};

export { DueDateDisplay }
