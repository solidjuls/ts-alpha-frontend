import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { Navigation } from "components/Sidebar/Sidebar";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  height: 100%;
`;

const Main = styled.main`
  align-items: center;
  flex-direction: column;
  display: flex;
  background-color: var(--surface-ground);
  flex-grow: 1;
`;

const StyledFooter = styled.footer`
  display: flex;
  padding: 2rem 0;
  border-top: 1px solid #eaeaea;
  justify-content: center;
  align-items: center;

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }
`;

const LogoSpan = styled.span`
  height: 1em;
  margin-left: 0.5rem;
`;

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
