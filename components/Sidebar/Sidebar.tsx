import { Box } from "components/Atoms";
import Text from "components/Text"

const sidebarItemStyles = {
  borderTop: "solid 1px rgba(255,255,255,.15)",
  backgroundColor: "#24292f",
  color: "white",
  padding: "8px 16px",
  margin: 0
};

const Sidebar = () => {
  return (
    <Box css={{ position: "relative" }}>
      <Box
        css={{
          width: "100%",
          backgroundColor: "white",
          border: "solid 1px black",
        }}
      >
        <Text css={{ ...sidebarItemStyles }}>Home Page</Text>
        <Text css={{ ...sidebarItemStyles }}>Profile</Text>
        <Text css={{ ...sidebarItemStyles }}>Submit Form</Text>
      </Box>
    </Box>
  );
};

export { Sidebar };
