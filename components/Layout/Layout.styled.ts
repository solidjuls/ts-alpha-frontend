import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Main = styled.main`
  flex: 1;
  padding: 1rem;
`;

export const Banner = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;

  /* Subtle dark overlay for text contrast */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.45),
      rgba(0, 0, 0, 0.55)
    );
    z-index: 1;
  }
`;

export const BannerTitle = styled.h1`
  position: absolute;
  z-index: 2;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0;
  padding: 0 1rem;

  color: #ffffff;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-align: center;

  /* Cold War–appropriate restraint */
  text-transform: uppercase;
`;

export const StyledFooter = styled.footer`
  text-align: center;
  padding: 1rem;
  font-size: 0.85rem;
  color: #6b7280; /* neutral gray */
  }
`;

export const LogoSpan = styled.span`
  margin-left: 0.5rem;
  display: inline-flex;
  vertical-align: middle;
`;
