"use client";
import { useState, useMemo, useEffect } from "react";
import { FlagIcon } from "components/FlagIcon";
import Text from "components/Text";
import { TopPlayerRating } from "components/TopPlayerRating";
import { Game } from "types/game.types";
import { getWinnerText } from "utils/games";
import { dateFormat } from "utils/dates";
import { ContainerGameResults, ResponsiveText, PlayerInfo, StyledResultsPanel, FilterPanel, UnstyledLink, GlobalContainer, NumericText } from "./Homepage.styled";
import MultiSelect from "components/MultiSelect";
import { Spinner } from "@radix-ui/themes";
import { Pagination } from "components/Pagination";
import { Button } from "components/Button";
import { Checkbox } from "components/Checkbox";
import { useAllUsers } from "hooks/useUsers";
import { useTournaments } from "hooks/useTournaments";
import { useGames } from "hooks/useGames";
import { GetGamesParams } from "services/games.service";
import { Tournament } from "services/tournaments.service";
import { User, UsersListResponse } from "services/users.service";
import { MultiSelectItemType } from "types/types";

type ResultsPanelProps = {
  data: Game[];
  isLoading?: boolean;
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
        <NumericText>
          {`Game #${game.id}`}
        </NumericText>
        <ResponsiveText>
          {game.tournamentName}
        </ResponsiveText>
        <NumericText>{dateFormat(new Date(game?.gameDate))}</NumericText>
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
      <Text style={{ fontSize: "20px" }}>
        No Games
      </Text>
    </div>
  );
};

type FilterUserProps = {
  users: User[];
  selectedValues: MultiSelectItemType[];
  setSelectedValues: (values: MultiSelectItemType[]) => void;
};

type FilterTournamentProps = {
  tournaments: Tournament[];
  selectedValues: MultiSelectItemType[];
  setSelectedValues: (values: MultiSelectItemType[]) => void;
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
    <div>
      <MultiSelect
        items={usersMemo}
        placeholder="Select Players..."
        selectedValues={selectedValues}
        setSelectedValues={(values: MultiSelectItemType[]) => {
          // Limit to maximum 2 players
          if (values.length <= 2) {
            setSelectedValues(values);
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
    <div>
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
  playersSelected: MultiSelectItemType[];
  setPlayersSelected: (values: MultiSelectItemType[]) => void;
  tournamentSelected: MultiSelectItemType[];
  setTournamentSelected: (values: MultiSelectItemType[]) => void;
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
  const { data: tournaments, isLoading: isLoadingTournament } = useTournaments({ status: "4,5" });
  const { data: usersData, isLoading: isLoadingUsers } = useAllUsers(1, 3000);

  if (isLoadingTournament || isLoadingUsers) return null;

  const tournamentsList = tournaments as Tournament[];
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
        text="Games with Videos"
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

const HOMEPAGE_FILTERS_KEY = 'homepage_filters';

const getStoredFilters = (): { players: MultiSelectItemType[]; tournaments: MultiSelectItemType[] } | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(HOMEPAGE_FILTERS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const Homepage: React.FC = () => {
  const storedFilters = getStoredFilters();
  const [playersSelected, setPlayersSelected] = useState<MultiSelectItemType[]>(storedFilters?.players || []);
  const [tournamentSelected, setTournamentSelected] = useState<MultiSelectItemType[]>(storedFilters?.tournaments || []);
  const [videoSelected, setVideoSelected] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(HOMEPAGE_FILTERS_KEY, JSON.stringify({
      players: playersSelected,
      tournaments: tournamentSelected,
    }));
  }, [playersSelected, tournamentSelected]);

  const gameFilters: GetGamesParams = useMemo(() => {
    const filters: GetGamesParams = {
      p: currentPage,
      pageSize: 20,
    };

    if (playersSelected.length > 0) {
      filters.userFilter = playersSelected.map(item => item.code).join(',');
    }

    if (tournamentSelected.length > 0) {
      filters.toFilter = tournamentSelected.map(item => item.code).join(',');
    }

    if (videoSelected) {
      filters.video = true;
    }

    return filters;
  }, [playersSelected, tournamentSelected, videoSelected, currentPage]);

  const { data: gamesData, isLoading } = useGames(gameFilters);

  const onPageChange = (page: string) => {
    setCurrentPage(Number(page));
  };

  const onClear = () => {
    setPlayersSelected([]);
    setTournamentSelected([]);
    setVideoSelected(false);
    setCurrentPage(1);
    localStorage.removeItem(HOMEPAGE_FILTERS_KEY);
  };

  const totalPages = gamesData ? Math.ceil(gamesData.totalRows / 20) : 1;

  return (
      <ContainerGameResults>
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
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </GlobalContainer>
        <TopPlayerRating />
      </ContainerGameResults>
  );
};

export default Homepage;
