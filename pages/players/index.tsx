import { useState, useMemo, useEffect } from "react";

import { styled } from "stitches.config";
import { Flex } from "components/Atoms";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import Link from "next/link";
import useFetchInitialData from "hooks/useFetchInitialData";
import { Spinner } from "@radix-ui/themes";
import { Pagination } from "components/Pagination";
import getAxiosInstance from "utils/axios";
import { FilterPanel } from "components/Homepage/Homepage.styles";
import MultiSelect from "components/MultiSelect";
import { getInfoFromCookies } from "utils/cookies";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "redux/store";
import { fetchPlayersList, setCurrentPage, setPlayersFilter } from "../../redux/playersListSlice";

export const UnstyledLink = styled(Link, {
  all: "unset" /* Unset all styles */,
  cursor: "pointer" /* Set cursor to pointer */,
});

const borderStyle = "solid 1px $greyLight";
const ResultsStyleWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  backgroundColor: "$infoForm",
  border: "solid 1px none",
  borderRadius: "12px",
  flexGrow: "1",
  marginBottom: "12px",
  width: "100%",
  maxWidth: "1000px",
  height: "500px",
});

export const StyledResultsPanel = styled("div", {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "$infoForm",
  border: "solid 1px none",
  borderRadius: "12px",
  flexGrow: "1",
  marginBottom: "12px",
  height: "500px",
  overflowY: "scroll",
});

const StyledCardRow = styled("div", {
  display: "grid",
  gap: "1rem",
  margin: "4px",
  gridTemplateColumns: "min-content 3fr 2fr min-content",
  paddingInlineStart: "8px",
  paddingInlineEnd: "8px",
  paddingTop: "4px",
  paddingBottom: "4px",
  borderWidth: "1px",
  borderRadius: "6px",
  border: "solid 1px $greyLight",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
});

const CardColumn = ({ header, value, countryCode }) => {
  return (
    <>
      <Flex css={{ flexDirection: "column" }}>
        <Text fontSize="small">{header}</Text>
        <Flex css={{ alignItems: "center" }}>
          {countryCode && <FlagIcon code={countryCode} />}
          <Text fontSize="medium">{value}</Text>
        </Flex>
      </Flex>
    </>
  );
};

const ResultsPanel = ({ data, onPageChange, isLoading }) => {
  return (
    <Flex css={{ flexDirection: "column", width: "100%", height: "100%" }}>
      <StyledResultsPanel>
        {data?.map((player, index) => <PlayerRow key={index} index={index} player={player} />)}
      </StyledResultsPanel>
    </Flex>
  );
};

const formatDateString = (dateStr) => {
  if (dateStr) {
    const utcDate = new Date(dateStr);
    return utcDate.toLocaleString("fr-FR");
  }
};

const PlayerRow = ({ index, player }) => {
  return (
    <UnstyledLink key={index} href={`/userprofile/${player.id}`} passHref>
      <StyledCardRow>
        <CardColumn header="Rank:" value={player.rank} />
        <CardColumn header="Player:" value={player.name} countryCode={player.countryCode} />
        <CardColumn
          header="Last activity date:"
          value={formatDateString(player.lastActivity) || "-"}
        />
        <CardColumn header="Rating:" value={player.rating} />
      </StyledCardRow>
    </UnstyledLink>
  );
};

const getNameFromUsers = (data) => data?.map((item) => ({ code: item.id, name: item.name }));

const Players = () => {
  // const [paginatedData, setPaginatedData] = useState(null);
  // const [isLoadingPagination, setIsLoadingPagination] = useState(false);
  const { data: users, error } = useFetchInitialData({ url: "/api/user", cacheId: "user-list" });
  // const { data, isLoading } = useFetchInitialData({ url: "/api/rating?p=1" });
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, filters, currentPage, totalPages } = useSelector(
    (state: RootState) => state.playersList,
  );
  const { playersSelected } = filters;
  const usersMemo = useMemo(() => getNameFromUsers(users), [users]);

  useEffect(() => {
    dispatch(fetchPlayersList());
  }, [filters, currentPage, dispatch]);

  const onPageChange = async (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleFilterChange = async (selectedPlayers) => {
    items;
  };

  return (
    <>
      <h1>Players list</h1>
      <FilterPanel>
        <MultiSelect
          setSelectedValues={(value) => dispatch(setPlayersFilter(value))}
          items={usersMemo}
          selectedValues={playersSelected}
          placeholder="Select Players..."
        />
      </FilterPanel>
      <ResultsStyleWrapper>
        <ResultsPanel
          data={items.results}
          onPageChange={onPageChange}
          isLoading={status === "loading"}
        />
      </ResultsStyleWrapper>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
};

export async function getServerSideProps({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const payload = getInfoFromCookies(req, res);
  return { props: { role: payload?.role || null } };
}

export default Players;
