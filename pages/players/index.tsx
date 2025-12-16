import { useState, useMemo } from "react";

import styled from "styled-components";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import Link from "next/link";
import { Pagination } from "components/Pagination";
import { FilterPanel } from "components/Homepage/Homepage.styled";
import MultiSelect from "components/MultiSelect";
import { DropdownItemType } from "types/types";
import CountriesTypeahead from "components/CountriesTypeahead";
import { Input } from "components/Input";
import { usePlayerRatings } from "hooks/useRating";
// Countries hook is now used directly by the CountriesTypeahead component
import { MultiSelectItemType } from "types/types";
import { ResponsiveContainer } from "components/Layout/ResponsiveContainer";
import { useAllUsers } from "hooks/useUsers";

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const UnstyledLink = styled(Link)`
  all: unset;
  cursor: pointer;
`;

const ResultsStyleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: ${props => props.theme?.colors?.infoForm || '#f8f9fa'};
  border: solid 1px transparent;
  border-radius: 12px;
  flex-grow: 1;
  margin-bottom: 12px;
  width: 100%;
  max-width: 1000px;
  height: 500px;
`;

export const StyledResultsPanel = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme?.colors?.infoForm || '#f8f9fa'};
  border: solid 1px transparent;
  border-radius: 12px;
  flex-grow: 1;
  margin-bottom: 12px;
  height: 500px;
  overflow-y: scroll;
`;

const StyledCardRow = styled.div`
  display: grid;
  gap: 1rem;
  margin: 4px;
  grid-template-columns: min-content 3fr min-content;
  padding-inline-start: 8px;
  padding-inline-end: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-width: 1px;
  border-radius: 6px;
  border: solid 1px ${props => props.theme?.colors?.greyLight || '#e0e0e0'};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

const FilterPanelStyled = styled(FilterPanel)`
    max-width: 988px;
`;

const CardColumn: React.FC<CardColumnProps> = ({ header, value, countryCode }) => {
  return (
    <FlexColumn>
      <Text fontSize="small">{header}</Text>
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
        {data?.map((player: any, index: number) => <PlayerRow key={index} index={index} player={player} />)}
      </StyledResultsPanel>
    </FlexContainer>
  );
};

const PlayerRow: React.FC<PlayerRowProps> = ({ index, player }) => {
  return (
    <UnstyledLink key={index} href={`/userprofile/${player.id}`} passHref>
      <StyledCardRow>
        <CardColumn header="Rank:" value={player.rank} />
        <CardColumn header="Player:" value={player.name} countryCode={player.countryCode} />
        <CardColumn header="Rating:" value={player.rating} />
      </StyledCardRow>
    </UnstyledLink>
  );
};



const Players = () => {
  // Local state for filters
  const [currentPage, setCurrentPage] = useState(1);
  const [playersSelected, setPlayersSelected] = useState<MultiSelectItemType[]>([]);
  const [countriesSelected, setCountriesSelected] = useState<string>("");
  const [playdeckInput, setPlaydeckInput] = useState("");
  const [playdeckValue, setPlaydeckValue] = useState("");

  // Countries are now fetched directly by the CountriesTypeahead component

  // Use React Query for player ratings
  const {
    data: playersData,
    isLoading: isLoadingPlayers,
    error: playersError,
  } = usePlayerRatings({
    page: currentPage,
    pageSize: 20,
    playerFilter: playersSelected.length > 0 ? playersSelected.map(p => p.code) : undefined,
    countrySelected: countriesSelected || undefined,
    playdeck: playdeckInput || undefined,
    orderBy: 'rating',
    orderDirection: 'desc',
  });
  const { data: usersData, isLoading: isLoadingUsers } = useAllUsers(1, 2000);
 
  const userItems: DropdownItemType[] = usersData?.results?.map((user: any) => ({
    code: user.id,
    name: user?.name.trim(),
  })) || [];

  const onPageChange = async (page: number) => {
    setCurrentPage(page);
  };

  // Loading states are now handled by individual components

  const paginationVisibility = !(
    playersSelected?.length !== 0 ||
    countriesSelected?.length !== 0 ||
    playdeckInput
  );

  return (
      <Container>
        <h1>Players list</h1>
        <FilterPanelStyled>
          <MultiSelect
            setSelectedValues={(value: any) => {
              setPlayersSelected(value);
              setCurrentPage(1); // Reset to first page when filtering
            }}
            items={userItems}
            selectedValues={playersSelected as any}
            placeholder="Select Players..."
          />
          <div style={{ width: "300px", height: "40px" }}>
            <CountriesTypeahead
              placeholder="Type the federation name..."
              css={{ width: "100%", height: "100%" }}
              onSelect={(value) => {
                if (value) {
                  setCountriesSelected(value.value || "");
                  setCurrentPage(1); // Reset to first page when filtering
                }
              }}
              onBlur={() => {
                setCountriesSelected("");
              }}
              selectedItem={countriesSelected || ""}
              labelText=""
              error={false}
              listWidth="320px"
            />
          </div>
          <Input
            type="text"
            value={playdeckValue}
            placeholder="Type the Playdek name"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPlaydeckValue(event.target.value)
            }
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === "Enter") {
                setPlaydeckInput(playdeckValue);
                setCurrentPage(1); // Reset to first page when filtering
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
            totalPages={playersData?.totalPages || 1}
            onPageChange={onPageChange}
          />
        )}
      </Container>
  );
};

export default Players;
