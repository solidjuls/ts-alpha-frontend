import { Box } from "components/Atoms";

const sidebarItemStyles = {
  borderTop: "solid 1px rgba(255,255,255,.15)",
  backgroundColor: "#24292f",
  color: "white",
  padding: "8px 16px",
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
        <Box css={{ ...sidebarItemStyles }}>Home Page</Box>
        <Box css={{ ...sidebarItemStyles }}>Profile</Box>
        <Box css={{ ...sidebarItemStyles }}>Submit Form</Box>
      </Box>
    </Box>
  );
};

export { Sidebar };
