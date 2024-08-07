import { useState } from "react";
import { trpc } from "contexts/APIProvider";
import { FlagIcon } from "components/FlagIcon";
import { Box } from "components/Atoms";
import Text from "components/Text";
import { DayMonthInput } from "components/Input";
import { TopPlayerRating } from "components/TopPlayerRating";
import { dateAddDay } from "utils/dates";
import { SkeletonHomepage } from "components/Skeletons";
import { Game, } from "types/game.types";
import { getWinnerText } from "utils/games";
import { GAME_QUERY } from "utils/constants";
import Link from "next/link";
import { PlayerInfo, ResultsPanel, FilterPanel, UnstyledLink} from "./Homepage.styles"

type HomepageProps = {
  role: number;
};

const responsive = {
  "@sm": {
    display: "none",
  },
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
        <Text  fontSize="medium" strong={gameWinner === "1" ? "bold" : undefined}>{usaPlayer}</Text>
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
        <Text  fontSize="medium" strong={gameWinner === "2" ? "bold" : undefined}>{ussrPlayer}</Text>
      </Box>
    </Box>
  );
};

const getGameType = (game: Game, role: number) => {
  if (role === 2) return `${game.gameType} (${game.id})`;

  return game.gameType;
};

const ResultRow = ({ game, role }: { game: Game; role: number }) => {
  console.log("game role", game, role);
  return (
    <PlayerInfo>
      <Box css={{ display: "flex", flexDirection: "row", margin: "0 0 4 0" }}>
        <Text fontSize="small" css={{ alignSelf: "center", ...responsive }}>
          {/* {getGameType(game, role)} */}
          {`Game #${game.id}`}
        </Text>
        <Text fontSize="small" css={{ alignSelf: "center", marginLeft: 4, ...responsive }}>
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
        {isLoading && <SkeletonHomepage />}
        {data?.length === 0 && <EmptyState />}
        {data?.map((game, index) => (
          <UnstyledLink key={index} href={`/games/${game.id}`} passHref>
              <ResultRow key={index} role={role} game={game} />
          </UnstyledLink>
        ))}
      </ResultsPanel>
      <Box>
        <TopPlayerRating />
      </Box>
    </Box>
  );
};

export default Homepage;
