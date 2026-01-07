import { useState } from "react";
import { useAuth } from "contexts/AuthProviderNew";
import { FormattedMessage } from "react-intl";
import { userRoles } from "utils/constants";
import { SignOutLink } from "components/SignOutLink";

import {
  Flex,
  HorizontalNavigationLayout,
  UnstyledLink,
  VerticalSidebarLayout,
  NavigationContainer,
  HorizontalItemsContainer,
  HorizontalNavText,
  MobileMenuButton,
  MobileMenu,
  StyledHamburgerMenuIcon,
  MobileBrand,
  MobileAuthRow,
} from "./Sidebar.styled";

const Items = ({
  role,
  onNavigate,
}: {
  role?: string;
  onNavigate?: () => void;
}) => (
  <>
    <UnstyledLink href="/" passHref onClick={onNavigate}>
      <HorizontalNavText>Game Results</HorizontalNavText>
    </UnstyledLink>

    <UnstyledLink href="/players" passHref onClick={onNavigate}>
      <HorizontalNavText>Player List</HorizontalNavText>
    </UnstyledLink>

    <UnstyledLink href="/submit-game" passHref onClick={onNavigate}>
      <HorizontalNavText>Submit Form</HorizontalNavText>
    </UnstyledLink>

    <UnstyledLink href="/schedule" passHref onClick={onNavigate}>
      <HorizontalNavText>My Schedule</HorizontalNavText>
    </UnstyledLink>

    <UnstyledLink href="/standings" passHref onClick={onNavigate}>
      <HorizontalNavText>Standings</HorizontalNavText>
    </UnstyledLink>

    <UnstyledLink href="/userprofile" passHref onClick={onNavigate}>
      <HorizontalNavText>
        <FormattedMessage id="profileText" defaultMessage="Profile" />
      </HorizontalNavText>
    </UnstyledLink>

    {role === userRoles.SUPERADMIN && (
      <UnstyledLink href="/recreateform" passHref onClick={onNavigate}>
        <HorizontalNavText>Recreate Form</HorizontalNavText>
      </UnstyledLink>
    )}

    {role === userRoles.SUPERADMIN && (
      <UnstyledLink href="/register" passHref onClick={onNavigate}>
        <HorizontalNavText>Register User</HorizontalNavText>
      </UnstyledLink>
    )}

    <UnstyledLink href="/tournaments" passHref onClick={onNavigate}>
      <HorizontalNavText>Tournaments</HorizontalNavText>
    </UnstyledLink>

    <UnstyledLink href="/hall-of-fame" passHref onClick={onNavigate}>
      <HorizontalNavText>Hall of Fame</HorizontalNavText>
    </UnstyledLink>

    <UnstyledLink href="/about" passHref onClick={onNavigate}>
      <HorizontalNavText>
        <FormattedMessage id="aboutUs" defaultMessage="About Us" />
      </HorizontalNavText>
    </UnstyledLink>
  </>
);


const HorizontalNavigation = () => {
  const { user } = useAuth();

  return (
    <HorizontalNavigationLayout>
      <HorizontalItemsContainer>
        <Items role={user?.role} />
      </HorizontalItemsContainer>

      <Flex>
        {!user && (
          <UnstyledLink href="/login" passHref>
            <HorizontalNavText>
              <FormattedMessage id="signIn" defaultMessage="Sign In" />
            </HorizontalNavText>
          </UnstyledLink>
        )}
        {user && <SignOutLink />}
      </Flex>
    </HorizontalNavigationLayout>
  );
};

const VerticalSidebar = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <VerticalSidebarLayout>
      <MobileBrand>ITS Junta</MobileBrand>

      <MobileMenuButton onClick={() => setOpen((prev) => !prev)} aria-label="Toggle navigation">
        <StyledHamburgerMenuIcon />
      </MobileMenuButton>

      {open && (
  <MobileMenu>
    <HorizontalItemsContainer>
      <Items role={user?.role} onNavigate={() => setOpen(false)} />
    </HorizontalItemsContainer>

    <MobileAuthRow>
      {!user && (
        <UnstyledLink href="/login" passHref onClick={() => setOpen(false)}>
          <HorizontalNavText>
            <FormattedMessage id="signIn" defaultMessage="Sign In" />
          </HorizontalNavText>
        </UnstyledLink>
      )}
      {user && <SignOutLink /* see note below */ />}
    </MobileAuthRow>
  </MobileMenu>
)}

    </VerticalSidebarLayout>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      {/* Mobile bar */}
      <VerticalSidebar />
      {/* Desktop nav */}
      <HorizontalNavigation />
    </NavigationContainer>
  );
};

export { Navigation };
