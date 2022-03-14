import { styled } from "stitches.config";
import { Box, Span } from "components/Atoms";
import {
  CalendarIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@radix-ui/react-icons";

const InputDiv = styled("div", {
  height: "36px",
  border: "solid 1px black",
  backgroundColor: "white",
  textAlign: "center",
  lineHeight: 2.4,
  borderRadius: 4,
  fontSize: 15,
});

const StyledChevronRightIcon = styled(ChevronRightIcon, {
  position: "absolute",
  top: "11px",
  right: "9px",
});
const StyledChevronLeftIcon = styled(ChevronLeftIcon, {
  position: "absolute",
  top: "11px",
  left: "9px",
});
const StyledCalendarIcon = styled(CalendarIcon, {
  position: "absolute",
  top: "11px",
  left: "24px",
});

const width = "110px";

export type DayMonthInputClickType = "left" | "right";

type DayMonthInputType = {
  value: string;
  onClick: (value: DayMonthInputClickType) => void;
};

const DayMonthInput = ({ value, onClick }: DayMonthInputType) => {
  return (
    <Box
      css={{
        position: "relative",
        cursor: "pointer",
        width,
      }}
    >
      <InputDiv css={{ width }}>
        <Span
          css={{
            marginLeft: "8px",
          }}
        >
          {value}
        </Span>
      </InputDiv>
      <StyledCalendarIcon />
      <StyledChevronRightIcon onClick={() => onClick("right")} />
      <StyledChevronLeftIcon onClick={() => onClick("left")} />
    </Box>
  );
};

export { DayMonthInput };
