import styled from "styled-components";

export const ProfileContainer = styled.div`
  display: grid;
  gap: 0.25rem;
  max-width: 48rem;
  grid-template-columns: 1fr 2fr;
  background-color: var(--bg-card);
  padding: 24px 0 24px 24px;
  align-items: left;
  border: solid 1px var(--border);
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: 100%;
`;

export const RecentGamesContainer = styled.div`
  display: flex;
  width: 100%;
  border-radius: 0;
  margin: 32px 0 0 0;
  flex-direction: column;
`;