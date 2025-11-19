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
  padding: ${props => props.theme.space.large} ${props => props.theme.space.medium};
  
  ${media.sm} {
    padding: ${props => props.theme.space.medium} ${props => props.theme.space.small};
  }
`;

const PageHeader = styled.div`
  margin-bottom: ${props => props.theme.space.large};
  text-align: center;
  
  ${media.sm} {
    margin-bottom: ${props => props.theme.space.medium};
  }
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes.fontSizeXL};
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin: 0 0 ${props => props.theme.space.small} 0;
  
  ${media.sm} {
    font-size: ${props => props.theme.fontSizes.fontSizeL};
  }
`;

const PageSubtitle = styled.p`
  font-size: ${props => props.theme.fontSizes.fontSizeM};
  color: ${props => props.theme.colors.secondary};
  margin: 0;
  
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

interface SimpleLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({
  children,
  title,
  subtitle,
  className
}) => {
  return (
    <LayoutContainer className={className}>
      <Header>
        <Navigation />
      </Header>
      
      <MainContent>
        {(title || subtitle) && (
          <PageHeader>
            {title && <PageTitle>{title}</PageTitle>}
            {subtitle && <PageSubtitle>{subtitle}</PageSubtitle>}
          </PageHeader>
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

export default SimpleLayout;
