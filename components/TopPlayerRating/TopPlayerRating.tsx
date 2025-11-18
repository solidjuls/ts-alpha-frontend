import { styled } from "stitches.config";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import { SkeletonPlayers } from "components/Skeletons";
import useFetchInitialData from "hooks/useFetchInitialData";
import { UserType } from "types/user.types";

const SidePanelStyled = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundColor: "$infoForm",
  margin: "0 12px 0 12px",
  padding: "12px",
  borderRadius: "12px",
  width: "240px",
});

const User = ({ name, rating, countryCode }: UserType) => {
  return (
    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <FlagIcon code={countryCode} />
        <Text>{name}</Text>
      </div>
      <Text>{rating}</Text>
    </div>
  );
};

const Announcement = () => {
  return (
    <SidePanelStyled>
      <Text>Next match on action round zero</Text>
    </SidePanelStyled>
  );
};

const TopPlayerRating = () => {
  const { data, isLoading } = useFetchInitialData({ url: "/api/rating?p=1&pso=5" });
  if (!data) return null;

  return (
    <SidePanelStyled>
      <Text
        style={{
          textAlign: "center",
          fontSize: "20px",
          borderBottom: "solid 1px $greyLight",
        }}
        strong="bold"
      >
        Top Players
      </Text>
      {isLoading && <SkeletonPlayers />}
      <div>
        {data.results?.map((item, index) => (
          <User key={index} name={item.name} rating={item.rating} countryCode={item.countryCode} />
        ))}
      </div>
    </SidePanelStyled>
  );
};

export { TopPlayerRating, Announcement };
