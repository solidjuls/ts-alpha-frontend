"use client";
import { useEffect, useMemo } from "react";
import { FlagIcon } from "components/FlagIcon";
import { Box, Flex } from "components/Atoms";
import Text from "components/Text";
import { TopPlayerRating } from "components/TopPlayerRating";
import { Game, TournamentsType } from "types/game.types";
import { getWinnerText } from "utils/games";
import { dateFormat } from "utils/dates";
import { PlayerInfo, StyledResultsPanel, FilterPanel, UnstyledLink } from "./Homepage.styles";
import { MultiSelectCombobox, Option } from "components/MultiSelectCombobox/MultiSelectCombobox";
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
  setVideoFilter,
} from "../../redux/gameListSlice";
import { Checkbox } from "components/Checkbox";
import { UserType } from "types/user.types";
import { MultiSelectItemType } from "types/types";

type ResultsPanelProps = {
  data: Game[];
  isLoading?: boolean;
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

type FilterUserProps = {
  users: UserType[];
  selectedValues: MultiSelectItemType[];
  setSelectedValues: (value: MultiSelectItemType[]) => void;
};

type FilterTournamentProps = {
  tournaments: TournamentsType[];
  selectedValues: MultiSelectItemType[];
  setSelectedValues: (value: MultiSelectItemType[]) => void;
};

const FilterUser: React.FC<FilterUserProps> = ({ users, selectedValues, setSelectedValues }) => {
  const options = useMemo(
    () => users.map((item) => ({ value: item.id as string, label: item.name as string })),
    [users],
  );

  const selected = selectedValues.map((item) => item.code);

  return (
    <Box css={{ margin: "4px" }}>
      <MultiSelectCombobox
        options={options}
        selected={selected}
        onChange={(selected) => {
          const selectedOptions = selected.map((value) => {
            const option = options.find((opt) => opt.value === value);
            return { code: option?.value || "", name: option?.label || "" };
          });
          setSelectedValues(selectedOptions);
        }}
        placeholder="Select Players..."
        maxDisplayItems={2}
      />
    </Box>
  );
};

const FilterTournament: React.FC<FilterTournamentProps> = ({
  tournaments,
  selectedValues,
  setSelectedValues,
}) => {
  const options = useMemo(
    () => tournaments.map((item) => ({ value: item.id.toString(), label: item.tournament_name })),
    [tournaments],
  );

  const selected = selectedValues.map((item) => item.code);

  return (
    <Box css={{ margin: "4px" }}>
      <MultiSelectCombobox
        options={options}
        selected={selected}
        onChange={(selected) => {
          const selectedOptions = selected.map((value) => {
            const option = options.find((opt) => opt.value === value);
            return { code: option?.value || "", name: option?.label || "" };
          });
          setSelectedValues(selectedOptions);
        }}
        placeholder="Select Tournaments..."
        maxDisplayItems={2}
      />
    </Box>
  );
};

const Filter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: tournaments, isLoading: isLoadingTournament } = useFetchInitialData<
    TournamentsType[]
  >({
    url: "/api/game/tournaments",
    cacheId: "tournaments-list",
  });
  const { data: users, isLoading: isLoadingUsers } = useFetchInitialData<UserType[]>({
    url: "/api/user",
    cacheId: "user-list",
  });
  const { filters } = useSelector((state: RootState) => state.gameList);
  const { playersSelected, tournamentSelected, videoSelected } = filters;

  const onClear = () => {
    dispatch(setClearFilter());
  };

  if (isLoadingTournament || isLoadingUsers) return null;

  return (
    <FilterPanel>
      {users && (
        <FilterUser
          users={users}
          selectedValues={playersSelected}
          setSelectedValues={(value: MultiSelectItemType[]) => dispatch(setPlayersFilter(value))}
        />
      )}
      {tournaments && (
        <FilterTournament
          tournaments={tournaments}
          selectedValues={tournamentSelected}
          setSelectedValues={(value: MultiSelectItemType[]) => dispatch(setTournamentFilter(value))}
        />
      )}
      <Checkbox
        text="Video"
        onCheckedChange={() => dispatch(setVideoFilter(!videoSelected))}
        checked={videoSelected}
      />
      <Flex>
        <Button css={{ width: "80px", fontSize: "16px" }} onClick={onClear}>
          Clear
        </Button>
      </Flex>
    </FilterPanel>
  );
};

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ data, isLoading }) => {
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

const Homepage: React.FC = () => {
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

  return (
    <ResponsiveContainer
      direction={{
        "@initial": "row",
        "@sm": "column",
      }}
    >
      <Flex css={{ flexDirection: "column", width: "100%" }}>
        <Filter />
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
