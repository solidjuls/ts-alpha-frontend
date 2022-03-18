import { useState } from "react";
import { styled } from "stitches.config";
import { trpc } from "utils/trpc";
import { FlagIcon } from "components/FlagIcon";
import { Box, A } from "components/Atoms";
import Text from "components/Text";
import { DayMonthInput, DayMonthInputClickType } from "components/Input";
import { TopPlayerRating } from "components/TopPlayerRating";
import { dateAddDay } from "utils/dates";
import { SkeletonHomepage } from "components/Skeletons";
import { Game, GameWinner, GameRating } from "types/game.types";

const GAMETYPE_WIDTH = "60px";
const ENDMODE_WIDTH = "140px";

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

const Rating = ({ rating, ratingDifference }: GameRating) => {
  return (
    <Box css={{ display: "flex", flexDirection: "row", width: "86px" }}>
      <Text>{rating}</Text>
      <Text>{`(${ratingDifference})`}</Text>
    </Box>
  );
};

const RatingBox = ({
  ratingsUSA,
  ratingsUSSR,
}: {
  ratingsUSA: GameRating;
  ratingsUSSR: GameRating;
}) => {
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

const PlayerInfoBox = ({
  nameUSA,
  nameUSSR,
  winner,
  usaCountryCode,
  ussrCountryCode,
}: {
  nameUSA: string;
  nameUSSR: string;
  winner: string;
  usaCountryCode: string;
  ussrCountryCode: string;
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
      <Box css={{ display: "flex", flexDirection: "row", lineHeight: 1 }}>
        <FlagIcon code={usaCountryCode} />
        <Text strong={winner === "1" ? "bold" : undefined}>{nameUSA}</Text>
      </Box>
      <Box css={{ display: "flex", flexDirection: "row", lineHeight: 1 }}>
        <FlagIcon code={ussrCountryCode} />
        <Text strong={winner === "2" ? "bold" : undefined}>{nameUSSR}</Text>
      </Box>
    </Box>
  );
};

const getWinnerText = (gameWinner: GameWinner) => {
  if (gameWinner === "1") {
    return "USA";
  } else if (gameWinner == "2") {
    return "USSR";
  }
  return "TIE";
};
const ResultRow = ({ game }: { game: Game }) => {
  return (
    <PlayerInfo>
      <Text
        css={{ alignSelf: "center", width: GAMETYPE_WIDTH, ...responsive }}
        strong="bold"
      >
        {game.gameType}
      </Text>

      <PlayerInfoBox
        usaCountryCode={game.usaCountryCode}
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
  backgroundColor: "$infoForm",
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

const formatDateToString = (date: Date) =>
  `${date.getDate()}/${date.getMonth() + 1}`;

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

  const onClickDay = (clickedItem: DayMonthInputClickType) => {
    let newDate: Date = new Date();
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