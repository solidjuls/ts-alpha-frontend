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
  color: "$textLight",
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

const Items = ({ styles }: any) => {
  return (
    <>
      <Link href="/" passHref>
        <Text css={styles}>Home Page</Text>
      </Link>
      <Link href="/players" passHref>
        <Text css={styles}>Player List</Text>
      </Link>
      {/* <Text css={styles}>Federations</Text> */}
      <Link href="/submitform" passHref>
        <Text css={styles}>Submit Form</Text>
      </Link>
    </>
  );
};
const HorizontalNavigation = () => {
  const { name } = useSession();
  
  return (
    <Flex css={{ justifyContent: 'space-between', backgroundColor: "#E2E8F0" }}>
      <Box
        css={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Items styles={horizontalItemStyles} />
      </Box>
      {!name && (
            <Link href="/login" passHref>
              <StyledText>
                <FormattedMessage id="signIn" />
              </StyledText>
            </Link>
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
