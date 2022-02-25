import { useState } from "react";
import { styled } from "stitches.config";
import Image from "next/image";
import Header from "components/Header";
import { Sidebar } from "components/Sidebar";
import { Box, Span } from "components/Atoms";

const containerStyles = {
  display: "flex",
  flexDirection: "column",
  // padding: "0 2rem",
  // backgroundColor: "rgb(240, 235, 248)",
  minHeight: "100vh",
  width: "100%",
  height: "100%",
};
const contentStyles = {
  display: "flex",
  flexGrow: "1",
  // justifyContent: "center",
};

const Main = styled("main", {
  // justifyContent: "center",
  alignItems: 'center',
  flexDirection: 'column',
  display: "flex",
  backgroundColor: '#eeeeee'
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
const logoCss = {
  height: "1em",
  marginLeft: "0.5rem",
};
const Footer = () => {
  return (
    <StyledFooter>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by{" "}
        <Span css={logoCss}>
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </Span>
      </a>
    </StyledFooter>
  );
};
const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Box css={containerStyles}>
      <Header openSidebar={() => setIsOpen(!isOpen)} />
      {isOpen && <Sidebar />}
      <Main css={contentStyles}>{children}</Main>
      <Footer />
    </Box>
  );
};

export { Layout };
