import { Box } from "components/Atoms";
import { FlagIcon } from "components/FlagIcon";
import Text from "components/Text";
import { UserType } from "types/user.types";

const topRatingAlignStyles = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
};

const User = ({ name, rating, countryCode }: UserType) => {
  return (
    <Box css={topRatingAlignStyles}>
      <Box css={{ display: "flex", flexDirection: "row" }}>
        <FlagIcon code={countryCode} />
        <Text>{name}</Text>
      </Box>
      <Text>{rating}</Text>
    </Box>
  );
};

export { User };
