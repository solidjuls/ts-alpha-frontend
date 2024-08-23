import { trpc } from "utils/trpc";
import { styled } from "stitches.config";
import { Box } from "components/Atoms";
import Text from "components/Text";
import { User } from "components/User";
import { SkeletonPlayers } from "components/Skeletons";

const SidePanelStyled = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundColor: "$infoForm",
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
  // @ts-ignore
  const { data, isLoading } = trpc.useQuery(["rating-get", { n: 5 }]);

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
      {isLoading && <SkeletonPlayers />}
      <Box>
        {data?.map((item, index) => (
          <User key={index} name={item.name} rating={item.rating} countryCode={item.countryCode} />
        ))}
      </Box>
    </SidePanelStyled>
  );
};

export { TopPlayerRating, Announcement };
