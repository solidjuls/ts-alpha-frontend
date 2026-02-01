import styled, {css} from "styled-components";
import Link from "next/link";

/* ----------------------------
   Shared Card Styles
---------------------------- */

export const BaseCard = styled.section`
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
`;

export const CardInner = styled.div`
  padding: 16px;
`;

export const HeaderCard = styled(BaseCard)`
  display: flex;
`;

export const HeaderInner = styled(CardInner)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/* ----------------------------
   Page Layout + Typography
---------------------------- */

export const Page = styled.main`
  width: 100%;
  max-width: 1000px;
  margin: 24px auto;
  padding: 0 16px 24px;
  color: var(--primary-text);

  @media (min-width: 900px) {
    padding-right: 150px;
  }
`;

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Title = styled.h2`
  margin: 0;
  color: var(--primary-text);
`;

export const Subtitle = styled.h3`
  margin: 0;
  color: var(--primary-text);
`;

export const Subheading = styled.h4`
  margin: 12px 0 0 0;
  color: var(--primary-text);
`;

export const Paragraph = styled.p`
  margin: 0;
  line-height: 1.55;
  color: var(--primary-text);
`;

export const SmallNote = styled.p`
  margin: 0;
  line-height: 1.55;
  color: var(--primary-text);
  opacity: 0.92;
`;

/* ----------------------------
   Links
---------------------------- */

export const InternalLink = styled(Link)``;

export const ExternalLink = styled.a<{ $inactive?: boolean }>`
  ${({ $inactive }) =>
    $inactive &&
    `
      opacity: 0.6;
      text-decoration: line-through;
    `}
`;

/* ----------------------------
   Lists
---------------------------- */

export const List = styled.ul`
  margin: 0;
  padding-left: 20px;
  line-height: 1.55;

  li {
    margin: 6px 0;
  }
`;

export const NestedList = styled.ul`
  margin: 8px 0 0;
  padding-left: 18px;

  li {
    margin: 6px 0;
  }
`;

/* ----------------------------
   Definition Lists (DL)
---------------------------- */

export const Dl = styled.dl`
  margin: 8px 0 0;
  padding: 0;

  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;

export const Dt = styled.dt`
  margin: 0;
  font-weight: 700;
  color: var(--primary-text);
`;

export const Dd = styled.dd`
  margin: 4px 0 0 0;
  color: var(--primary-text);
  opacity: 0.92;
  line-height: 1.55;
`;

export const OrderedList = styled.ol`
  margin: 0;
  padding-left: 20px;
  line-height: 1.55;

  li {
    margin: 6px 0;
  }
`;

export const BulletList = styled.ul`
  margin: 8px 0 0;
  padding-left: 18px;

  li {
    margin: 6px 0;
  }
`;

/* ----------------------------
   Flag Pill (Language Indicator)
---------------------------- */

export const LanguagePill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 4px 8px;
  border-radius: 999px;

  background: rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border);

  color: var(--primary-text);
  font-size: 12px;
  font-weight: 600;

  vertical-align: middle;
`;

export const FlagWrap = styled.span`
  display: inline-flex;
  align-items: center;
  line-height: 0;
  border-radius: 4px;
  overflow: hidden;
`;

/* ----------------------------
   ITSR Section Layout
---------------------------- */

export const ITSRGrid = styled.div`
  display: grid;
  gap: 16px;

  grid-template-columns: 1fr;

  @media (min-width: 900px) {
    grid-template-columns: 1fr minmax(350px, 420px);
    align-items: start;
  }
`;

export const RatingWrapper = styled.div`
  min-width: 0;
  width: 100%;
`;

/* ----------------------------
   Video List Line Helpers
---------------------------- */

export const Inline = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

/* ----------------------------
   Floating Quick Links
---------------------------- */

export const FloatingNav = styled.aside<{ $openMobile?: boolean }>`
  position: fixed;
  right: 16px;
  top: 200px;
  width: 220px;
  z-index: 50;

  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow-soft);

  padding: 12px;

  /* Desktop: always visible */
  display: flex;
  flex-direction: column;
  gap: 10px;

  /* Mobile: becomes a popover */
  @media (max-width: 900px) {
    top: auto;
    bottom: 72px;
    right: 12px;
    width: min(260px, calc(100vw - 24px));

    ${({ $openMobile }) =>
      $openMobile
        ? css`
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0);
          `
        : css`
            opacity: 0;
            pointer-events: none;
            transform: translateY(6px);
          `}

    transition: opacity 0.15s ease, transform 0.15s ease;
  }
`;

export const FloatingNavTitle = styled.div`
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.02em;
  color: var(--muted-text);
  text-transform: uppercase;
`;

export const FloatingNavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FloatingNavItem = styled.li`
  margin: 0;
  padding: 0;
`;

export const FloatingNavLink = styled.button<{ $active?: boolean }>`
  all: unset;
  cursor: pointer;

  display: block;
  width: 100%;
  padding: 8px 10px;

  border-radius: 8px;
  border: 1px solid transparent;

  color: var(--primary-text);
  font-weight: 600;
  line-height: 1.2;

  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;

  &:hover {
    background-color: var(--ussr);
    color: var(--alt-text);
  }

  ${({ $active }) =>
    $active &&
    css`
      border-color: var(--border);
      background-color: rgba(0, 0, 0, 0.04);
    `}
`;

export const FloatingNavToggle = styled.button`
  /* Only visible on mobile */
  display: none;

  @media (max-width: 900px) {
    display: inline-flex;
  }

  position: fixed;
  right: 12px;
  bottom: 16px;
  z-index: 60;

  padding: 10px 12px;
  border-radius: 999px;

  border: 1px solid var(--border);
  background-color: var(--bg-card);
  color: var(--primary-text);

  box-shadow: var(--shadow-soft);

  font-weight: 700;
  cursor: pointer;

  transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background-color: var(--ussr);
    color: var(--alt-text);
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  }

  &:focus-visible {
    outline: 2px solid var(--usa);
    outline-offset: 2px;
  }
`;