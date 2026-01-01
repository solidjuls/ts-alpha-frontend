import { useAuth } from "contexts/AuthProviderNew";
import { FormattedMessage } from "react-intl";
import {
  Flex,
  StyledText,
  HorizontalNavigationLayout,
  UnstyledLink,
  VerticalSidebarLayout,
  NavigationContainer,
  HorizontalItemsContainer,
  HorizontalNavText,
} from './Sidebar.styled';
import { userRoles } from "utils/constants";
import { SignOutLink } from "components/SignOutLink"; // import the new SignOutLink
import { Form } from "react-hook-form";

const Items = ({ role }: any) => {
  return (
    <>
      <UnstyledLink href="/" passHref>
        <HorizontalNavText>Game Results</HorizontalNavText>
      </UnstyledLink>
      <UnstyledLink href="/players" passHref>
        <HorizontalNavText>Player List</HorizontalNavText>
      </UnstyledLink>
      <UnstyledLink href="/submit-game" passHref>
        <HorizontalNavText>Submit Form</HorizontalNavText>
      </UnstyledLink>
      <UnstyledLink href="/schedule" passHref>
        <HorizontalNavText>My Schedule</HorizontalNavText>
      </UnstyledLink>
      <UnstyledLink href="/standings" passHref>
        <HorizontalNavText>Standings</HorizontalNavText>
      </UnstyledLink>
      <UnstyledLink href="/userprofile" passHref>
        <HorizontalNavText>
          <FormattedMessage id="profileText" defaultMessage="Profile" />
        </HorizontalNavText>
      </UnstyledLink>
      {role === userRoles.SUPERADMIN && (
        <UnstyledLink href="/recreateform" passHref>
          <HorizontalNavText>Recreate Form</HorizontalNavText>
        </UnstyledLink>
      )}
      {role === userRoles.SUPERADMIN && (
        <UnstyledLink href="/register" passHref>
          <HorizontalNavText>Register User</HorizontalNavText>
        </UnstyledLink>
      )}
      <UnstyledLink href="/tournaments" passHref>
        <HorizontalNavText>Tournaments</HorizontalNavText>
      </UnstyledLink>
      <UnstyledLink href="/hall-of-fame" passHref>
        <HorizontalNavText>Hall of Fame</HorizontalNavText>
      </UnstyledLink>
      <UnstyledLink href="/about" passHref>
        <HorizontalNavText>
          <FormattedMessage id="aboutUs" defaultMessage="About Us" />
        </HorizontalNavText>
      </UnstyledLink>
    </>
  );
};

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
  return (
    <VerticalSidebarLayout>
      {/* Optional vertical menu trigger for small screens */}
      {/* Keep your dropdown menu for small screen if desired */}
      <HorizontalItemsContainer>
        <Items role={user?.role} />
      </HorizontalItemsContainer>
    </VerticalSidebarLayout>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <VerticalSidebar />
      <HorizontalNavigation />
    </NavigationContainer>
  );
};

export { Navigation };
