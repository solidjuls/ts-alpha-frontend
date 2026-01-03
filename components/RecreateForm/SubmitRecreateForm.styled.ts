import styled from "styled-components";
import { media } from "theme";
import { Box, Form } from "components/Atoms";
import { Button } from "components/Button";

/* -----------------------
   Layout + style guide
------------------------ */

export const StyledForm = styled(Form)`
  width: 100%;
  align-self: stretch;
`;

export const Banner = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background-color: var(--bg-card);
  box-shadow: var(--shadow-soft);
  color: var(--primary-text);
`;

export const BannerTitle = styled.span`
  font-weight: 700;
`;

export const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 14px;
  width: 100%;
`;

export const Grid = styled.div`
  display: grid;
  gap: 14px;
  width: 100%;

  grid-template-columns: 1fr;

  @media (min-width: 900px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
`;

export const FullRow = styled.div`
  grid-column: 1 / -1;
  min-width: 0;
`;

export const Cell = styled.div`
  min-width: 0;
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-start;

  ${media.md} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SubmitButton = styled(Button)`
  width: 220px;
  font-size: 16px;

  ${media.md} {
    width: 100%;
  }
`;

export const ErrorBox = styled.div`
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 0, 0, 0.35);
  background: var(--bg-card);
  box-shadow: var(--shadow-soft);
  color: var(--primary-text);
`;

export const ErrorTitle = styled.div`
  font-weight: 700;
  margin-bottom: 6px;
`;

export const ErrorList = styled.ul`
  margin: 0;
  padding-left: 18px;

  li {
    margin: 4px 0;
  }
`;