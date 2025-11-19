import Link from "next/link";
import styled from "styled-components";

export const GlobalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const borderStyle = "solid 1px #e5e7eb";

export const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  /* border-bottom: ${borderStyle}; */
  padding: 4px;
  margin: 4px;
  border-width: 1px;
  border-radius: 6px;
  border: solid 1px #e5e7eb;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

export const StyledCardRow = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: min-content 3fr 2fr min-content;
  padding-inline-start: 8px;
  padding-inline-end: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-width: 1px;
  border-radius: 6px;
  border: solid 1px #e5e7eb;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

export const StyledResultsPanel = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  border: solid 1px transparent;
  border-radius: 12px;
  flex-grow: 1;
  margin-bottom: 12px;
  min-height: 600px;
`;

export const FilterPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  width: 100%;
  max-width: 1000px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 8px;
  margin: 0 0 8px 0;
  border-bottom: ${borderStyle};

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const UnstyledLink = styled(Link)`
  all: unset; /* Unset all styles */
  display: inline; /* Reset to inline display */
  cursor: pointer; /* Set cursor to pointer */
`;
