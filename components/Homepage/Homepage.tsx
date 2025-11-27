"use client";
import { useState, useMemo } from "react";
import styled from "styled-components";
import { FlagIcon } from "components/FlagIcon";
import Text from "components/Text";
import { TopPlayerRating } from "components/TopPlayerRating";
import { Game } from "types/game.types";
import { getWinnerText } from "utils/games";
import { dateFormat } from "utils/dates";
import { PlayerInfo, StyledResultsPanel, FilterPanel, UnstyledLink, GlobalContainer } from "./Homepage.styled";
import MultiSelect from "components/MultiSelect";
import { Spinner } from "@radix-ui/themes";
import { Pagination } from "components/Pagination";
import { Button } from "components/Button";
import { Checkbox } from "components/Checkbox";
import { MultiSelectItemType } from "types/types";
import { useAllUsers } from "hooks/useUsers";
import { useTournaments } from "hooks/useTournaments";
import { useGames } from "hooks/useGames";
import { GetGamesParams } from "services/games.service";
import { Tournament } from "services/tournaments.service";
import { User, UsersListResponse } from "services/users.service";
import { ResponsiveContainer } from "components/Layout/ResponsiveContainer";

type ResultsPanelProps = {
  data: Game[];
  isLoading?: boolean;
};

const ResponsiveText = styled(Text)`
  @media (max-width: 640px) {
    display: none;
  }
`;

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
        <ResponsiveText fontSize="small" style={{ alignSelf: "center" }}>
          {`Game #${game.id}`}
        </ResponsiveText>
        <ResponsiveText fontSize="small" style={{ alignSelf: "center", marginLeft: 4 }}>
          {game.tournamentName}
        </ResponsiveText>
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
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "16px",
        height: "320px",
      }}
    >
      <Text style={{ fontSize: "20px" }} strong="bold">
        No games
      </Text>
    </div>
  );
};

type FilterUserProps = {
  users: User[];
  selectedValues: string[];
  setSelectedValues: (values: string[]) => void;
};

type FilterTournamentProps = {
  tournaments: Tournament[];
  selectedValues: string[];
  setSelectedValues: (values: string[]) => void;
};

const FilterUser: React.FC<FilterUserProps> = ({
  users,
  selectedValues,
  setSelectedValues,
}) => {
  const usersMemo = useMemo(
    () => users.map((item) => ({ code: item.id as string, name: item.name as string })),
    [users],
  );

  return (
    <div style={{ margin: "4px" }}>
      <MultiSelect
        items={usersMemo}
        placeholder="Select Players (max 2)..."
        selectedValues={selectedValues}
        setSelectedValues={(values: string) => {
          // Handle the MultiSelect component's interface which passes a single string
          // but we need to manage it as an array for our state
          const valuesArray = Array.isArray(values) ? values : [values];
          // Limit to maximum 2 players
          if (valuesArray.length <= 2) {
            setSelectedValues(valuesArray);
          }
        }}
        closeOnSelect={false}
        selectionLimit={2}
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
    <div style={{ margin: "4px" }}>
      <MultiSelect
        items={tournamentsMemo}
        placeholder="Select Tournaments..."
        selectedValues={selectedValues}
        setSelectedValues={(values: string) => {
          const valuesArray = Array.isArray(values) ? values : [values];
          setSelectedValues(valuesArray);
        }}
        closeOnSelect={false}
      />
    </div>
  );
};

type FilterProps = {
  playersSelected: string[];
  setPlayersSelected: (values: string[]) => void;
  tournamentSelected: string[];
  setTournamentSelected: (values: string[]) => void;
  videoSelected: boolean;
  setVideoSelected: (value: boolean) => void;
  onClear: () => void;
};

const Filter: React.FC<FilterProps> = ({
  playersSelected,
  setPlayersSelected,
  tournamentSelected,
  setTournamentSelected,
  videoSelected,
  setVideoSelected,
  onClear,
}) => {
  const { data: tournaments, isLoading: isLoadingTournament } = useTournaments({ status: "1,2,3,4" });
  const { data: usersData, isLoading: isLoadingUsers } = useAllUsers(1, 1000); // Get all users for filtering

  if (isLoadingTournament || isLoadingUsers) return null;

  // Type cast tournaments to Tournament[] since we know it returns tournaments for this query
  const tournamentsList = tournaments as Tournament[];
  // Type cast users data to get the results
  const usersResponse = usersData as UsersListResponse;

  return (
    <FilterPanel>
      {usersResponse?.results && (
        <FilterUser
          users={usersResponse.results}
          selectedValues={playersSelected}
          setSelectedValues={setPlayersSelected}
        />
      )}
      {tournamentsList && (
        <FilterTournament
          tournaments={tournamentsList}
          selectedValues={tournamentSelected}
          setSelectedValues={setTournamentSelected}
        />
      )}
      <Checkbox
        text="Games with videos"
        onCheckedChange={() => setVideoSelected(!videoSelected)}
        checked={videoSelected}
      />
      <div style={{ display: "flex" }}>
        <Button style={{ width: "80px", fontSize: "16px" }} onClick={onClear}>
          Clear
        </Button>
      </div>
    </FilterPanel>
  );
};

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', width: "100%" }}>
        <StyledResultsPanel style={{ justifyContent: "center", alignItems: "center" }}>
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

const Homepage: React.FC = () => {
  // Local state for filters
  const [playersSelected, setPlayersSelected] = useState<string[]>([]);
  const [tournamentSelected, setTournamentSelected] = useState<string[]>([]);
  const [videoSelected, setVideoSelected] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Build filters for API call
  const gameFilters: GetGamesParams = useMemo(() => {
    const filters: GetGamesParams = {
      p: currentPage,
      pageSize: 20,
    };

    if (playersSelected.length > 0) {
      filters.userFilter = playersSelected.join(',');
    }

    if (tournamentSelected.length > 0) {
      filters.toFilter = tournamentSelected.join(',');
    }

    if (videoSelected) {
      filters.video = true;
    }

    return filters;
  }, [playersSelected, tournamentSelected, videoSelected, currentPage]);

  // Fetch games using React Query
  const { data: gamesData, isLoading } = useGames(gameFilters);

  const onPageChange = (page: string) => {
    setCurrentPage(Number(page));
  };

  const onClear = () => {
    setPlayersSelected([]);
    setTournamentSelected([]);
    setVideoSelected(false);
    setCurrentPage(1);
  };

  const totalPages = gamesData ? Math.ceil(gamesData.totalRows / 20) : 1;

  return (
    <ResponsiveContainer>
      <GlobalContainer>
        <Filter
          playersSelected={playersSelected}
          setPlayersSelected={setPlayersSelected}
          tournamentSelected={tournamentSelected}
          setTournamentSelected={setTournamentSelected}
          videoSelected={videoSelected}
          setVideoSelected={setVideoSelected}
          onClear={onClear}
        />
        <ResultsPanel
          data={gamesData?.results || []}
          isLoading={isLoading}
        />
        {!isLoading && gamesData && (
          <Pagination
            currentPage={currentPage.toString()}
            totalPages={totalPages.toString()}
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
