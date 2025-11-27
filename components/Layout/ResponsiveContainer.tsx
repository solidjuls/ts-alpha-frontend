import { styled } from "styled-components";

export const ResponsiveContainer = styled.div`
  width: 100%;
  overflow-x: auto;

  @media (max-width: 640px) {
    overflow-x: scroll;
  }
`;
