import { useState, useRef } from "react";
import axios from "axios";
import { styled } from "stitches.config";
import { Box } from "components/Atoms";
import Text from "components/Text";
import { User } from "components/User";
import { SkeletonPlayers } from "components/Skeletons";
import { useEffect } from "react";

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
  // const { data, isLoading } = trpc.useQuery(["rating-get", { n: 5 }]);
  const isMounted = useRef(false);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      axios
        .get("/api/rating?n=5")
        .then((resp) => setData(resp.data))
        .finally(() => setIsLoading(false));
      setIsLoading(true);
    }
  }, [isLoading, setData]);

  if (!data) return null;

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
      {/* {isLoading && <SkeletonPlayers />} */}
      <Box>
        {data?.map((item, index) => (
          <User key={index} name={item.name} rating={item.rating} countryCode={item.countryCode} />
        ))}
      </Box>
    </SidePanelStyled>
  );
};

export { TopPlayerRating, Announcement };
