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

export const PageBox = styled(Box)`
  display: flex;
  alignItems: center;
  padding: 8px;
`;