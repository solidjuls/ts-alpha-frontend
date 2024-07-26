import { Box } from "components/Atoms";
import { Backbutton } from "components/Backbutton";

const DetailContainer = ({ children }) => {
  return (
    <Box
      css={{
        backgroundColor: "white",
        padding: "24px",
        width: "100%",
        maxWidth: "52rem",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Backbutton />
      {children}
    </Box>
  );
};

export { DetailContainer };
