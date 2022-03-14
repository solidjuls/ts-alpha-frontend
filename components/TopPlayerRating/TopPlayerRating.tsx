import { trpc } from "utils/trpc";
import { styled } from "stitches.config";
import { Box } from "components/Atoms";
import Text from "components/Text";

const topRatingAlignStyles = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
};

const SidePanelStyled = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundColor: "white",
  margin: "0 12px 0 12px",
  padding: "12px",
  borderRadius: "12px",
  width: "240px",
  height: "190px",
});

const Announcement = () => {
  return (
    <SidePanelStyled>
      <Text>Next match on action round zero</Text>
    </SidePanelStyled>
  );
};

const TopPlayerRating = () => {
  const { data } = trpc.useQuery(["rating-get", { n: 5 }]);

  return (
    <SidePanelStyled>
      <Text
        css={{
          textAlign: "center",
          fontSize: "20px",
          borderBottom: "solid 1px $greyLight",
        }}
        strong="bold"
      >
        Top Players
      </Text>
      <Box>
        {data?.map((item, index) => (
          <Box key={index} css={topRatingAlignStyles}>
            <Text>{item.name}</Text>
            <Text>{item.rating}</Text>
          </Box>
        ))}
      </Box>
    </SidePanelStyled>
  );
};

export { TopPlayerRating, Announcement };
