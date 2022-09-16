import "react-day-picker/lib/style.css";
import React from "react";
import WithLabel from "./WithLabel";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { dateFormat } from "utils/dates";

type DateComponentProps = {
  labelText: string;
  inputValue: Date;
  onInputValueChange: (value: Date) => void;
};

const DateComponent = ({
  labelText,
  inputValue,
  onInputValueChange = () => {},
  ...rest
}: DateComponentProps) => (
  <WithLabel labelText={labelText}>
    <DayPickerInput
      value={inputValue}
      format="YYYY/MM/DD"
      placeholder="YYYY/MM/DD"
      formatDate={dateFormat}
      onDayChange={(value) => onInputValueChange(value)}
      dayPickerProps={{
        showWeekNumbers: true,
        todayButton: "Today",
      }}
    />
  </WithLabel>
);

export default DateComponent;
