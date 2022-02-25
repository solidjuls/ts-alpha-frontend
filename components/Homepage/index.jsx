import { styled } from "stitches.config";
import Image from "next/image";
import { Box } from "components/Atoms";
import Text from "components/Text";

const GAMETYPE_MAXWIDTH = "60px";

const PlayerInfo = styled("div", {
  display: "flex",
  flexDirection: "row",
  borderBottom: "solid 1px $greyLight",
  margin: '8px'
});

const getRatingVariation = (rating) => rating[0].rating - rating[1].rating;

const TriangleIcon = ({ rating }) => {
  const ratingVariation = getRatingVariation(rating);
  if (ratingVariation > 0) {
    return (
      <Image src="/triangleUp.svg" alt="Triangle Up" width={28} height={28} />
    );
  } else if (ratingVariation < 0) {
    return (
      <Image
        src="/triangleDown.svg"
        alt="Triangle Down"
        width={28}
        height={28}
      />
    );
  } else {
    return null;
  }
};

const Rating = ({ rating }) => {
  const ratingVariation = getRatingVariation(rating);
  return (
    <Box css={{ display: "flex", flexDirection: "row" }}>
      <Text margin="noMargin">{rating[0].rating}</Text>
      <Text margin="noMargin">{`(${
        ratingVariation === 0 ? "-" : ratingVariation
      })`}</Text>
    </Box>
  );
};
const RatingBox = ({ ratingsUSA, ratingsUSSR }) => {
  return (
    <Box css={{ display: "flex", flexDirection: "row" }}>
      <Box css={{ display: "flex", flexDirection: "column" }}>
        <Rating rating={ratingsUSA} />
        <Rating rating={ratingsUSSR} />
      </Box>
      <Box css={{ display: "flex", flexDirection: "column" }}>
        <TriangleIcon rating={ratingsUSA} />
        <TriangleIcon rating={ratingsUSSR} />
      </Box>
    </Box>
  );
};
const PlayerInfoBox = ({ nameUSA, nameUSSR, winner }) => {
  return (
    <Box css={{ display: "flex", flexDirection: "column" }}>
      <Text margin="noMargin" variant={winner === "1" ? "strong" : ""}>
        {nameUSA}
      </Text>
      <Text margin="noMargin" variant={winner === "2" ? "strong" : ""}>
        {nameUSSR}
      </Text>
    </Box>
  );
};

const ResultRow = ({ game }) => {
  return (
    <PlayerInfo>
      <Text
        css={{ alignSelf: "center", maxWidth: GAMETYPE_MAXWIDTH }}
        strong="bold"
      >
        {game.gameType}
      </Text>

      <PlayerInfoBox
        nameUSA={game.usaPlayer}
        nameUSSR={game.ussrPlayer}
        winner={game.gameWinner}
      />
      <RatingBox ratingsUSA={game.ratingsUSA} ratingsUSSR={game.ratingsUSSR} />
      <Box css={{ flexDirection: "column" }}>
        <Text strong="bold">End turn</Text>
        <Text>T9</Text>
      </Box>
      <Box css={{ flexDirection: "column" }}>
        <Text strong="bold">End Mode</Text>
        <Text>DEFCON</Text>
      </Box>
      <a href="www.youtube.com" target="_blank">
        Link to Video
      </a>
    </PlayerInfo>
  );
};

const ResultsPanel = styled("div", {
  display: "flex",
  flexDirection: "column",
  backgroundColor: 'white',
  border: "solid 1px none",
  borderRadius: "12px",
  flexGrow: '1'
});
const TopPlayersPanel = styled("div", {
  border: "solid 1px black",
  margin: '12px',
  borderRadius: "12px",
  width: "200px",
  height: "100px",
});

const Homepage = ({ data }) => {
  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        maxWidth: "1000px",
      }}
    >
      <ResultsPanel>
        {data?.map((game, index) => (
          <ResultRow key={index} game={game} />
        ))}
      </ResultsPanel>
      <TopPlayersPanel />
    </Box>
  );
};

export default Homepage;
