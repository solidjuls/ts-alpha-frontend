import styled from "styled-components";

/* Styled link-like button */
export const SignOutButton = styled.button`
  all: unset;
  cursor: pointer;
  color: var(--alt-text);
  font-weight: 600;

  /* Explicitly remove underline */
  text-decoration: none;

  &:hover,
  &:focus,
  &:active {
    color: var(--ussr);
    text-decoration: none;
  }
`;