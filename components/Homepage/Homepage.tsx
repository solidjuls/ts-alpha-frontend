"use client";
import { useEffect, useMemo } from "react";
import { FlagIcon } from "components/FlagIcon";
import { Box, Flex } from "components/Atoms";
import Text from "components/Text";
import { TopPlayerRating } from "components/TopPlayerRating";
import { dateAddDay } from "utils/dates";
import { SkeletonHomepage } from "components/Skeletons";
import { Game } from "types/game.types";
import { getWinnerText } from "utils/games";
import { dateFormat } from "utils/dates";
import { PlayerInfo, StyledResultsPanel, FilterPanel, UnstyledLink } from "./Homepage.styles";
import MultiSelect from "components/MultiSelect";
import useFetchInitialData from "hooks/useFetchInitialData";
import { Spinner } from "@radix-ui/themes";
import { Pagination } from "components/Pagination";
import { styled } from "stitches.config";
import { Button } from "components/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  fetchGameList,
  setClearFilter,
  setCurrentPage,
  setPlayersFilter,
  setTournamentFilter,
} from "../../redux/gameListSlice";

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
        <Text fontSize="medium" strong={getWinnerText(gameWinner) === "USA" ? "bold" : undefined}>
          {usaPlayer}
        </Text>
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
        <Text fontSize="medium" strong={getWinnerText(gameWinner) === "USSR" ? "bold" : undefined}>
          {ussrPlayer}
        </Text>
      </Box>
    </Box>
  );
};

const ResultRow = ({ game }: { game: Game }) => {
  return (
    <PlayerInfo>
      <Flex
        css={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          margin: "0 0 0 8px",
        }}
      >
        <Text fontSize="small" css={{ alignSelf: "center", ...responsive }}>
          {`Game #${game.id}`}
        </Text>
        <Text fontSize="small" css={{ alignSelf: "center", marginLeft: 4, ...responsive }}>
          {game.gameType}
        </Text>
        <Text fontSize="small">{dateFormat(new Date(game?.gameDate))}</Text>
      </Flex>

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

const FilterUser = ({ onFilterChange, users, selectedValues, setSelectedValues }) => {
  const usersMemo = useMemo(
    () => users?.map((item) => ({ code: item.id, name: item.name })),
    [users],
  );

  return (
    <Box css={{ margin: "4px" }}>
      <MultiSelect
        items={usersMemo}
        placeholder="Select Players..."
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
      />
    </Box>
  );
};
const FilterTournament = ({ tournaments, selectedValues, setSelectedValues }) => {
  const tournamentsMemo = useMemo(
    () => tournaments?.map((item) => ({ code: item.code, name: item.text })),
    [tournaments],
  );

  return (
    <Box css={{ margin: "4px" }}>
      <MultiSelect
        items={tournamentsMemo}
        placeholder="Select Tournaments..."
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
      />
    </Box>
  );
};

const Filter = ({ dispatch }) => {
  const { data: tournaments } = useFetchInitialData({
    url: "/api/game/tournaments",
    cacheId: "tournaments-list",
  });
  const { data: users } = useFetchInitialData({ url: "/api/user", cacheId: "user-list" });
  const { filters } = useSelector((state: RootState) => state.gameList);
  const { playersSelected, tournamentSelected } = filters;

  const onClear = () => {
    dispatch(setClearFilter());
  };
  // --blue-50: #f4fafe;
  // --blue-100: #cae6fc;
  // --blue-200: #a0d2fa;
  // --blue-300: #75bef8;
  // --blue-400: #4baaf5;
  // --blue-500: #2196f3;
  // --blue-600: #1c80cf;
  // --blue-700: #1769aa;
  // --blue-800: #125386;

  return (
    <FilterPanel>
      <FilterUser
        users={users}
        selectedValues={playersSelected}
        setSelectedValues={(value) => dispatch(setPlayersFilter(value))}
      />
      <FilterTournament
        tournaments={tournaments}
        selectedValues={tournamentSelected}
        setSelectedValues={(value) => dispatch(setTournamentFilter(value))}
      />
      <Flex>
        <Button css={{ width: "80px", fontSize: "16px" }} onClick={onClear}>
          Clear
        </Button>
      </Flex>
    </FilterPanel>
  );
};

export const ResultsPanel = ({ data, dateValue, onClickDay, isLoading, excludePagination }) => {
  if (isLoading) {
    return (
      <Flex css={{ width: "100%" }}>
        <StyledResultsPanel css={{ justifyContent: "center", alignItems: "center" }}>
          <Spinner />
        </StyledResultsPanel>
      </Flex>
    );
  }
  return (
    <StyledResultsPanel>
      {data?.map((game, index) => (
        <UnstyledLink key={index} href={`/games/${game.id}`} passHref>
          <ResultRow key={index} game={game} />
        </UnstyledLink>
      ))}
    </StyledResultsPanel>
  );
};

const ResponsiveContainer = styled("div", {
  display: "flex",
  flexDirection: "row",
  width: "100%",
  maxWidth: "1100px",
  variants: {
    direction: {
      row: {
        flexDirection: "row",
      },
      column: {
        flexDirection: "column",
      },
    },
  },
});

const Homepage: React.FC<HomepageProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, filters, currentPage, totalPages } = useSelector(
    (state: RootState) => state.gameList,
  );

  useEffect(() => {
    dispatch(fetchGameList());
  }, [filters, currentPage, dispatch]);

  const onPageChange = async (page: string) => {
    dispatch(setCurrentPage(page));
  };

  const onFilterChange = async ({ selectedTournaments, selectedPlayers }) => {
    dispatch(setTournamentFilter(selectedTournaments));
    dispatch(setPlayersFilter(selectedPlayers));
  };

  return (
    <ResponsiveContainer
      direction={{
        "@initial": "row",
        "@sm": "column",
      }}
    >
      <Flex css={{ flexDirection: "column", width: "100%" }}>
        <Filter onFilterChange={onFilterChange} dispatch={dispatch} />
        <ResultsPanel
          data={items.results}
          isLoading={status === "loading"}
          // dateValue={dateValue}
          // onClickDay={onClickDay}
        />
        {!(status === "loading") && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </Flex>
      <Box>
        <TopPlayerRating />
      </Box>
    </ResponsiveContainer>
  );
};

export default Homepage;
