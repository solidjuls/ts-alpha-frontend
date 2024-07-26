import { useRouter } from "next/router";
import { styled } from "stitches.config";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

const ChevronSpan = styled("span", {
  display: "inline-flex",
  alignSelf: "center",
  flexShrink: "0",
  marginInlineEnd: "0.5rem",
});
const LinkButton = styled("a", {
  display: "inline-flex",
  appearance: "none",
  alignItems: "center",
  justifyContent: "center",
  userSelect: "none",
  position: "relative",
  whiteSpace: "nowrap",
  verticalAlign: "baseline",
  outline: "transparent solid 2px",
  outlineOffset: "2px",
  lineHeight: "normal",
  borderRadius: "0.375rem",
  fontWeight: "600",
  height: "auto",
  minWidth: "2,5rem",
  fontSize: "1rem",
  padding: "0px",
  color: "#DD6B20",
});
const Backbutton = () => {
  const router = useRouter();

  return (
    <LinkButton type="button" onClick={() => router.back()}>
      <ChevronSpan>
        <ChevronLeftIcon />
      </ChevronSpan>
      Back
    </LinkButton>
  );
};

export { Backbutton };
