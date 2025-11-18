import styled from "styled-components";

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  box-sizing: border-box;
  text-decoration: none;
  margin: 4px;
  font-weight: 600;
  color: black;
  background-color: var(--gray-200);
  border: solid 1px var(--gray-300);
  text-align: center;
  transition: all 0.2s;
  outline: none;
`;

export { Button };
