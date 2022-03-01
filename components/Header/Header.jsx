import { FormattedMessage, useIntl } from "react-intl";
import { styled } from "stitches.config";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserAvatar } from "components/UserAvatar";
import { Text } from "components/Text";
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

const Header = ({ openSidebar }) => {
  const { data: session } = useSession();
  const intl = useIntl();

  return (
    <HeaderContainer>
      <StyledHamburgerMenuIcon color="white" onClick={openSidebar} />
      <Link href="/" passHref>
        {/* <Logo>Twilight Struggle Competition Hub</Logo> */}
        <StyledText>Home</StyledText>
      </Link>
      <Link href="/submitform" passHref>
        <StyledText>Submit Form</StyledText>
      </Link>
      <Flex>
        {/* <ThemeToggle /> */}

        {!session && (
          <Link href="/login" passHref>
            <StyledText>
              <FormattedMessage id="signIn" />
            </StyledText>
          </Link>
        )}
        {session && (
          <Flex display={{ "@sm": "none" }}>
            <StyledText css={{ marginRight: '12px'}}>
              {`${intl.formatMessage({ id: "greeting" })} ${
                session?.user?.name
              }`}
            </StyledText>
            <UserAvatar name={session?.user?.name} />
          </Flex>
        )}
      </Flex>
    </HeaderContainer>
  );
};

export default Header;
