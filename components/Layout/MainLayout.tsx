import React from "react";
import styled from "styled-components";
import { Navigation } from "components/Sidebar/Sidebar";
import { media } from "../../theme";

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: var(--surface-ground, #f8f9fa);
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--gray-200, #e5e7eb);
  border-bottom: 1px solid ${props => props.theme.colors.greyLight};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.space.medium};
  
  ${media.sm} {
    padding: ${props => props.theme.space.small};
  }
`;

const HeroSection = styled.section`
  width: 100%;
  height: 300px;
  background-image: url('/menu-image.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  margin-bottom: ${props => props.theme.space.large};
  position: relative;
  overflow: hidden;
  
  ${media.sm} {
    height: 200px;
    margin-bottom: ${props => props.theme.space.medium};
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.3) 100%
    );
  }
`;

const HeroContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 2;
`;

const HeroTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes.fontSizeXL};
  font-weight: bold;
  margin: 0 0 ${props => props.theme.space.small} 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  
  ${media.sm} {
    font-size: ${props => props.theme.fontSizes.fontSizeL};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${props => props.theme.fontSizes.fontSizeM};
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  
  ${media.sm} {
    font-size: ${props => props.theme.fontSizes.fontSizeS};
  }
`;

const ContentSection = styled.section`
  background: white;
  border-radius: 8px;
  padding: ${props => props.theme.space.large};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.greyLight};
  
  ${media.sm} {
    padding: ${props => props.theme.space.medium};
  }
`;

const Footer = styled.footer`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textLight};
  text-align: center;
  padding: ${props => props.theme.space.large} ${props => props.theme.space.medium};
  margin-top: auto;
  border-top: 1px solid ${props => props.theme.colors.greyLight};
`;

const FooterText = styled.p`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.fontSizeS};
  opacity: 0.9;
`;

interface MainLayoutProps {
  children: React.ReactNode;
  showHero?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showHero = false,
  heroTitle = "Twilight Struggle Tournaments",
  heroSubtitle = "Competitive online tournaments for all skill levels",
  className
}) => {
  return (
    <LayoutContainer className={className}>
      <Header>
        <Navigation />
      </Header>
      
      <MainContent>
        {showHero && (
          <HeroSection>
            <HeroContent>
              <HeroTitle>{heroTitle}</HeroTitle>
              <HeroSubtitle>{heroSubtitle}</HeroSubtitle>
            </HeroContent>
          </HeroSection>
        )}
        
        <ContentSection>
          {children}
        </ContentSection>
      </MainContent>
      
      <Footer>
        <FooterText>
          &copy; {new Date().getFullYear()} Twilight-Struggle.com | All rights reserved.
        </FooterText>
      </Footer>
    </LayoutContainer>
  );
};

export default MainLayout;
