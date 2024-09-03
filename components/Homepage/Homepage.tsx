"use client";
import { useEffect, useState } from "react";
import { FlagIcon } from "components/FlagIcon";
import { Box, Flex } from "components/Atoms";
import Text from "components/Text";
import { DayMonthInput } from "components/Input";
import { TopPlayerRating } from "components/TopPlayerRating";
import { dateAddDay } from "utils/dates";
import { SkeletonHomepage } from "components/Skeletons";
import { Game } from "types/game.types";
import { getWinnerText } from "utils/games";
import { GAME_QUERY, leagueTypes } from "utils/constants";
import { dateFormat } from "utils/dates";
import { PlayerInfo, StyledResultsPanel, FilterPanel, UnstyledLink } from "./Homepage.styles";
import MultiSelect from "components/MultiSelect";
import useFetchInitialData from "hooks/useFetchInitialData";
import { Spinner } from "@radix-ui/themes";
import { Pagination } from "components/Pagination";
import getAxiosInstance from "utils/axios";
import { DropdownWithLabel } from "components/EditFormComponents";
import { styled } from "stitches.config";

type HomepageProps = {
  role: number;
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

const getGameType = (game: Game, role: number) => {
  if (role === 2) return `${game.gameType} (${game.id})`;

  return game.gameType;
};

const ResultRow = ({ game, role }: { game: Game; role: number }) => {
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
          {/* {getGameType(game, role)} */}
          {`Game #${game.id}`}
        </Text>
        <Text fontSize="small" css={{ alignSelf: "center", marginLeft: 4, ...responsive }}>
          {/* {getGameType(game, role)} */}
          {getGameType(game, role)}
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

const FilterUser = () => {
  return <MultiSelect />;
};

const ResultsPanel = ({ data, dateValue, onClickDay, role, onPageChange, isLoading }) => {
  return (
    <Flex css={{ flexDirection: "column", width: "100%" }}>
      <StyledResultsPanel>
        {/* <FilterPanel>
          <DayMonthInput value={formatDateToString(dateValue)} onClick={onClickDay} />
          <FilterUser />
        </FilterPanel> */}
        {data?.map((game, index) => (
          <UnstyledLink key={index} href={`/games/${game.id}`} passHref>
            <ResultRow key={index} role={role} game={game} />
          </UnstyledLink>
        ))}
      </StyledResultsPanel>
      <Pagination totalPages={100} onPageChange={onPageChange} />
    </Flex>
  );
};

const ResponsiveContainer = styled('div', {
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

  // '@sm': {
  //   display: "flex",
  //   flexDirection: "column",
  // }
})
const Homepage: React.FC<HomepageProps> = ({ role }) => {
  const [dateValue, setDateValue] = useState<Date>(new Date());
  const [paginatedData, setPaginatedData] = useState(null);
  const [isLoadingPagination, setIsLoadingPagination] = useState(false);
  const { data, isLoading } = useFetchInitialData({ url: `/api/game`, cacheId: "game-list" });

  const onPageChange = async (page: string) => {
    setIsLoadingPagination(true);
    const paginatedData = await getAxiosInstance().get(`/api/game?p=${page}`, {
      id: `games-list-${page}`,
    });
    setIsLoadingPagination(false);
    setPaginatedData(paginatedData.data);
  };

  const onClickDay = (clickedItem: "left" | "right") => {
    let newDate = new Date();
    if (clickedItem === "left") {
      newDate = dateAddDay(dateValue, -1);
    } else if (clickedItem === "right") {
      newDate = dateAddDay(dateValue, 1);
    }

    setDateValue(newDate);
  };

  const games = !paginatedData ? data : paginatedData;
  const loading = isLoading || isLoadingPagination;

  return (
    <ResponsiveContainer direction={{
      '@initial': 'row',
      '@sm': "column"
    }}>
      <ResultsPanel
        data={games}
        isLoading={loading}
        dateValue={dateValue}
        onPageChange={onPageChange}
        onClickDay={onClickDay}
        role={role}
      />
      <Box>
        <TopPlayerRating />
      </Box>
    </ResponsiveContainer>
  );
};

export default Homepage;
