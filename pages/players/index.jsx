import { useState } from "react";

import { styled } from "stitches.config";
import { Flex } from "components/Atoms";
import Text from "components/Text";
import { FlagIcon } from "components/FlagIcon";
import Link from "next/link";
import useFetchInitialData from "hooks/useFetchInitialData";
import { Spinner } from "@radix-ui/themes";
import { Pagination } from "components/Pagination";
import getAxiosInstance from "utils/axios";

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
  padding: "8px",
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
        {data?.map((player, index) => (
          <PlayerRow key={index} index={index} player={player} />
        ))}
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

const Players = () => {
  const [paginatedData, setPaginatedData] = useState(null);
  const [isLoadingPagination, setIsLoadingPagination] = useState(false);
  const { data, isLoading } = useFetchInitialData({ url: "/api/rating?p=1" });

  if (isLoading) return <Spinner size="3" />;

  const onPageChange = async (page) => {
    setIsLoadingPagination(true);
    const paginatedData = await getAxiosInstance().get(`/api/rating?p=${page}`, {
      id: `player-list-${page}`,
    });

    setIsLoadingPagination(false);
    setPaginatedData(paginatedData.data);
  };

  const calculateTotalPages = (data) => {
    const totalPlayers = data[0].totalPlayers;
    const resultsPerPage = 20;
    return Math.ceil(totalPlayers / resultsPerPage);
  };

  return (
    <>
      <h1>Players list</h1>
      <ResultsStyleWrapper>
        <ResultsPanel
          data={paginatedData || data}
          onPageChange={onPageChange}
          isLoading={isLoadingPagination}
        />
      </ResultsStyleWrapper>
      <Pagination
        totalPages={calculateTotalPages(paginatedData || data)}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default Players;
