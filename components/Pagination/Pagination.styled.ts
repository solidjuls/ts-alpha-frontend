import styled from "styled-components";
import { Button } from "components/Button";
import { Box } from "components/Atoms";
import { media } from "../../theme";

export const PageButton = styled(Button)`
  width: 80px;

  ${media.md} {
    display: none;
  }
`;

export const IconButton = styled(Button)`
  /* Desktop / tablet: behave exactly like Button */

  ${media.md} {
    && {
      width: 32px;
      height: 32px;

      min-width: 32px;   /* override any implicit min width */
      padding: 0;        /* remove horizontal padding */
      margin: 4px;       /* keep spacing consistent with Button */

      display: flex;
      align-items: center;
      justify-content: center;
    }

    svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
  }
`;

export const PageBox = styled(Box)`
  display: flex;
  align-items: center; 
  gap: 8px;            
  padding: 8px;
`;

export const PageInput = styled.input`
  width: 56px;
  height: 32px;
  padding: 0 10px;

  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--primary-text);

  text-align: center;
  font-weight: 600;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.12);
  }

  &:disabled {
    opacity: 0.6;
  }
`;