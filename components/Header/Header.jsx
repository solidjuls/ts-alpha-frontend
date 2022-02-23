import { FormattedMessage, useIntl } from "react-intl";
import { styled } from "stitches.config";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserAvatar } from "components/UserAvatar";
import { ThemeToggle } from "components/ThemeToggle";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

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

const HeaderContainer = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "$primary",
  padding: "16px 32px 16px 16px",
  // "@sm": {
  //   justifyContent: "flex-end",
  // },
});

const StyledLink = styled(Link, {
  display: "flex",
  cursor: "pointer",
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

const Logo = styled("div", {
  color: "$textLight",
  "@sm": {
    display: "none",
  },
});
const Text = styled("div", {
  color: "$textLight",
  marginRight: "10px",
});

const Header = ({ openSidebar }) => {
  const { data: session } = useSession();
  const intl = useIntl();

  return (
    <HeaderContainer>
      <StyledHamburgerMenuIcon color="white" onClick={openSidebar} />
      <StyledLink href="/" passHref>
        {/* <Logo>Twilight Struggle Competition Hub</Logo> */}
        <Logo>Logo</Logo>
      </StyledLink>
      <StyledLink href="/submitform" passHref>
        <Text>Submit Form</Text>
      </StyledLink>
      <Flex>
        {/* <ThemeToggle /> */}

        {!session && (
          <Link href="/login" passHref>
            <Text>
              <FormattedMessage id="signIn" />
            </Text>
          </Link>
        )}
        {session && (
          <Flex display={{ "@sm": "none" }}>
            <Text>
              {`${intl.formatMessage({ id: "greeting" })} ${
                session?.user?.name
              }`}
            </Text>
            <UserAvatar name={session?.user?.name} />
          </Flex>
        )}
      </Flex>
    </HeaderContainer>
  );
};

export default Header;
