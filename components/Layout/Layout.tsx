import React from "react";
import Image from "next/image";
import { Navigation } from "components/Sidebar/Sidebar";
import { Container, Main, StyledFooter, LogoSpan } from './Layout.styled';

export const Footer = () => {
  return (
    <StyledFooter>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by{" "}
        <LogoSpan>
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </LogoSpan>
      </a>
    </StyledFooter>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Container>
      <Navigation />
      <Main>{children}</Main>
      {/* <Footer /> */}
    </Container>
  );
};

export default Layout;
