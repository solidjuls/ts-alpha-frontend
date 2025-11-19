import styled from "styled-components";
import Link from "next/link";

export const ResultsStyleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.infoForm};
  border: solid 1px none;
  border-radius: 12px;
  flex-grow: 1;
  margin-bottom: 12px;
  width: 100%;
  max-width: 1000px;
  min-height: 600px;
`;

interface PlayerInfoProps {
  status?: "played" | "default" | "firstAlert" | "secondAlert" | "duedate";
}

export const PlayerInfo = styled.div<PlayerInfoProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 4px;
  margin: 4px;
  border-width: 1px;
  border-radius: 6px;
  border: solid 1px ${props => props.theme.colors.greyLight};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  background-color: ${props => {
    switch (props.status) {
      case "played":
        return "rgba(0, 128, 0, 0.4)";
      case "firstAlert":
        return "rgba(255, 165, 0, 0.45)";
      case "secondAlert":
        return "rgba(255, 165, 0, 0.85)";
      case "duedate":
        return "rgba(255, 0, 0, 0.4)";
      case "default":
      default:
        return "white";
    }
  }};
`;

export const CheckOpponentProfileCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  color: red;
  font-weight: 600;
  padding: 4px;
  margin: 4px;
  border-width: 1px;
  border-radius: 6px;
  border: solid 1px ${props => props.theme.colors.greyLight};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  @media (max-width: 600px) {
    display: none;
  }
`;

export const DueDateCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4px;
  margin: 4px;
  border-width: 1px;
  border-radius: 6px;
  border: solid 1px ${props => props.theme.colors.greyLight};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  @media (max-width: 600px) {
    display: none;
  }
`;

export const UnstyledLink = styled(Link)`
  all: unset; /* Unset all styles */
  display: inline; /* Reset to inline display */
  cursor: pointer; /* Set cursor to pointer */
`;