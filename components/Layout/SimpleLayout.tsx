import React from "react";
import { Navigation } from "components/Sidebar/Sidebar";
import {
  LayoutContainer,
  Header,
  MainContent,
  PageHeader,
  PageTitle,
  PageSubtitle,
  ContentSection,
  Footer,
  FooterText
} from './SimpleLayout.styled';

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
