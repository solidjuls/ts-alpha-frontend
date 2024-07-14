import { FormattedMessage, useIntl } from "react-intl";
import { styled } from "stitches.config";
import Link from "next/link";
import { useSession } from "contexts/AuthProvider";
import { UserAvatar } from "components/UserAvatar";
import Text from "components/Text";
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

const Header = ({ openSidebar }: { openSidebar: () => void }) => {
  const { name } = useSession();
  const intl = useIntl();

  return (
    <HeaderContainer>
      <StyledHamburgerMenuIcon color="white" onClick={openSidebar} />
      <Link href="/" passHref>
        {/* <Logo>Twilight Struggle Competition Hub</Logo> */}
        <StyledText>Twilight Struggle Competition Hub</StyledText>
      </Link>
      <Flex>
        {/* <ThemeToggle /> */}

        {!name && (
          <Link href="/login" passHref>
            <StyledText>
              <FormattedMessage id="signIn" />
            </StyledText>
          </Link>
        )}
        {name && (
          <Flex display={{ "@sm": "none" }}>
            <UserAvatar name={name} />
          </Flex>
        )}
      </Flex>
    </HeaderContainer>
  );
};

export default Header;
