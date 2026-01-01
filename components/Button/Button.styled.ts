import styled from "styled-components";

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 12px;
  margin: 4px;

  cursor: pointer;
  border-radius: 8px;
  box-sizing: border-box;

  font-weight: 600;
  text-align: center;
  text-decoration: none;

  color: var(--primary-text);
  background-color: var(--bg-cards);
  border: 1px solid var(--border);

  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover:not(:disabled) {
    color: var(--alt-text);
    background-color: var(--ussr);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  }

  &:focus-visible {
    outline: 2px solid var(--usa);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
    box-shadow: none;
  }
`;
