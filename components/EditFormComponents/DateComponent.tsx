import React from "react";
import WithLabel from "./WithLabel";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { dateFormat } from "utils/dates";

type DateComponentProps = {
  labelText: string;
  inputValue: Date;
  onInputValueChange: (value: Date) => void;
  width?: string;
};

const DateComponent = ({
  labelText,
  inputValue,
  onInputValueChange = () => {},
  width,
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
      inputProps={{
        style: width ? { width } : undefined,
      }}
    />
  </WithLabel>
);

export default DateComponent;
