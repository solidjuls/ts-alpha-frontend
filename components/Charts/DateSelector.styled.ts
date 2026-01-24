import styled, { css } from "styled-components";
import { Flex } from "components/Atoms";
import { Button } from "components/Button";
import { media } from "theme";

export const DateSelectorBar = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
`;

export const DateButtons = styled(Flex)`
  gap: 8px;
  flex-wrap: wrap;

  ${media.md} {
    width: 100%;
  }
`;

export const RangeButton = styled(Button)<{ $active: boolean }>`
  padding: 6px 10px;
  margin: 0;
  font-size: 12px;

  ${media.md} {
    flex: 1;
  }

  ${({ $active }) =>
    $active &&
    css`
      background-color: var(--usa);
      color: var(--alt-text);
      border-color: var(--usa);

      &:hover:not(:disabled) {
        /* keep your global hover language (tension moment = USSR) */
        background-color: var(--ussr);
        border-color: var(--ussr);
        color: var(--alt-text);
      }
    `}
`;
