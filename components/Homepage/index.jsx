import { useState, useEffect } from "react";
import { styled } from "stitches.config";
import Image from "next/image";
import { trpc } from "utils/trpc";
import { Box, A } from "components/Atoms";
import Text from "components/Text";
import { DayMonthInput } from "components/Input";
import { TopPlayerRating } from "components/TopPlayerRating";
import { dateAddDay } from "utils/dates";
import { SkeletonHomepage } from "components/Skeletons";

const GAMETYPE_WIDTH = "60px";
const ENDMODE_WIDTH = "140px";
const TRIANGLE_WIDTH = "16px";
const borderStyle = "solid 1px $greyLight";
const PlayerInfo = styled("div", {
  display: "flex",
  flexDirection: "row",
  borderBottom: borderStyle,
  margin: "4px",
});

const responsive = {
  "@sm": {
    display: "none",
  },
};

const boxStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "8px",
  borderRight: borderStyle,
  justifyContent: "center",
};

const Rating = ({ rating, ratingDifference }) => {
  return (
    <Box css={{ display: "flex", flexDirection: "row", width: "86px" }}>
      <Text>{rating}</Text>
      <Text>{`(${ratingDifference})`}</Text>
    </Box>
  );
};

const RatingBox = ({ ratingsUSA, ratingsUSSR }) => {
  return (
    <Box css={{ display: "flex", flexDirection: "row" }}>
      <Box css={boxStyle}>
        <Rating
          rating={ratingsUSA.rating}
          ratingDifference={ratingsUSA.ratingDifference}
        />
        <Rating
          rating={ratingsUSSR.rating}
          ratingDifference={ratingsUSSR.ratingDifference}
        />
      </Box>
    </Box>
  );
};

const FlagIcon = ({ code, icon }) => {
  if (code === "CAT") {
    return (
      <Box css={{ marginLeft: "4px", marginRight: "4px" }}>
        <Image
          src="/estelada_blava.png"
          alt="Catalonia"
          width={TRIANGLE_WIDTH}
          height={TRIANGLE_WIDTH}
        />
      </Box>
    );
  }

  return <Text>{icon}</Text>;
};
const PlayerInfoBox = ({
  nameUSA,
  nameUSSR,
  winner,
  usaCountryCode,
  usaCountryIcon,
  ussrCountryCode,
  ussrCountryIcon,
}) => {
  return (
    <Box
      css={{
        ...boxStyle,
        width: "260px",
        "@sm": {
          width: "100%",
        },
      }}
    >
      <Box css={{ display: "flex", flexDirection: "row", alignItems: "end" }}>
        <FlagIcon code={usaCountryCode} icon={usaCountryIcon} />
        <Text strong={winner === "1" ? "bold" : ""}>{nameUSA}</Text>
      </Box>
      <Box css={{ display: "flex", flexDirection: "row" }}>
        <FlagIcon code={ussrCountryCode} icon={ussrCountryIcon} />
        <Text strong={winner === "2" ? "bold" : ""}>{nameUSSR}</Text>
      </Box>
    </Box>
  );
};

const getWinnerText = (gameWinner) => {
  if (gameWinner === "1") {
    return "USA";
  } else if (gameWinner == "2") {
    return "USSR";
  }
  return "TIE";
};
const ResultRow = ({ game }) => {
  return (
    <PlayerInfo>
      <Text
        css={{ alignSelf: "center", width: GAMETYPE_WIDTH, ...responsive }}
        strong="bold"
      >
        {game.gameType}
      </Text>

      <PlayerInfoBox
        usaCountryIcon={game.usaCountryIcon}
        usaCountryCode={game.usaCountryCode}
        ussrCountryIcon={game.ussrCountryIcon}
        ussrCountryCode={game.ussrCountryCode}
        nameUSA={game.usaPlayer}
        nameUSSR={game.ussrPlayer}
        winner={game.gameWinner}
      />
      <RatingBox ratingsUSA={game.ratingsUSA} ratingsUSSR={game.ratingsUSSR} />
      <Box css={{ ...boxStyle, ...responsive }}>
        <Text strong="bold">Winner</Text>
        <Text css={{ textAlign: "center" }}>
          {getWinnerText(game.gameWinner)}
        </Text>
      </Box>
      <Box css={{ ...boxStyle, ...responsive }}>
        <Text strong="bold">End turn</Text>
        <Text>{`T${game.endTurn}`}</Text>
      </Box>
      <Box css={{ ...boxStyle, ...responsive, width: ENDMODE_WIDTH }}>
        <Text strong="bold">End Mode</Text>
        <Text>{game.endMode}</Text>
      </Box>
      <A
        css={{
          ...boxStyle,
          ...responsive,
          borderRight: "none",
          marginLeft: "20px",
        }}
        href="//youtube.com"
        target="_blank"
      >
        Link to Video
      </A>
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
  marginBottom: "12px",
});

const FilterPanel = styled("div", {
  padding: "8px",
  margin: "8px",
  borderBottom: borderStyle,
});

const formatDateToString = (date) => `${date.getDate()}/${date.getMonth() + 1}`;

const EmptyState = () => {
  return (
    <Box
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "16px",
        height: "320px",
      }}
    >
      <Text css={{ fontSize: "20px" }} strong="bold">
        No games
      </Text>
    </Box>
  );
};

const Homepage = () => {
  const [dateValue, setDateValue] = useState(new Date());
  const { data, isLoading } = trpc.useQuery([
    "game-getAll",
    { d: dateValue.toDateString() },
  ]);

  console.log("rerender");
  const onClickDay = (clickedItem) => {
    let newDate;
    if (clickedItem === "left") {
      newDate = dateAddDay(dateValue, -1);
    } else if (clickedItem === "right") {
      newDate = dateAddDay(dateValue, 1);
    }

    setDateValue(newDate);
  };

  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        maxWidth: "1100px",
        flexWrap: "wrap",
      }}
    >
      <ResultsPanel>
        <FilterPanel>
          <DayMonthInput
            value={formatDateToString(dateValue)}
            onClick={onClickDay}
          />
        </FilterPanel>
        {isLoading && <SkeletonHomepage />}
        {data?.length === 0 && <EmptyState />}
        {data?.map((game, index) => (
          <ResultRow key={index} game={game} />
        ))}
      </ResultsPanel>
      <Box>
        <TopPlayerRating />
      </Box>
    </Box>
  );
};

export default Homepage;
