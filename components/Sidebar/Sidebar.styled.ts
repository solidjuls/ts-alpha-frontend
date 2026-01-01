import styled, { keyframes } from "styled-components";
import Link from "next/link";
import Text from "components/Text";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Content } from "@radix-ui/react-dropdown-menu";
import { media } from "../../theme";

// Keyframes for animations
const slideUpAndFade = keyframes`
  0% { opacity: 0; transform: translateY(2px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const slideRightAndFade = keyframes`
  0% { opacity: 0; transform: translateX(-2px); }
  100% { opacity: 1; transform: translateX(0); }
`;

const slideDownAndFade = keyframes`
  0% { opacity: 0; transform: translateY(-2px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const slideLeftAndFade = keyframes`
  0% { opacity: 0; transform: translateX(2px); }
  100% { opacity: 1; transform: translateX(0); }
`;

// Styled components
interface FlexProps {
  $display?: "none";
}

export const Flex = styled.div<FlexProps>`
  display: ${props => props.$display === "none" ? "none" : "flex"};
  flex-direction: row;
  align-items: center;
`;

export const StyledText = styled(Text)`
  display: flex;
  cursor: pointer;
  color: var(--primary-text);
  
  ${media.sm} {
    display: none;
  }
`;

export const StyledHamburgerMenuIcon = styled(HamburgerMenuIcon)`
  color: var(--primary-text);
  
  ${media.sm} {
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: flex-start;
    cursor: pointer;
  }
`;

export const HorizontalNavigationLayout = styled(Flex)`
  justify-content: space-between;
  background-color: var(--bg-card);
  width: 100%;
  
  ${media.sm} {
    display: none;
  }
`;

export const UnstyledLink = styled(Link)`
  all: unset;
  color: var(--primary-text);
  font-weight: 600;

  /* Explicitly remove underline */
  text-decoration: none;

  &:hover,
  &:focus,
  &:active {
    color: var(--ussr);
    text-decoration: none;
  }
`;

export const StyledContent = styled(Content)`
  min-width: 120px;
  border-radius: 6px;
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2);
  
  @media (prefers-reduced-motion: no-preference) {
    animation-duration: 400ms;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity;
    
    &[data-state="open"] {
      &[data-side="top"] { animation-name: ${slideDownAndFade}; }
      &[data-side="right"] { animation-name: ${slideLeftAndFade}; }
      &[data-side="bottom"] { animation-name: ${slideUpAndFade}; }
      &[data-side="left"] { animation-name: ${slideRightAndFade}; }
    }
  }
`;

export const VerticalSidebarLayout = styled(Flex)`
  display: none;
  
  ${media.sm} {
    display: flex;
  }
`;

export const NavigationContainer = styled.div`
  display: flex;
  background-color: var(--bg-card);
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  width: 100%;
`;

export const HorizontalItemsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const VerticalNavigationContainer = styled(Flex)`
  background-color: var(--bg-card);
  flex-direction: column;
  align-items: flex-start;
`;

export const HorizontalNavText = styled(Text)`
  background-color: var(--bg-card);
  cursor: pointer;
  padding: 8px 12px;
  margin: 0;
`;

export const SidebarNavText = styled(Text)`
  border-top: solid 1px rgba(255,255,255,.15);
  background-color: var(--bg-card);
  color: var(--primary-text);
  cursor: pointer;
  padding: 8px 16px;
  margin: 0;
`;