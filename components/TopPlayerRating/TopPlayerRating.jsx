import { trpc } from "utils/trpc";
import { styled } from "stitches.config";
import { Box } from "components/Atoms";
import Text from "components/Text";

const topRatingAlignStyles = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
};

const TopPlayersPanelStyled = styled("div", {
  border: "solid 2px black",
  backgroundColor: "white",
  margin: "12px",
  borderRadius: "12px",
  width: "200px",
  height: "100px",
});

const TopPlayerRating = () => {
  const { data } = trpc.useQuery(["rating-get", { n: 5 }]);

  return (
    <TopPlayersPanelStyled>
      {data?.map((item, index) => (
        <Box key={index} css={topRatingAlignStyles}>
          <Text margin="noMargin">{item.name}</Text>
          <Text margin="noMargin">{item.rating}</Text>
        </Box>
      ))}
    </TopPlayersPanelStyled>
  );
};

export { TopPlayerRating };
