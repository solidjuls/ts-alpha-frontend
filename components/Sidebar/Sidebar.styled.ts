import styled from "styled-components";
import Link from "next/link";
import Text from "components/Text";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { media } from "../../theme";

/* Flexible row container */
export const Flex = styled.div`
  display: flex;
  align-items: center;
`;

/* Top-level nav bar */
export const NavigationContainer = styled.nav`
  position: relative;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 0 16px;

  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border);
`;

/* Desktop navigation (hidden on small screens) */
export const HorizontalNavigationLayout = styled(Flex)`
  flex: 1;
  justify-content: space-between;
  gap: 8px;

  ${media.lg} {
    display: none;
  }
`;

/* Container for the group of nav items */
export const HorizontalItemsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

/* Text inside nav items */
export const HorizontalNavText = styled(Text)`
  padding: 8px 12px;
  margin: 0;
  font-weight: 600;
  color: var(--primary-text);
  border-radius: 4px;

  &:hover {
    color: var(--ussr);
  }
`;

/* Link that uses global link colors but removes underline */
export const UnstyledLink = styled(Link)`
  all: unset;
  cursor: pointer;
  color: inherit;
  text-decoration: none;

  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
  }
`;

/* Mobile bar (hamburger + brand) – hidden on desktop */
export const VerticalSidebarLayout = styled.div`
  display: none;

  ${media.lg} {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
`;

/* Mobile “brand” / title on the left (optional) */
export const MobileBrand = styled(Text)`
  font-weight: 700;
  color: var(--primary-text);
`;

/* Hamburger button on the right */
export const MobileMenuButton = styled.button`
  border: none;
  background: transparent;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;

  color: var(--primary-text);
`;

export const StyledHamburgerMenuIcon = styled(HamburgerMenuIcon)`
  width: 24px;
  height: 24px;
`;

/* Slide-down mobile menu */
export const MobileMenu = styled.nav`
  position: absolute;
  top: 50px;           /* just below the nav bar */
  left: 0;
  right: 0;
  z-index: 1000;

  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  gap: 4px;

  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);

  /* On mobile, make the items stack vertically */
  ${HorizontalItemsContainer} {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }
`;

/* Optional: wrapper for the mobile auth row (Sign In / Sign Out) */
export const MobileAuthRow = styled(Flex)`
  padding: 4px 8px;
  border-top: 1px solid var(--border);
  justify-content: flex-end;
`;

/* Kept for compatibility, though you may not need it now */
export const StyledText = styled(Text)`
  font-weight: 600;
  color: var(--primary-text);
`;
