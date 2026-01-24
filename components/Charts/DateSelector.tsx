import React, { useState } from "react";
import { DateSelectorBar, DateButtons, RangeButton } from "./DateSelector.styled";

type DateRangeProps = "3months" | "6months" | "year" | "all";

interface DateSelectorProps {
  setFromDate: React.Dispatch<React.SetStateAction<string>>;
}

const DateSelector: React.FC<DateSelectorProps> = ({ setFromDate }) => {
  const [dateRange, setDateRange] = useState<DateRangeProps>("3months");

  const getDateFilter = (range: DateRangeProps) => {
    if (range === "all") {
      setFromDate("");
      return;
    }

    const now = new Date();
    const startDate = new Date(now);

    switch (range) {
      case "3months":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6months":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    setFromDate(startDate.toISOString().split("T")[0]);
  };

  const onDateRangeClick = (range: DateRangeProps) => {
    setDateRange(range);
    getDateFilter(range);
  };

  return (
    <DateSelectorBar>
      <DateButtons>
        <RangeButton $active={dateRange === "3months"} onClick={() => onDateRangeClick("3months")}>
          3 Months
        </RangeButton>

        <RangeButton $active={dateRange === "6months"} onClick={() => onDateRangeClick("6months")}>
          6 Months
        </RangeButton>

        <RangeButton $active={dateRange === "year"} onClick={() => onDateRangeClick("year")}>
          1 Year
        </RangeButton>

        <RangeButton $active={dateRange === "all"} onClick={() => onDateRangeClick("all")}>
          All Time
        </RangeButton>
      </DateButtons>
    </DateSelectorBar>
  );
};

export { DateSelector };
