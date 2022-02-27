import { useState } from "react";
import { styled } from "stitches.config";
import Image from "next/image";
import { trpc } from "utils/trpc";
import { Box } from "components/Atoms";
import Text from "components/Text";
import { DayMonthInput } from "components/Input";

const GAMETYPE_WIDTH = "60px";
const TRIANGLE_WIDTH = "20px";
const borderStyle = "solid 1px $greyLight";
const PlayerInfo = styled("div", {
  display: "flex",
  flexDirection: "row",
  borderBottom: borderStyle,
  margin: "4px",
});

const getRatingVariation = (rating) => {
  if (!rating[0] || !rating[1]) return 0;

  return rating[0].rating - rating[1].rating;
};

const TriangleIcon = ({ rating }) => {
  const ratingVariation = getRatingVariation(rating);
  if (ratingVariation > 0) {
    return (
      <Image
        src="/triangleUp.svg"
        alt="Triangle Up"
        width={TRIANGLE_WIDTH}
        height={TRIANGLE_WIDTH}
      />
    );
  } else if (ratingVariation < 0) {
    return (
      <Image
        src="/triangleDown.svg"
        alt="Triangle Down"
        width={TRIANGLE_WIDTH}
        height={TRIANGLE_WIDTH}
      />
    );
  } else {
    return null;
  }
};

const boxStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "8px",
  borderRight: borderStyle,
  justifyContent: "center",
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
      <Box css={boxStyle}>
        <Rating rating={ratingsUSA} />
        <Rating rating={ratingsUSSR} />
      </Box>
      <Box css={boxStyle}>
        <TriangleIcon rating={ratingsUSA} />
        <TriangleIcon rating={ratingsUSSR} />
      </Box>
    </Box>
  );
};
const PlayerInfoBox = ({ nameUSA, nameUSSR, winner }) => {
  return (
    <Box css={{ ...boxStyle, width: "300px" }}>
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
      <Text css={{ alignSelf: "center", width: GAMETYPE_WIDTH }} strong="bold">
        {game.gameType}
      </Text>

      <PlayerInfoBox
        nameUSA={game.usaPlayer}
        nameUSSR={game.ussrPlayer}
        winner={game.gameWinner}
      />
      <RatingBox ratingsUSA={game.ratingsUSA} ratingsUSSR={game.ratingsUSSR} />
      <Box css={boxStyle}>
        <Text strong="bold">End turn</Text>
        <Text>T9</Text>
      </Box>
      <Box css={boxStyle}>
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
  backgroundColor: "white",
  border: "solid 1px none",
  borderRadius: "12px",
  flexGrow: "1",
});
const TopPlayersPanel = styled("div", {
  border: "solid 1px black",
  margin: "12px",
  borderRadius: "12px",
  width: "200px",
  height: "100px",
});

const FilterPanel = styled("div", {
  padding: "8px",
  margin: "8px",
  borderBottom: borderStyle,
});

const formatDateToString = (date) => `${date.getDate()}/${date.getMonth() + 1}`;

const Homepage = () => {
  const [dateValue, setDateValue] = useState(new Date());
  const { data } = trpc.useQuery([
    "game-getAll"]);
  const onClickDay = (clickedItem) => {
    // get current value

    if (clickedItem === "left") {
      dateValue.setDate(dateValue.getDate() - 1);
    } else if (clickedItem === "right") {
      dateValue.setDate(dateValue.getDate() + 1);
    }

    setDateValue(new Date(dateValue));
    // fetch data with updated value
  };

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
        <FilterPanel>
          <DayMonthInput
            value={formatDateToString(dateValue)}
            onClick={onClickDay}
          />
        </FilterPanel>
        {data?.map((game, index) => (
          <ResultRow key={index} game={game} />
        ))}
      </ResultsPanel>
      <TopPlayersPanel />
    </Box>
  );
};

export default Homepage;
