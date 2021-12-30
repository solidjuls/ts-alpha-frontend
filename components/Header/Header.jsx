import { styled } from "@stitches/react";
import Link from "next/link";

const HeaderContainer = styled("div", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  backgroundColor: "rgb(103, 58, 183)",
  padding: "16px",
});

const Logo = styled("div", {
  color: "white",
})
const Text = styled("div", {
  color: "white",
});

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>Twilight Struggle Competition Hub</Logo>
      <Link href="/login" passHref>
        <Text>Sign In</Text>
      </Link>
    </HeaderContainer>
  );
};

export default Header;
