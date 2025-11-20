import { Backbutton } from "components/Backbutton";
import { ReactNode } from "react";
import { StyledDetailContainer } from "./DetailContainer.styled";

type DetailContainerProps = {
  children: ReactNode;
  backButton?: boolean;
};
const DetailContainer: React.FC<DetailContainerProps> = ({ children, backButton = true }) => {
  return (
    <StyledDetailContainer>
      {backButton && <Backbutton />}
      {children}
    </StyledDetailContainer>
  );
};

export { DetailContainer };
