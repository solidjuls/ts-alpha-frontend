import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-main);
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

export const BannerContent = styled.div`
  position: absolute;
  z-index: 2;
  inset: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 0 1rem;
  text-align: center;
`;

export const BannerTitle = styled.h1`
  margin: 0;
  color: #ffffff;

  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const BannerSubtitle = styled.h2`
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.9);

  font-size: clamp(0.95rem, 2vw, 1.1rem);
  font-weight: 600;
  letter-spacing: 0.02em;

  a {
    color: #ffffff;
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover {
      opacity: 0.9;
    }
  }
`;

export const StyledFooter = styled.footer`
  text-align: center;
  padding: 1rem;
  font-size: 0.85rem;
  color: var(--muted-text);
`;

export const LogoSpan = styled.span`
  margin-left: 0.5rem;
  display: inline-flex;
  vertical-align: middle;
`;
