import styled from "styled-components";

interface TextProps {
  strong?: "bold";
  fontSize?: "small" | "medium" | "big";
  type?: "error";
}

const Text = styled.p<TextProps>`
  font-weight: ${props => props.strong === "bold" ? "600" : "0"};
  margin: ${props => {
    if (props.fontSize === "small" || props.fontSize === "medium" || props.fontSize === "big") {
      return "0";
    }
    return "4px";
  }};
  font-size: ${props => {
    switch (props.fontSize) {
      case "small":
        return "12px";
      case "medium":
        return "16px";
      case "big":
        return "20px";
      default:
        return "16px";
    }
  }};
  color: ${props => props.type === "error" ? "red" : "inherit"};
`;

export default Text;
