import styled from "styled-components";

export const Title = styled.span`
  font-weight: 600;
  text-decoration: underline;
`;

export const FileInput = styled.input`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  color: ${props => props.theme.colors.textDark};

  &::file-selector-button {
    padding: 6px 12px;
    border: none;
    background-color: #f0f0f0;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    margin-right: 12px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #e0e0e0;
    }
  }
`;