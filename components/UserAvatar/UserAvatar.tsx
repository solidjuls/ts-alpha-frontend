import { FormattedMessage, useIntl } from "react-intl";
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
import { useRouter } from "next/router";
import { useSession } from "contexts/AuthProvider";
import { Box } from "components/Atoms";

const styledItemStyles = {
  fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  fontSize: "$2",
  lineHeight: "1",
  color: "$textDark",
  cursor: "pointer",
  borderRadius: "$1",
  margin: 5,
  height: 25,
  padding: "0 5px",
  paddingLeft: 25,
  transition: "all 50ms",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "relative",

  "&:focus": {
    outline: "none",
    backgroundColor: "darkBlue",
    color: "$textLight",
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
  backgroundColor: "$primary",
});

const StyledTriangleDownIcon = styled(TriangleDownIcon, {
  color: "$backgroundColorLight",
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

const StyledItem = styled(Item, { ...styledItemStyles });

const UserAvatar = ({ name }: { name: string }) => {
  const intl = useIntl();
  const router = useRouter();
  const { logout } = useSession();
  return (
    <Box css={{ display: "flex", flexDirection: "row" }}>
      <Root>
        <StyledTrigger>
          {/* <StyledAvatar>
            <StyledImage src="https://pbs.twimg.com/profile_images/1361968864171618316/T8jfJHNo_400x400.jpg"></StyledImage>
          </StyledAvatar> */}
          <StyledTriangleDownIcon />
        </StyledTrigger>
        <StyledContent align="end">
          <StyledItem>
            <Link href="/userprofile" passHref>
              {intl.formatMessage({ id: "profileText" })}
            </Link>
          </StyledItem>
          <StyledSeparator />
          <StyledItem
            onClick={async () => {
              if (logout) {
                await logout();
                router.push("/");
              }
            }}
          >
            {intl.formatMessage({ id: "signOut" })}
          </StyledItem>
          <Item />
          <StyledArrow offset={30} />
        </StyledContent>
      </Root>
    </Box>
  );
};

export { UserAvatar };
