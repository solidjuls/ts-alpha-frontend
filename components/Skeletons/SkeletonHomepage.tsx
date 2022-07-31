import { styled } from "stitches.config";
import { Box } from "components/Atoms";

const Body = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  margin: "8px 16px",
});

const BodyRow = styled("div", {
  borderRadius: "2px",
  height: "12px",
  marginBottom: "8px",
  width: "100%",
  backgroundColor: "$skeletonColorPrimary",
});

const SkeletonPlayers = () => (
  <>
    <Body>
      <BodyRow />
      <BodyRow />
      <BodyRow />
      <BodyRow />
      <BodyRow />
    </Body>
  </>
);
const SkeletonHomepage = () => (
  <>
    <Body>
      <BodyRow />
      <BodyRow />
    </Body>
    <Body>
      <BodyRow />
      <BodyRow />
    </Body>
    <Body>
      <BodyRow />
      <BodyRow />
    </Body>
    <Body>
      <BodyRow />
      <BodyRow />
    </Body>
    <Body>
      <BodyRow />
      <BodyRow />
    </Body>
  </>
);

export { SkeletonHomepage, SkeletonPlayers };
