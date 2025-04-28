import { Box } from "components/Atoms";
import { Backbutton } from "components/Backbutton";
import { ReactNode } from "react";

type DetailContainerProps = {
  children: ReactNode;
  backButton?: boolean;
};
const DetailContainer: React.FC<DetailContainerProps> = ({ children, backButton = true }) => {
  return (
    <Box
      css={{
        backgroundColor: "white",
        padding: "24px",
        width: "100%",
        maxWidth: "52rem",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        borderRadius: "8px",
        marginBottom: "16px",
      }}
    >
      {backButton && <Backbutton />}
      {children}
    </Box>
  );
};

export { DetailContainer };
