import styled from "styled-components";

interface TextAreaProps {
  $margin?: 'xxl' | 'url' | 'login';
  $border?: 'dropdown' | 'error';
  $filter?: 'filter';
}

export const TextArea = styled.textarea<TextAreaProps>`
  all: unset;
  display: inline-flex;
  align-items: flex-start;
  justify-content: flex-start;
  border-radius: 4px;
  padding: 8px 10px;
  min-height: 60px;
  font-size: 15px;
  line-height: 1.4;
  border: 1px solid #ced4da;
  color: black;
  resize: vertical; /* allows resizing vertically only */

  &:focus {
    outline: none;
    /* box-shadow: 0 0 0 2px #ced4da; */
  }

  /* Margin variants */
  ${props => {
    switch (props.$margin) {
      case 'xxl':
        return 'margin: 64px;';
      case 'url':
        return 'margin: 0 0 24px 0;';
      case 'login':
        return 'margin: 0 0 12px 0;';
      default:
        return '';
    }
  }}

  /* Border variants */
  ${props => {
    switch (props.$border) {
      case 'dropdown':
        return `
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        `;
      case 'error':
        return `
          border: solid 1px red;
          box-shadow: none;

          &:focus {
            box-shadow: 0 0 0 2px red;
          }
        `;
      default:
        return '';
    }
  }}

  /* Filter variants */
  ${props => {
    if (props.$filter === 'filter') {
      return 'min-height: 80px;';
    }
    return '';
  }}
`;
