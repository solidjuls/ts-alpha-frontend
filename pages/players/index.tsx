"use client";

import { useState } from "react";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import { Pagination } from "components/Pagination";
import MultiSelect from "components/MultiSelect";
import { DropdownItemType, MultiSelectItemType } from "types/types";
import CountriesTypeahead from "components/CountriesTypeahead";
import { usePlayerRatings } from "hooks/useRating";
import { useAllUsers } from "hooks/useUsers";
import {
  Container,
  FlexContainer,
  FlexColumn,
  FlexRow,
  StyledInput,
  UnstyledLink,
  FilterPanelStyled,
  ResultsStyleWrapper,
  StyledResultsPanel,
  StyledCardRow,
  PageTitle,
  StyledText,
  TextHeader,
  RatingCell
} from "styles/players.styled";

interface CardColumnProps {
  header: string;
  value: string | number;
  countryCode?: string;
}

interface PlayerRowProps {
  index: number;
  player: {
    id: string;
    rank: number;
    name: string;
    countryCode?: string;
    rating: number;
  };
}

interface ResultsPanelProps {
  data: any[];
  onPageChange?: (page: any) => Promise<void>;
  isLoading?: boolean;
}

const CardColumn: React.FC<CardColumnProps> = ({ header, value, countryCode }) => {
  return (
    <FlexColumn>
      <TextHeader>{header}</TextHeader>
      <FlexRow>
        {countryCode && <FlagIcon code={countryCode} />}
        <Text fontSize="medium">{value}</Text>
      </FlexRow>
    </FlexColumn>
  );
};

const ResultsPanel: React.FC<ResultsPanelProps> = ({ data }) => {
  return (
    <FlexContainer>
      <StyledResultsPanel>
        {data?.map((player: any, index: number) => (
          <PlayerRow key={index} index={index} player={player} />
        ))}
      </StyledResultsPanel>
    </FlexContainer>
  );
};

const PlayerRow: React.FC<PlayerRowProps> = ({ index, player }) => {
  return (
    <UnstyledLink key={index} href={`/userprofile/${player.id}`} passHref>
      <StyledCardRow className="card card--clickable">
        <CardColumn header="Rank" value={player.rank} />
        <CardColumn header="Player" value={player.name} countryCode={player.countryCode} />
        <RatingCell>
          <CardColumn header="Rating" value={player.rating} />
        </RatingCell>
      </StyledCardRow>
    </UnstyledLink>
  );
};

const Players = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [playersSelected, setPlayersSelected] = useState<MultiSelectItemType[]>([]);
  const [countriesSelected, setCountriesSelected] = useState<string>("");
  const [playdeckInput, setPlaydeckInput] = useState("");
  const [playdeckValue, setPlaydeckValue] = useState("");



// Treat any filter as "show all results" (no pagination)
const isFiltered =
  playersSelected.length > 0 ||
  !!countriesSelected ||
  !!playdeckInput;

const pageSize = isFiltered ? undefined : 20;




  const {
    data: playersData,
    isLoading: isLoadingPlayers,
    error: playersError,
  } = usePlayerRatings({
    page: isFiltered ? undefined : currentPage,
    pageSize,
    playerFilter: playersSelected.length > 0 ? playersSelected.map((p) => p.code) : undefined,
    countrySelected: countriesSelected || undefined,
    playdeck: playdeckInput || undefined,
    orderBy: "rating",
    orderDirection: "desc",
  });

  const { data: usersData } = useAllUsers(1, 3000);

  const totalPages = playersData?.totalPages ?? 1;

const paginationVisibility = !isFiltered && totalPages > 1;

  const userItems: DropdownItemType[] =
    usersData?.results?.map((user: any) => ({
      code: user.id,
      name: user?.name.trim(),
    })) || [];

  const onPageChange = async (page: number) => {
    setCurrentPage(page);
  };


  if (playersError) {
    return (
      <Container>
        <PageTitle>Player List</PageTitle>
        <StyledText>There was an error loading the player list.</StyledText>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>Player List</PageTitle>

      <FilterPanelStyled>
        {/* Player multi-select */}
        <MultiSelect
          setSelectedValues={(value: any) => {
            setPlayersSelected(value);
            setCurrentPage(1);
          }}
          items={userItems}
          selectedValues={playersSelected as any}
          placeholder="Select Players..."
        />

        {/* Federation typeahead */}
        <div style={{ minWidth: "240px" }}>
          <CountriesTypeahead
            placeholder="Type the Federation Name..."
            width="100%"
            filter="filter"
            onSelect={(value) => {
              if (value) {
                setCountriesSelected(value.value || "");
              } else {
                setCountriesSelected("");
              }
              setCurrentPage(1);
            }}
            onBlur={() => {
              // Keep selected filter; remove this if you truly want to clear on blur
            }}
            selectedItem={countriesSelected || ""}
            labelText=""
            error={false}
            listWidth="320px"
          />
        </div>

        {/* Playdek input */}
        <StyledInput
          type="text"
          value={playdeckValue}
          placeholder="Type the Playdek Name..."
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setPlaydeckValue(event.target.value)
          }
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              setPlaydeckInput(playdeckValue);
              setCurrentPage(1);
            }
          }}
        />
      </FilterPanelStyled>

      <ResultsStyleWrapper>
        <ResultsPanel
          data={playersData?.results || []}
          onPageChange={onPageChange}
          isLoading={isLoadingPlayers}
        />
      </ResultsStyleWrapper>

      {paginationVisibility && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </Container>
  );
};

export default Players;
