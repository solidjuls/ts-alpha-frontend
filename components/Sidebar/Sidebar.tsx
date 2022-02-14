import stitches from "stitches.config";

const Box = stitches.styled("div");

const sidebarItemStyles = { 
  border: "solid 1px black",
  padding: '4px'
}

const Sidebar = () => {
  return (
    <Box css={{ position: "relative" }}>
      <Box
        css={{
          width: "100%",
          backgroundColor: "white",
          border: "solid 1px black"
        }}
      >
        <Box css={{...sidebarItemStyles}}>item 1</Box>
        <Box css={{...sidebarItemStyles}}>item 1</Box>
        <Box css={{...sidebarItemStyles}}>item 1</Box>
      </Box>
    </Box>
  );
};

export { Sidebar };
