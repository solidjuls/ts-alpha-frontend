import React from "react";
import Image from "next/image";
import { Navigation } from "components/Sidebar/Sidebar";
import {Container, Main, StyledFooter, Banner, BannerTitle} from "./Layout.styled";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <StyledFooter>
      © {year}{" "}
      <a
        href="https://docs.google.com/document/d/1tfDV_R2GXQfTmBAEjzlPUIY__BsU1Yd3eauIfzMVBI4/"
        target="_blank"
        rel="noopener noreferrer"
      >
        ITS Junta
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

      <Banner>
        <Image
          src="/menu-image.jpeg"
          alt="Twilight Struggle Banner"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />

        <BannerTitle>
          International Twilight Struggle Community
        </BannerTitle>
      </Banner>

      <Main>{children}</Main>
      { <Footer /> }
    </Container>
  );
};

export default Layout;
