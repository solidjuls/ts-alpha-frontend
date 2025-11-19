import styled from "styled-components";

export const Input = styled.input`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0 10px;
  height: ${props => props.filter === "filter" ? "40px" : "35px"};
  font-size: 15px;
  line-height: 1;
  border: ${props => props.border === "error" ? "solid 1px red" : "1px solid #ced4da"};
  color: black;

  margin: ${props => {
    switch (props.margin) {
      case "xxl":
        return "64px";
      case "url":
        return "0 0 24px 0";
      case "login":
        return "0 0 12px 0";
      default:
        return "0";
    }
  }};

  ${props => props.border === "dropdown" && `
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  `}

  ${props => props.border === "error" && `
    box-shadow: none;
    &:focus {
      box-shadow: 0 0 0 2px red;
    }
  `}

  &:focus {
    /* box-shadow: 0 0 0 2px #ced4da; */
  }
`;
