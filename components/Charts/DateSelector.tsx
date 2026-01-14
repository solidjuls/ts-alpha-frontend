import React, { useState } from "react";
import { Flex } from "components/Atoms";
import styled, { css } from "styled-components";

type DateRangeProps = "3months" | "6months" | "year" | "all";
interface DateSelectorProps {
  setFromDate: React.Dispatch<React.SetStateAction<string>>;
}

const StyledButton = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #ccc;
  color: #333;
  background-color: white;
  transition: all 0.2s ease;
  padding: 4px 8px;
  font-size: 12px;

  &:hover {
    background-color: #f0f0f0;
  }

  ${(props) =>
    props.$active &&
    css`
      background-color: #1f77b4;
      color: white;
      border: 1px solid #1f77b4;

      &:hover {
        background-color: #1768a0;
      }
    `}
`;

const DateSelector: React.FC<DateSelectorProps> = ({ setFromDate }) => {
  const [dateRange, setDateRange] = useState<DateRangeProps>("3months");

  const getDateFilter = (range: "3months" | "6months" | "year" | "all") => {
    if (range === "all") {
      setFromDate("");
      return;
    }

    const now = new Date();
    let startDate = new Date();

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
      default:
        return "";
    }

    // Format as ISO string and extract just the date part
    setFromDate(startDate.toISOString().split("T")[0]);
  };

  const onDateRangeClick = (range: "3months" | "6months" | "year" | "all") => {
    setDateRange(range);
    getDateFilter(range);
  };
  return (
    <Flex
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
        flexWrap: "wrap",
        gap: "8px",
      }}
    >
      <Flex style={{ gap: "8px" }}>
        <StyledButton
          $active={dateRange === "3months" ? true : false}
          onClick={() => onDateRangeClick("3months")}
        >
          3 Months
        </StyledButton>
        <StyledButton
          $active={dateRange === "6months" ? true : false}
          onClick={() => onDateRangeClick("6months")}
        >
          6 Months
        </StyledButton>
        <StyledButton
          $active={dateRange === "year" ? true : false}
          onClick={() => onDateRangeClick("year")}
        >
          1 Year
        </StyledButton>
        <StyledButton
          $active={dateRange === "all" ? true : false}
          onClick={() => onDateRangeClick("all")}
        >
          All Time
        </StyledButton>
      </Flex>
    </Flex>
  );
};

export { DateSelector };
