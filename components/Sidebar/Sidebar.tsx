import { useSession } from "contexts/AuthProvider";
import { FormattedMessage } from "react-intl";
import { UserAvatar } from "components/UserAvatar";
import {
  Root,
  Trigger,
  Portal,
  Item,
} from "@radix-ui/react-dropdown-menu";
import { userRoles } from "utils/constants";
import {
  Flex,
  StyledText,
  StyledHamburgerMenuIcon,
  HorizontalNavigationLayout,
  UnstyledLink,
  StyledContent,
  VerticalSidebarLayout,
  NavigationContainer,
  HorizontalItemsContainer,
  HorizontalNavText,
} from './Sidebar.styled';

const Items = ({ role }: any) => {
  return (
    <>
      <UnstyledLink href="/" passHref>
        <HorizontalNavText>
          Game Results
        </HorizontalNavText>
      </UnstyledLink>
      <UnstyledLink href="/players" passHref>
        <HorizontalNavText>
          Player List
        </HorizontalNavText>
      </UnstyledLink>
      {/* <HorizontalNavText>Federations</HorizontalNavText> */}
      <UnstyledLink href="/submit-game" passHref>
        <HorizontalNavText>
          Submit Form
        </HorizontalNavText>
      </UnstyledLink>
      <UnstyledLink href="/schedule" passHref>
        <HorizontalNavText>
          My Schedule
        </HorizontalNavText>
      </UnstyledLink>
      <UnstyledLink href="/standings" passHref>
        <HorizontalNavText>
          Standings
        </HorizontalNavText>
      </UnstyledLink>
      <UnstyledLink href="/userprofile" passHref>
        <HorizontalNavText>
          <FormattedMessage id="profileText" />
        </HorizontalNavText>
      </UnstyledLink>
      {role === userRoles.SUPERADMIN && (
        <UnstyledLink href="/recreateform" passHref>
          <HorizontalNavText>
            Recreate Form
          </HorizontalNavText>
        </UnstyledLink>
      )}
      {role === userRoles.SUPERADMIN && (
        <UnstyledLink href="/register" passHref>
          <HorizontalNavText>
            Register User
          </HorizontalNavText>
        </UnstyledLink>
      )}
      <UnstyledLink href="/tournaments" passHref>
        <HorizontalNavText>
          Tournaments
        </HorizontalNavText>
      </UnstyledLink>
      <UnstyledLink href="/hall-of-fame" passHref>
        <HorizontalNavText>
          Hall of Fame
        </HorizontalNavText>
      </UnstyledLink>
      <UnstyledLink href="/about" passHref>
        <HorizontalNavText>
          About Us
        </HorizontalNavText>
      </UnstyledLink>
    </>
  );
};

const HorizontalNavigation = () => {
  const { name, role } = useSession();

  return (
    <HorizontalNavigationLayout>
      <HorizontalItemsContainer>
        <Items role={role} />
      </HorizontalItemsContainer>
      {!name && (
        <UnstyledLink href="/login" passHref>
          <StyledText>
            <FormattedMessage id="signIn" />
          </StyledText>
        </UnstyledLink>
      )}
      {name && (
        <Flex>
          <UserAvatar name={name} />
        </Flex>
      )}
    </HorizontalNavigationLayout>
  );
};


const VerticalSidebar = () => {
  const { name, role } = useSession();
  return (
    <VerticalSidebarLayout>
      <Root>
        <Trigger style={{ border: "none" }}>
          <StyledHamburgerMenuIcon />
        </Trigger>
        <Portal>
          <StyledContent align="end">
            <UnstyledLink href="/" passHref>
              <Item>
                <HorizontalNavText>
                  Game Results
                </HorizontalNavText>
              </Item>
            </UnstyledLink>
            <UnstyledLink href="/players" passHref>
              <Item>
                <HorizontalNavText>
                  Player List
                </HorizontalNavText>
              </Item>
            </UnstyledLink>
            <UnstyledLink href="/submit-game" passHref>
              <Item>
                <HorizontalNavText>
                  Submit Form
                </HorizontalNavText>
              </Item>
            </UnstyledLink>
            <UnstyledLink href="/schedule" passHref>
              <HorizontalNavText>
                My Schedule
              </HorizontalNavText>
            </UnstyledLink>
            <UnstyledLink href="/standings" passHref>
              <HorizontalNavText>
                Standings
              </HorizontalNavText>
            </UnstyledLink>
            {role === userRoles.SUPERADMIN && (
              <UnstyledLink href="/recreateform" passHref>
                <Item>
                  <HorizontalNavText>
                    Recreate Form
                  </HorizontalNavText>
                </Item>
              </UnstyledLink>
            )}
            {role === userRoles.SUPERADMIN && (
              <UnstyledLink href="/userprofile" passHref>
                <Item>
                  <HorizontalNavText>
                    Register Form
                  </HorizontalNavText>
                </Item>
              </UnstyledLink>
            )}
            <UnstyledLink href="/userprofile" passHref>
              <Item>
                <HorizontalNavText>
                  <FormattedMessage id="profileText" />
                </HorizontalNavText>
              </Item>
            </UnstyledLink>
            <UnstyledLink href="/tournaments" passHref>
              <HorizontalNavText>
                Tournaments
              </HorizontalNavText>
            </UnstyledLink>
            <UnstyledLink href="/hall-of-fame" passHref>
              <HorizontalNavText>
                Hall of Fame
              </HorizontalNavText>
            </UnstyledLink>
            <UnstyledLink href="/about" passHref>
              <Item>
                <HorizontalNavText>
                  <FormattedMessage id="aboutUs" />
                </HorizontalNavText>
              </Item>
            </UnstyledLink>
            <UnstyledLink href="/login" passHref>
              <Item>
                <HorizontalNavText>
                  {name ? <FormattedMessage id="signOut" /> : <FormattedMessage id="signIn" />}
                </HorizontalNavText>
              </Item>
            </UnstyledLink>
          </StyledContent>
        </Portal>
      </Root>
    </VerticalSidebarLayout>
  );
};
const Navigation = () => {
  return (
    <>
      <NavigationContainer>
        <VerticalSidebar />
        <HorizontalNavigation />
      </NavigationContainer>
    </>
  );
};

export { Navigation };
