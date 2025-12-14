import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  height: 100%;
  background-color: var(--surface-ground);
`;

export const Main = styled.main`
  align-items: center;
  flex-direction: column;
  display: flex;
  background-color: var(--surface-ground);
  flex-grow: 1;
`;

export const StyledFooter = styled.footer`
  display: flex;
  padding: 2rem 0;
  border-top: 1px solid #eaeaea;
  justify-content: center;
  align-items: center;

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }
`;

export const LogoSpan = styled.span`
  height: 1em;
  margin-left: 0.5rem;
`;

export const Banner = styled.div`
  width: 100%;
  margin-bottom: 8px;
  @media (max-width: 768px) {
    height: 120px;
  }
`;

export const BannerImage = styled.img`
  width: 100%;
  height: 50%;
  object-fit: cover;
  object-position: center;
`;
