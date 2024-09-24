import Link from "next/link";
import { Box } from "components/Atoms";
import Text from "components/Text";
import { useSession } from "contexts/AuthProvider";
import { styled, keyframes } from "stitches.config";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { FormattedMessage } from "react-intl";
import { UserAvatar } from "components/UserAvatar";
import {
  Root,
  Trigger,
  Content,
  Portal,
  Item,
  Arrow,
  Separator,
} from "@radix-ui/react-dropdown-menu";
import { userRoles } from "utils/constants";

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

const sidebarItemStyles = {
  borderTop: "solid 1px rgba(255,255,255,.15)",
  backgroundColor: "#24292f",
  color: "white",
  cursor: "pointer",
  padding: "8px 16px",
  margin: 0,
};

const horizontalItemStyles = {
  borderTop: "solid 1px rgba(255,255,255,.15)",
  backgroundColor: "var(--gray-200)",
  cursor: "pointer",
  color: "black",
  padding: "8px 16px",
  margin: 0,
};

const Flex = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  variants: {
    display: {
      none: {
        display: "none",
      },
    },
  },
});

const StyledText = styled(Text, {
  display: "flex",
  cursor: "pointer",
  fontWeight: "600",
  color: "black",
  "@sm": {
    display: "none",
  },
});

const StyledHamburgerMenuIcon = styled(HamburgerMenuIcon, {
  padding: "8px 16px",

  "@sm": {
    display: "flex",
    justifyContent: "flex-start",
    cursor: "pointer",
  },
});

const HorizontalNavigationLayout = styled(Flex, {
  justifyContent: "space-between",
  backgroundColor: "var(--gray-200)",
  width: "100%",
  "@sm": {
    display: "none",
  },
});
export const UnstyledLink = styled(Link, {
  all: "unset" /* Unset all styles */,
  display: "inline" /* Reset to inline display */,
  cursor: "pointer" /* Set cursor to pointer */,
});
const Items = ({ styles, role }: any) => {
  return (
    <>
      <UnstyledLink href="/" passHref>
        <Text strong="bold" css={styles}>
          Home Page
        </Text>
      </UnstyledLink>
      <UnstyledLink href="/players" passHref>
        <Text strong="bold" css={styles}>
          Player List
        </Text>
      </UnstyledLink>
      {/* <Text css={styles}>Federations</Text> */}
      <UnstyledLink href="/submitform" passHref>
        <Text strong="bold" css={styles}>
          Submit Form
        </Text>
      </UnstyledLink>
      {(role === userRoles.SUPERADMIN || role === userRoles.ADMIN) && (
        <UnstyledLink href="/recreateform" passHref>
          <Text strong="bold" css={horizontalItemStyles}>
            Recreate Form
          </Text>
        </UnstyledLink>
      )}
    </>
  );
};

const VerticalNavigation = () => {
  const { name } = useSession();
  return (
    <Flex
      css={{
        backgroundColor: "#E2E8F0",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    ></Flex>
  );
};

const HorizontalNavigation = () => {
  const { name, role } = useSession();

  return (
    <HorizontalNavigationLayout>
      <Box
        css={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Items styles={horizontalItemStyles} role={role} />
      </Box>
      {!name && (
        <UnstyledLink href="/login" passHref>
          <StyledText>
            <FormattedMessage id="signIn" />
          </StyledText>
        </UnstyledLink>
      )}
      {name && (
        <Flex>
          <UserAvatar name={name} />
        </Flex>
      )}
    </HorizontalNavigationLayout>
  );
};

const StyledContent = styled(Content, {
  minWidth: 120,
  borderRadius: 6,
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

const VerticalSidebarLayout = styled(Flex, {
  display: "none",
  "@sm": {
    display: "flex",
  },
});
const VerticalSidebar = () => {
  const { name } = useSession();
  return (
    <VerticalSidebarLayout>
      <Root>
        <Trigger>
          <StyledHamburgerMenuIcon />
        </Trigger>
        <Portal>
          <StyledContent align="end">
            <UnstyledLink href="/" passHref>
              <Item>
                <Text strong="bold" css={horizontalItemStyles}>
                  Home Page
                </Text>
              </Item>
            </UnstyledLink>
            <UnstyledLink href="/players" passHref>
              <Item>
                <Text strong="bold" css={horizontalItemStyles}>
                  Player List
                </Text>
              </Item>
            </UnstyledLink>
            <UnstyledLink href="/submitform" passHref>
              <Item>
                <Text strong="bold" css={horizontalItemStyles}>
                  Submit Form
                </Text>
              </Item>
            </UnstyledLink>
            <UnstyledLink href="/recreateform" passHref>
              <Item>
                <Text strong="bold" css={horizontalItemStyles}>
                  Recreate Form
                </Text>
              </Item>
            </UnstyledLink>
            <UnstyledLink href="/userprofile" passHref>
              <Item>
                <Text strong="bold" css={horizontalItemStyles}>
                  <FormattedMessage id="profileText" />
                </Text>
              </Item>
            </UnstyledLink>
            <UnstyledLink href="/login" passHref>
              <Item>
                <Text strong="bold" css={horizontalItemStyles}>
                  {name ? <FormattedMessage id="signOut" /> : <FormattedMessage id="signIn" />}
                </Text>
              </Item>
            </UnstyledLink>
          </StyledContent>
        </Portal>
      </Root>
    </VerticalSidebarLayout>
  );
};
const Navigation = () => {
  return (
    <Flex
      css={{
        backgroundColor: "var(--gray-200)",
        flexDirection: "column",
        alignItems: "flex-start",
        height: "50px",
      }}
    >
      <VerticalSidebar />
      <HorizontalNavigation />
    </Flex>
  );
};

export { Navigation };
