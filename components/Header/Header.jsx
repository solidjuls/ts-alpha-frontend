import { styled } from "@stitches/react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const HeaderContainer = styled("div", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  backgroundColor: "rgb(103, 58, 183)",
  padding: "16px",
});

const Logo = styled("div", {
  color: "white",
});
const Text = styled("div", {
  color: "white",
});

const Header = () => {
  const { data: session } = useSession();

  return (
    <HeaderContainer>
      <Link href="/" passHref>
        <Logo>Twilight Struggle Competition Hub</Logo>
      </Link>
      <Link href="/login" passHref>
        <Text>{session ? `Hi ${session?.user?.name}` : "Sign In"}</Text>
      </Link>
    </HeaderContainer>
  );
};

export default Header;
