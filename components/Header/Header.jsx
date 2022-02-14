import { FormattedMessage, useIntl } from "react-intl";
import stitches from "stitches.config.js";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserAvatar } from "components/UserAvatar";
import { ThemeToggle } from "components/ThemeToggle";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

const Flex = stitches.styled("div", {
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

const HeaderContainer = stitches.styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#24292f",
  padding: "16px 32px 16px 16px",
  "@sm": {
    justifyContent: "flex-end",
  },
});

const Logo = stitches.styled("div", {
  color: "white",
  "@sm": {
    display: "none",
  },
});
const Text = stitches.styled("div", {
  color: "white",
  marginRight: "10px",
});

const Header = ({ openSidebar }) => {
  const { data: session } = useSession();
  const intl = useIntl();

  return (
    <HeaderContainer>
      <Link href="/" passHref>
        {/* <Logo>Twilight Struggle Competition Hub</Logo> */}
        <Logo>Logo</Logo>
      </Link>
      <HamburgerMenuIcon onClick={openSidebar} />
      <Flex>
        <ThemeToggle />

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
