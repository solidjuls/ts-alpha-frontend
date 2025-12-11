import styled from "styled-components";
import Text from "components/Text";

export const SidePanelStyled = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  margin: 0 12px 0 12px;
  padding: 12px;
  border-radius: 12px;
  width: 350px;
  max-height: 270px;
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

export const TitleText = styled(Text)`
  text-align: center;
  font-size: 20px;
  border-bottom: solid 1px #e5e7eb;
  padding-bottom: 8px;
  margin-bottom: 12px;
`;
