import styled from 'styled-components';

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  text-align: center;
`;

export const ErrorTitle = styled.h2`
  color: #e74c3c;
  margin-bottom: 16px;
`;

export const ErrorMessage = styled.p`
  color: #666;
  margin-bottom: 24px;
`;
