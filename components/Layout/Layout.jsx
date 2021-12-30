import { styled } from "@stitches/react";
import Image from "next/image";
import Header from "components/Header";

const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  padding: "0 2rem",
  // backgroundColor: "rgb(240, 235, 248)",
  minHeight: "100vh",
  width: "100%",
  height: "100%",
});

const Content = styled("div", {
  display: "flex",
  flexGrow: "1",
  justifyContent: "center",
});

const StyledFooter = styled("footer", {
  display: "flex",
  padding: "2rem 0",
  borderTop: "1px solid #eaeaea",
  justifyContent: "center",
  alignItems: "center",
  ["footer a"]: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
});

const Logo = styled("span", {
  height: "1em",
  marginLeft: "0.5rem",
});

const Footer = () => {
  return (
    <StyledFooter>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by{" "}
        <Logo>
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </Logo>
      </a>
    </StyledFooter>
  );
};
const Layout = ({ children }) => {
  return (
    <Container>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </Container>
  );
};

export { Layout };
