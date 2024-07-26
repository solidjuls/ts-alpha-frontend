import Link from "next/link";
import { Box } from "components/Atoms";
import Text from "components/Text";

const sidebarItemStyles = {
  borderTop: "solid 1px rgba(255,255,255,.15)",
  backgroundColor: "#24292f",
  color: "white",
  cursor: "pointer",
  padding: "8px 16px",
  margin: 0,
};

const horizontalItemStyles = {
  borderTop: "solid 1px rgba(255,255,255,.15)",
  backgroundColor: "#24292f",
  cursor: "pointer",
  color: "white",
  padding: "8px 16px",
  margin: 0,
};

const Items = ({ styles }: any) => {
  return (
    <>
      <Link href="/" passHref>
        <Text css={styles}>Home Page</Text>
      </Link>
      <Link href="/players" passHref>
        <Text css={styles}>Player List</Text>
      </Link>
      {/* <Text css={styles}>Federations</Text> */}
      <Link href="/submitform" passHref>
        <Text css={styles}>Submit Form</Text>
      </Link>
    </>
  );
};
const HorizontalNavigation = () => {
  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#24292f",
        width: "100%",
      }}
    >
      <Items styles={horizontalItemStyles} />
    </Box>
  );
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
        <Items styles={sidebarItemStyles} />
      </Box>
    </Box>
  );
};

export { Sidebar, HorizontalNavigation };
