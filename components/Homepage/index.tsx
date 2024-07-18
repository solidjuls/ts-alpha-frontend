import { useState } from "react";
import { styled } from "stitches.config";
import { trpc } from "contexts/APIProvider";
import { FlagIcon } from "components/FlagIcon";
import { Box, A } from "components/Atoms";
import Text from "components/Text";
import { DayMonthInput } from "components/Input";
import { TopPlayerRating } from "components/TopPlayerRating";
import { dateAddDay } from "utils/dates";
import { SkeletonHomepage } from "components/Skeletons";
import { Game, GameRating } from "types/game.types";
import { getWinnerText } from "utils/games";
import { GAME_QUERY } from "utils/constants";
import Link from "next/link";

type HomepageProps = {
  role: number;
};

const GAMETYPE_WIDTH = "60px";
const ENDMODE_WIDTH = "140px";

const borderStyle = "solid 1px $greyLight";
const PlayerInfo = styled("div", {
  display: "flex",
  flexDirection: "column",
  borderBottom: borderStyle,
  margin: "4px",
});

const ResultsPanel = styled("div", {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "$infoForm",
  border: "solid 1px none",
  borderRadius: "12px",
  flexGrow: "1",
  marginBottom: "12px",
  height: "500px",
  overflowY: "scroll",
});

const FilterPanel = styled("div", {
  padding: "8px",
  margin: "8px",
  borderBottom: borderStyle,
});

const TextSmall = styled("span", {});

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

const Rating = ({ rating, ratingDifference }: Pick<GameRating, "rating" | "ratingDifference">) => {
  return (
    <Box css={{ display: "flex", flexDirection: "row", width: "86px" }}>
      <Text>{rating}</Text>
      <Text>{`(${ratingDifference})`}</Text>
    </Box>
  );
};

const RatingBox = ({ ratingsUSA, ratingsUSSR }: Pick<Game, "ratingsUSA" | "ratingsUSSR">) => {
  return (
    <Box css={{ display: "flex", flexDirection: "row" }}>
      <Box css={boxStyle}>
        <Rating rating={ratingsUSA.rating} ratingDifference={ratingsUSA.ratingDifference} />
        <Rating rating={ratingsUSSR.rating} ratingDifference={ratingsUSSR.ratingDifference} />
      </Box>
    </Box>
  );
};

const PlayerInfoBox = ({
  usaPlayer,
  ussrPlayer,
  gameWinner,
  usaCountryCode,
  ussrCountryCode,
}: Pick<
  Game,
  "usaPlayer" | "ussrPlayer" | "gameWinner" | "usaCountryCode" | "ussrCountryCode"
>) => {
  return (
    <Box css={{ display: "flex", flexDirection: "row" }}>
      <Box
        css={{
          display: "flex",
          margin: "0 8px 0 8px",
          flexDirection: "row",
          lineHeight: 1,
          alignItems: "center",
        }}
      >
        <FlagIcon code={usaCountryCode} />
        <Text strong={gameWinner === "1" ? "bold" : undefined}>{usaPlayer}</Text>
      </Box>
      <span>vs</span>
      <Box
        css={{
          display: "flex",
          margin: "0 8px 0 8px",
          flexDirection: "row",
          lineHeight: 1,
          alignItems: "center",
        }}
      >
        <FlagIcon code={ussrCountryCode} />
        <Text strong={gameWinner === "2" ? "bold" : undefined}>{ussrPlayer}</Text>
      </Box>
    </Box>
  );
};

const getGameType = (game: Game, role: number) => {
  if (role === 2) return `${game.gameType} (${game.id})`;

  return game.gameType;
};
{
  /* <RatingBox ratingsUSA={game.ratingsUSA} ratingsUSSR={game.ratingsUSSR} />
      <Box css={{ ...boxStyle, ...responsive }}>
        <Text strong="bold">Winner</Text>
        <Text css={{ textAlign: "center" }}>{getWinnerText(game.gameWinner)}</Text>
      </Box>
      <Box css={{ ...boxStyle, ...responsive }}>
        <Text strong="bold">End turn</Text>
        <Text css={{ textAlign: "center" }}>{game.endTurn}</Text>
      </Box>
      <Box css={{ ...boxStyle, ...responsive, width: ENDMODE_WIDTH }}>
        <Text strong="bold">End Mode</Text>
        <Text>{game.endMode}</Text>
      </Box>
      <A
        css={{
          ...boxStyle,
          ...responsive,
          width: "100px",
          borderRight: "none",
          marginLeft: "20px",
        }}
        href="//youtube.com"
        target="_blank"
      >
        Link to Video
      </A> */
}

const ResultRow = ({ game, role }: { game: Game; role: number }) => {
  console.log("game role", game, role);
  return (
    <PlayerInfo>
      <Box css={{ display: "flex", flexDirection: "row", alignContent: "space-around" }}>
        <Text css={{ alignSelf: "center", ...responsive }}>
          {/* {getGameType(game, role)} */}
          {`Game #${game.id}`}
        </Text>
        <Text css={{ alignSelf: "center", ...responsive }}>
          {/* {getGameType(game, role)} */}
          {getGameType(game, role)}
        </Text>
      </Box>

      <PlayerInfoBox
        usaCountryCode={game.usaCountryCode}
        ussrCountryCode={game.ussrCountryCode}
        usaPlayer={game.usaPlayer}
        ussrPlayer={game.ussrPlayer}
        gameWinner={game.gameWinner}
      />
    </PlayerInfo>
  );
};

const formatDateToString = (date: Date) => `${date.getDate()}/${date.getMonth() + 1}`;

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

const UnstyledLink = styled("a", {
  all: "unset" /* Unset all styles */,
  display: "inline" /* Reset to inline display */,
  cursor: "pointer" /* Set cursor to pointer */,
});
const Homepage: React.FC<HomepageProps> = ({ role }) => {
  const [dateValue, setDateValue] = useState<Date>(new Date());
  const { data, isLoading } = trpc.useQuery([
    GAME_QUERY,
    // @ts-ignore
    { d: dateValue.toDateString() },
  ]);

  const onClickDay = (clickedItem: "left" | "right") => {
    let newDate = new Date();
    if (clickedItem === "left") {
      newDate = dateAddDay(dateValue, -1);
    } else if (clickedItem === "right") {
      newDate = dateAddDay(dateValue, 1);
    }

    setDateValue(newDate);
  };

  const newData = [
    {
      id: 5,
      created_at: Date.now(),
      updated_at: Date.now(),
      usaPlayerId: 1,
      ussrPlayerId: 2,
      usaRatingDifference: 232,
      ussrRatingDifference: 442,
      gameType: "whoknows",
      game_code: "dfd",
      reported_at: Date.now(),
      gameWinner: "USSR",
      endTurn: "7",
      endMode: "DEFCON",
      game_date: Date.now(),
      video1: "megalol",
      videoURL: "megalooooooool",
      reporter_id: 1,
      usaCountryCode: "CAT",
      ussrCountryCode: "ES",
      usaPlayer: "Juli Arnalot",
      ussrPlayer: "Exhausted man",
      ratingsUSA: {
        rating: 8889,
        ratingDifference: 676,
      },
      ratingsUSSR: {
        rating: 8889,
        ratingDifference: 676,
      },
    },
  ];
  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        maxWidth: "1100px",
        // flexWrap: "wrap",
      }}
    >
      <ResultsPanel>
        <FilterPanel>
          <DayMonthInput value={formatDateToString(dateValue)} onClick={onClickDay} />
        </FilterPanel>
        {/* {isLoading && <SkeletonHomepage />} */}
        {newData?.length === 0 && <EmptyState />}
        {newData?.map((game, index) => (
          <Link href={`/games/${game.id}`} passHref>
            <UnstyledLink>
              <ResultRow key={index} role={role} game={game} />
            </UnstyledLink>
          </Link>
        ))}
      </ResultsPanel>
      <Box>
        <TopPlayerRating />
      </Box>
    </Box>
  );
};

export default Homepage;
