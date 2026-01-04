import styled from "styled-components";
import { media } from "theme";

export const StyledDetailContainer = styled.div`
  background-color: var(--bg-card);
  color: var(--primary-text);
  padding: 24px 12px;
  width: 100%;
  max-width: 52rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);

  ${media.sm} {
    /* Remove the Card */
    background-color: transparent;
    box-shadow: none;

    max-width: none;
    padding: 0;

    /* ensure children can grow */
    width: 100%;
  }
`;

