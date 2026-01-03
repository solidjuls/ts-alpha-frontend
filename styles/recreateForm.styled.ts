import styled from "styled-components";
import { media } from "theme";
import { ResultsStyleWrapper } from "components/Schedule/Schedule.styled";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
`;

export const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  ${media.md} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Title = styled.h2`
  margin: 0;
  color: var(--primary-text);
`;


export const ContentWrapper = styled(ResultsStyleWrapper)`
  max-width: 1000px;
  margin-bottom: 0;
`;

export const LoadingArea = styled.div`
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ErrorBox = styled.div`
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg-card);
  color: var(--primary-text);
  box-shadow: var(--shadow-soft);
`;

export const ErrorTitle = styled.div`
  font-weight: 700;
  margin-bottom: 6px;
`;

export const ErrorMessage = styled.div`
  opacity: 0.9;
`;