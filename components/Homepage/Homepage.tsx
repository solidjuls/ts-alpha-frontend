"use client";
import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { FlagIcon } from "components/FlagIcon";
import Text from "components/Text";
import { TopPlayerRating } from "components/TopPlayerRating";
import { Game, TournamentsType } from "types/game.types";
import { getWinnerText } from "utils/games";
import { dateFormat } from "utils/dates";
import { PlayerInfo, StyledResultsPanel, FilterPanel, UnstyledLink, GlobalContainer } from "./Homepage.styles";
import MultiSelect from "components/MultiSelect";
import useFetchInitialData from "hooks/useFetchInitialData";
import { Spinner } from "@radix-ui/themes";
import { Pagination } from "components/Pagination";
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
import { useUsers } from "hooks/useUsers";
import { useTournaments } from "hooks/useTournaments";

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
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div
        style={{
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
      </div>
      <span>vs</span>
      <div
        style={{
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
      </div>
    </div>
  );
};

const ResultRow = ({ game }: { game: Game }) => {
  return (
    <PlayerInfo>
      <div
        style={{
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
      </div>

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
    <div
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
    </div>
  );
};

type FilterUserProps = {
  users: UserType[];
  selectedValues: MultiSelectItemType[];
};

type FilterTournamentProps = {
  tournaments: TournamentsType[];
  selectedValues: MultiSelectItemType[];
};

const FilterUser: React.FC<FilterUserProps> = ({
  onFilterChange,
  users,
  selectedValues,
  setSelectedValues,
}) => {
  const usersMemo = useMemo(
    () => users.map((item) => ({ code: item.id as string, name: item.name as string })),
    [users],
  );

  return (
    <div css={{ margin: "4px" }}>
      <MultiSelect
        items={usersMemo}
        placeholder="Select Players..."
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        closeOnSelect={false}
      />
    </div>
  );
};
const FilterTournament: React.FC<FilterTournamentProps> = ({
  tournaments,
  selectedValues,
  setSelectedValues,
}) => {
  const tournamentsMemo = useMemo(
    () => tournaments.map((item) => ({ code: item.id.toString(), name: item.tournament_name })),
    [tournaments],
  );

  return (
    <div css={{ margin: "4px" }}>
      <MultiSelect
        items={tournamentsMemo}
        placeholder="Select Tournaments..."
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        closeOnSelect={false}
      />
    </div>
  );
};

const Filter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: tournaments, isLoading: isLoadingTournament } = useTournaments({ status: "1,2,3,4" });
  const { data: users, isLoading: isLoadingUsers } = useUsers()

  const { filters } = useSelector((state: RootState) => state.gameList);
  const { playersSelected, tournamentSelected, videoSelected } = filters;
console.log("tournaments", tournaments)
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

  if (isLoadingTournament || isLoadingUsers) return null;
  return (
    <FilterPanel>
      {users && (
        <FilterUser
          users={users}
          selectedValues={playersSelected}
          setSelectedValues={(value) => {
            dispatch(setPlayersFilter(value));
          }}
          closeOnSelect={false}
        />
      )}
      {tournaments && (
        <FilterTournament
          tournaments={tournaments}
          selectedValues={tournamentSelected}
          setSelectedValues={(value) => dispatch(setTournamentFilter(value))}
          closeOnSelect={false}
        />
      )}
      <Checkbox
        text="Games with videos"
        onCheckedChange={() => dispatch(setVideoFilter(!videoSelected))}
        checked={videoSelected}
      />
      <div css={{ display: "flex" }}>
        <Button css={{ width: "80px", fontSize: "16px" }} onClick={onClear}>
          Clear
        </Button>
      </div>
    </FilterPanel>
  );
};

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div css={{ display: 'flex', width: "100%" }}>
        <StyledResultsPanel css={{ justifyContent: "center", alignItems: "center" }}>
          <Spinner />
        </StyledResultsPanel>
      </div>
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

const ResponsiveContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1100px;
  @media (max-width: 768px) {
    flex-direction: "column";
  }
`

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
    <ResponsiveContainer>
      <GlobalContainer>
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
      </GlobalContainer>
      <div>
        <TopPlayerRating />
      </div>
    </ResponsiveContainer>
  );
};

export default Homepage;
