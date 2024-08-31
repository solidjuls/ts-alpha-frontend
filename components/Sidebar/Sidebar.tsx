import Link from "next/link";
import { Box } from "components/Atoms";
import Text from "components/Text";
import { useSession } from "contexts/AuthProvider";
import { styled } from "stitches.config";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { FormattedMessage } from "react-intl";
import { UserAvatar } from "components/UserAvatar";

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
  backgroundColor: "#E2E8F0",
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
  display: "none",
  "@sm": {
    display: "flex",
    justifyContent: "flex-start",
    cursor: "pointer",
  },
});
export const UnstyledLink = styled(Link, {
  all: "unset" /* Unset all styles */,
  display: "inline" /* Reset to inline display */,
  cursor: "pointer" /* Set cursor to pointer */,
});
const Items = ({ styles }: any) => {
  return (
    <>
      <UnstyledLink href="/" passHref>
        <Text strong="bold" css={styles}>Home Page</Text>
      </UnstyledLink>
      <UnstyledLink href="/players" passHref>
        <Text strong="bold" css={styles}>Player List</Text>
      </UnstyledLink>
      {/* <Text css={styles}>Federations</Text> */}
      <UnstyledLink href="/submitform" passHref>
        <Text strong="bold" css={styles}>Submit Form</Text>
      </UnstyledLink>
    </>
  );
};
const HorizontalNavigation = () => {
  const { name } = useSession();
  return (
    <Flex css={{ justifyContent: "space-between", backgroundColor: "#E2E8F0" }}>
      <Box
        css={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Items styles={horizontalItemStyles} />
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
    </Flex>
  );
};

const Sidebar = () => {
  return (
    <Box css={{ position: "relative" }}>
      <Box
        css={{
          width: "100%",
          backgroundColor: "white",
          border: "solid 1px black",
        }}
      >
        <Items styles={sidebarItemStyles} />
      </Box>
    </Box>
  );
};

export { Sidebar, HorizontalNavigation };
