import { useEffect, useState } from "react";
import useFetchInitialData from "hooks/useFetchInitialData";
import { Pagination } from "components/Pagination";
import { getInfoFromCookies } from "utils/cookies";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "redux/store";
import { fetchPlayersList, setCurrentPage } from "../../redux/playersListSlice";
import { ServerType } from "types/types";
import { UserType } from "types/user.types";
import React from "react";

// Import components
import { ResultsStyleWrapper, PaginationContainer } from "components/Players/Players.styles";
import ResultsPanel from "components/Players/ResultsPanel";
import FilterPanel from "components/Players/FilterPanel";
import { usePlayersFilters } from "components/Players/usePlayersFilters";
import { PlayersListState, Country } from "components/Players/Players.types";

const Players = () => {
  const [playdeckValue, setPlaydeckValue] = useState("");
  const {
    data: users,
    isLoading: isLoadingUsers,
    error,
  } = useFetchInitialData<UserType[]>({ url: "/api/user", cacheId: "user-list" });
  const { data: countries, isLoading: isLoadingCountries } = useFetchInitialData<Country[]>({
    url: `/api/countries`,
  });
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, filters, currentPage, totalPages } = useSelector(
    (state: RootState) => state.playersList as PlayersListState,
  );

  // Use the custom hook for filter logic
  const {
    playerInputValue,
    setPlayerInputValue,
    countryInputValue,
    setCountryInputValue,
    playdekInputValue,
    setPlaydekInputValue,
    playerOptions,
    countryOptions,
    playdekOptions,
    playersSelected,
    countriesSelected,
    playdekSelected,
    handlePlayerChange,
    handleCountryChange,
    handlePlaydekChange,
    hasAnySelections,
  } = usePlayersFilters(users || undefined, countries || undefined);

  useEffect(() => {
    dispatch(fetchPlayersList());
  }, [filters, currentPage, dispatch]);

  const onPageChange = async (page: number) => {
    dispatch(setCurrentPage(page));
  };

  if (isLoadingUsers || isLoadingCountries) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <h1>Players list</h1>
      <FilterPanel
        playerInputValue={playerInputValue}
        setPlayerInputValue={setPlayerInputValue}
        countryInputValue={countryInputValue}
        setCountryInputValue={setCountryInputValue}
        playdekInputValue={playdekInputValue}
        setPlaydekInputValue={setPlaydekInputValue}
        playerOptions={playerOptions}
        countryOptions={countryOptions}
        playdekOptions={playdekOptions}
        playersSelected={playersSelected}
        countriesSelected={countriesSelected}
        playdekSelected={playdekSelected}
        handlePlayerChange={handlePlayerChange}
        handleCountryChange={handleCountryChange}
        handlePlaydekChange={handlePlaydekChange}
      />

      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        <ResultsStyleWrapper>
          <ResultsPanel data={Array.isArray(items) ? items : []} isLoading={status === "loading"} />
          <PaginationContainer>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </PaginationContainer>
        </ResultsStyleWrapper>
      </div>
    </div>
  );
};

export async function getServerSideProps({ req, res }: ServerType) {
  const payload = getInfoFromCookies(req, res);
  return { props: { role: payload?.role || null } };
}

export default Players;
