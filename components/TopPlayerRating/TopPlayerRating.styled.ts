import styled from "styled-components";
import { media } from "../../theme";

export const SidePanelStyled = styled.div`
  color: var(--primary-text);
  display: flex;
  flex-direction: column;
  background-color: var(--bg-card);
  margin: 0 12px 0 12px;
  padding: 8px;
  border: solid 1px var(--border);
  border-radius: 12px;
  width: 350px;
  max-height: 225px;

  ${media.md} {
    width: 100%;
  }
`;

export const UserContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const PlayersContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TitleText = styled.h3`
  text-align: center;
  border-bottom: solid 1px var(--divider);
  margin-top: 0px;
  padding-bottom: 8px;
  margin-bottom: 12px;
`;

export const NumericText = styled.span`
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
`;