import styled from "styled-components";
import { Flex } from "components/Atoms";

export const Title = styled.h3`
  margin-top: 0;
`;

export const FileInput = styled.input`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid var(--border);
  font-size: 14px;
  color: var(--primary-text);
  background-color: var(--bg-main);

  &::file-selector-button {
    padding: 6px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    margin-right: 12px;
    color: var(--primary-text);
    background-color: var(--bg-card);
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--ussr);
      transform: translateY(-2px);
      color: var(--alt-text);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    }
  
    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
    }
`;

export const AdminContainer = styled(Flex)`
  flex-direction: column;
  background-color: var(--bg-card);
`;

export const FileContainer = styled(Flex)`
   margin: 8px 0 8px 0;
`;