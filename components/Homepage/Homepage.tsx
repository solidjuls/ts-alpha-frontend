"use client";
import { useState, useMemo, useEffect } from "react";
import { FlagIcon } from "components/FlagIcon";
import Text from "components/Text";
import { TopPlayerRating } from "components/TopPlayerRating";
import { Game, GameWinner } from "types/game.types";
import { getWinnerText } from "utils/games";
import { dateFormat } from "utils/dates";
import {
  ContainerGameResults,
  ResponsiveText,
  PlayerCard,
  StyledResultsPanel,
  FilterPanel,
  UnstyledLink,
  GlobalContainer,
  MonoText,
  ResultMetaRow,
  MatchupRow,
  PlayerInline,
  VsText,
  ResultsHeader,
  ResultsFooter,
  LoadingPanel,
} from "./Homepage.styled";
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
}: Pick<Game, "usaPlayer" | "ussrPlayer" | "gameWinner" | "usaCountryCode" | "ussrCountryCode">) => {
  const winner = getWinnerText(gameWinner as GameWinner);

  const isUsaWinner = winner === "USA";
  const isUssrWinner = winner === "USSR";

  return (
    <MatchupRow>
      <PlayerInline>
        {usaCountryCode && <FlagIcon code={usaCountryCode} />}
        <Text
          fontSize="medium"
          strong={isUsaWinner ? "bold" : undefined}
        >
          {usaPlayer || "No Player Assigned"}
        </Text>
      </PlayerInline>

      <VsText>vs</VsText>

      <PlayerInline>
        {ussrCountryCode && <FlagIcon code={ussrCountryCode} />}
        <Text
          fontSize="medium"
          strong={isUssrWinner ? "bold" : undefined}
        >
          {ussrPlayer || "No Player Assigned"}
        </Text>
      </PlayerInline>
    </MatchupRow>
  );
};



const ResultRow = ({ game }: { game: Game }) => {
  return (
    <PlayerCard>
      <ResultMetaRow>
        <ResponsiveText>{`Game #${game.id}`}</ResponsiveText>
        <MonoText>{game.tournamentName}</MonoText>
        <MonoText>{dateFormat(new Date(game.gameDate))}</MonoText>
      </ResultMetaRow>

      <PlayerInfoBox
        usaCountryCode={game.usaCountryCode}
        ussrCountryCode={game.ussrCountryCode}
        usaPlayer={game.usaPlayer}
        ussrPlayer={game.ussrPlayer}
        gameWinner={game.gameWinner}
      />
    </PlayerCard>
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

const FilterUser: React.FC<FilterUserProps> = ({ users, selectedValues, setSelectedValues }) => {
  const usersMemo = useMemo(
    () => users.map((item) => ({ code: item.id as string, name: item.name as string })),
    [users]
  );

  return (
    <MultiSelect
      items={usersMemo}
      placeholder="Select Players..."
      selectedValues={selectedValues}
      setSelectedValues={(values: MultiSelectItemType[]) => {
        if (values.length <= 2) setSelectedValues(values);
      }}
      closeOnSelect={false}
      selectionLimit={2}
    />
  );
};

const FilterTournament: React.FC<FilterTournamentProps> = ({
  tournaments,
  selectedValues,
  setSelectedValues,
}) => {
  const tournamentsMemo = useMemo(
    () => tournaments.map((item) => ({ code: item.id.toString(), name: item.tournament_name })),
    [tournaments]
  );

  return (
    <MultiSelect
      items={tournamentsMemo}
      placeholder="Select Tournaments..."
      selectedValues={selectedValues}
      // (Your MultiSelect typing seems a bit loose; keep your current adapter)
      setSelectedValues={(values: any) => {
        const valuesArray = Array.isArray(values) ? values : [values];
        setSelectedValues(valuesArray);
      }}
      closeOnSelect={false}
    />
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

      <Button onClick={onClear}>Clear</Button>
    </FilterPanel>
  );
};

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <LoadingPanel>
        <Spinner />
      </LoadingPanel>
    );
  }

  if (!data || data.length === 0) {
    return (
      <LoadingPanel>
        <Text style={{ fontSize: "20px" }}>No Games</Text>
      </LoadingPanel>
    );
  }

  return (
    <StyledResultsPanel>
      {data.map((game) => (
        <UnstyledLink key={game.id} href={`/games/${game.id}`} passHref>
          <ResultRow game={game} />
        </UnstyledLink>
      ))}
    </StyledResultsPanel>
  );
};

const HOMEPAGE_FILTERS_KEY = "homepage_filters";

type StoredFilters = {
  players: MultiSelectItemType[];
  tournaments: MultiSelectItemType[];
  page: number;
};

const getStoredFilters = (): StoredFilters | null => {
  if (typeof window === "undefined") return null;
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
  const [currentPage, setCurrentPage] = useState<number>(storedFilters?.page || 1);

  useEffect(() => {
    localStorage.setItem(
      HOMEPAGE_FILTERS_KEY,
      JSON.stringify({ players: playersSelected, tournaments: tournamentSelected, page: currentPage })
    );
  }, [playersSelected, tournamentSelected, currentPage]);

  const gameFilters: GetGamesParams = useMemo(() => {
    const filters: GetGamesParams = { p: currentPage, pageSize: 20 };

    if (playersSelected.length > 0) {
      filters.userFilter = playersSelected.map((item) => item.code).join(",");
    }
    if (tournamentSelected.length > 0) {
      filters.toFilter = tournamentSelected.map((item) => item.code).join(",");
    }
    if (videoSelected) filters.video = true;

    return filters;
  }, [playersSelected, tournamentSelected, videoSelected, currentPage]);

  const { data: gamesData, isLoading } = useGames(gameFilters);

  const onPageChange = (page: string) => setCurrentPage(Number(page));

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
        <ResultsHeader>
          <Filter
            playersSelected={playersSelected}
            setPlayersSelected={setPlayersSelected}
            tournamentSelected={tournamentSelected}
            setTournamentSelected={setTournamentSelected}
            videoSelected={videoSelected}
            setVideoSelected={setVideoSelected}
            onClear={onClear}
          />
        </ResultsHeader>

        <ResultsPanel data={gamesData?.results || []} isLoading={isLoading} />

        {!isLoading && gamesData && (
          <ResultsFooter>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
          </ResultsFooter>
        )}
      </GlobalContainer>

      <TopPlayerRating />
    </ContainerGameResults>
  );
};

export default Homepage;
