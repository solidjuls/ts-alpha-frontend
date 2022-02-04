import { styled, keyframes } from "@stitches/react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { blackA } from "@radix-ui/colors";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import {
  Root,
  Trigger,
  Content,
  Item,
  Arrow,
  Separator,
} from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";

const styledItemStyles = {
  fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  fontSize: "$2",
  lineHeight: "1",
  color: "black",
  cursor: "pointer",
  borderRadius: "$1",
  margin: 5,
  transition: "all 50ms",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "relative",

  "&:focus": {
    outline: "none",
    backgroundColor: "darkBlue",
    color: "white",
  },
};

const StyledAvatar = styled(AvatarPrimitive.Root, {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  verticalAlign: "middle",
  overflow: "hidden",
  userSelect: "none",
  width: 45,
  height: 45,
  borderRadius: "100%",
  backgroundColor: blackA.blackA3,
});

const StyledImage = styled(AvatarPrimitive.Image, {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "inherit",
});

const StyledTrigger = styled(Trigger, {
  padding: "0px",
  border: "none",
  backgroundColor: "#24292f",
});

const StyledTriangleDownIcon = styled(TriangleDownIcon, {
  color: "white",
});

const slideUpAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideRightAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(-2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const slideDownAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(-2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideLeftAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const StyledArrow = styled(Arrow, {
  fill: "white",
});

const StyledSeparator = styled(Separator, {
  height: 1,
  backgroundColor: "#24292f",
});

const StyledContent = styled(Content, {
  minWidth: 120,
  backgroundColor: "white",
  borderRadius: 6,
  padding: 5,
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
  "@media (prefers-reduced-motion: no-preference)": {
    animationDuration: "400ms",
    animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: "transform, opacity",
    '&[data-state="open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  },
});

const Flex = styled("div", { display: "flex", flexDirection: "row" });
const StyledItem = styled(Item, { ...styledItemStyles });

const UserAvatar = ({ name }: { name: String }) => {
  return (
    <Flex>
      <Root>
        <StyledTrigger>
          <StyledAvatar>
            <StyledImage src="https://avatars.githubusercontent.com/u/16022476?s=400&u=92d3395074971a36d6e5e5bf91a6a26706078afe&v=4"></StyledImage>
          </StyledAvatar>
          <StyledTriangleDownIcon />
        </StyledTrigger>
        <StyledContent align="end">
          <div>{`Signed in as ${name}`}</div>
          <StyledSeparator />
          <StyledItem>
            <Link href="/userprofile" passHref>
              Profile
            </Link>
          </StyledItem>
          <StyledSeparator />
          <StyledItem
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </StyledItem>
          <Item />
          <StyledArrow offset={30} />
        </StyledContent>
      </Root>
    </Flex>
  );
};

export { UserAvatar };
