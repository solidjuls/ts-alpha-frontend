import type { GetServerSideProps } from "next";
import type { Game } from "types/game.types";
import { Box, Span, Flex } from "components/Atoms";
import { FlagIcon } from "components/FlagIcon";
import Link from "next/link";
import { useRouter } from "next/router";
import { DetailContainer } from "components/DetailContainer";
import Text from "components/Text";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { styled } from "stitches.config";
import { Spinner } from "@radix-ui/themes";
import { getWinnerText, getTurnText } from "utils/games";
import useFetchInitialData from "hooks/useFetchInitialData";
import { dateFormat } from "utils/dates";

const StyledLink = styled(Link, {
  textDecoration: "none",
  color: "Black",
  variants: {
    borderBottom: {
      usa: {
        borderBottom: "2px solid blue",
      },
      ussr: {
        borderBottom: "2px solid red",
      },
    },
  },
});

const StyledChevronDownIcon = styled(ChevronDownIcon, {
  position: "absolute",
  variants: {
    color: {
      red: { color: "red" },
      green: { color: "green" },
    },
  },
});

const StyledChevronUpIcon = styled(ChevronUpIcon, {
  position: "absolute",
  variants: {
    color: {
      red: { color: "red" },
      green: { color: "green" },
    },
  },
});
type PlayerNameProps = {
  playerName: string;
  userId: bigint;
  rating: number;
  previousRating: number;
  countryCode: string;
  isUSSR?: boolean;
};

type GameProps = {
  gameId: string;
};

const GameContent = ({ data }) => (
  <>
    <Flex css={{ alignItems: "center", marginLeft: "16px", marginBottom: "12px" }}>
      <PlayerName
        playerName={data.usaPlayer}
        userId={data.usaPlayerId}
        rating={data.ratingsUSA.rating}
        previousRating={data.ratingsUSA.previousRating}
        countryCode={data.usaCountryCode}
      />
      vs
      <PlayerName
        playerName={data.ussrPlayer}
        userId={data.ussrPlayerId}
        rating={data.ratingsUSSR.rating}
        previousRating={data.ratingsUSSR.previousRating}
        countryCode={data.ussrCountryCode}
        isUSSR
      />
    </Flex>

    <Box css={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "5fr 0.1fr 5fr" }}>
      <Flex css={{ flexDirection: "column", alignItems: "end" }}>
        <Span>Tournament:</Span>
        <Span>Identifier:</Span>
        <Span>Won by:</Span>
        <Span>End turn:</Span>
        <Span>Via:</Span>
        <Span>Date:</Span>
      </Flex>
      <Box css={{ width: "5px" }} />
      <Flex css={{ flexDirection: "column", alignItems: "start" }}>
        <Span>{data.gameType}</Span>
        <Span>{data.game_code}</Span>
        <Span>{getWinnerText(data.gameWinner)}</Span>
        <Span>{getTurnText(data.endTurn)}</Span>
        <Span>{data.endMode}</Span>
        <Span>{dateFormat(new Date(data.created_at))}</Span>
      </Flex>
    </Box>
  </>
);

const Game: React.FC<GameProps> = ({ gameId }) => {
  const router = useRouter();
  // If the page is not yet generated, this will be displayed initially until the page is generated
  // if (router.isFallback) {
  //   return <div>Loading...</div>;
  // }
  const { data, isLoading } = useFetchInitialData({ url: `/api/game?id=${gameId}` });
  if (!data) return null;
  console.log("data", data);
  return (
    <DetailContainer>
      <Flex
        css={{
          width: "100%",
          maxWidth: "48rem",
          height: "250px",
          flexDirection: "column",
          backgroundColor: "white",
          padding: "24px 0 0 0",
          alignItems: "center",
          justifyContent: isLoading ? "center" : "flex-start",
          border: "solid 1px lightgray",
          borderRadius: "8px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        {isLoading ? <Spinner size="3" /> : <GameContent data={data[0]} />}
      </Flex>
    </DetailContainer>
  );
};

const ChevronContainer = ({ rating, previousRating }) =>
  rating > previousRating ? (
    <StyledChevronUpIcon color="green" />
  ) : (
    <StyledChevronDownIcon color="red" />
  );
const Rating = ({ rating, previousRating, isUSSR }) => {
  return !isUSSR ? (
    <Flex css={{ justifyContent: "flex-end", margin: "0 8px 0 8px" }}>
      <Text fontSize="small">{previousRating}</Text>
      <Box css={{ position: "relative", marginLeft: "4px", width: "15px" }}>
        <ChevronContainer rating={Number(rating)} previousRating={previousRating} />
      </Box>
      <Text fontSize="small">{rating}</Text>
    </Flex>
  ) : (
    <Flex css={{ margin: "0 8px 0 8px" }}>
      <Text fontSize="small">{rating}</Text>
      <Box css={{ position: "relative", marginRight: "4px", width: "15px" }}>
        <ChevronContainer rating={Number(rating)} previousRating={previousRating} />
      </Box>
      <Text fontSize="small">{previousRating}</Text>
    </Flex>
  );
};
const PlayerName: React.FC<PlayerNameProps> = ({
  playerName,
  userId,
  rating,
  previousRating,
  countryCode,
  isUSSR,
}) => {
  return (
    <Flex css={{ flexDirection: "column" }}>
      <Flex css={{ margin: "0 8px 0 8px", display: "flex", alignItems: "flex-end" }}>
        {!isUSSR ? (
          <>
            <StyledLink borderBottom="usa" href={`/userprofile/${userId}`}>
              {playerName}
            </StyledLink>
            <Flex css={{ flexDirection: "column" }}>
              <FlagIcon code={countryCode} />
            </Flex>
          </>
        ) : (
          <>
            <Flex css={{ flexDirection: "column" }}>
              <FlagIcon code={countryCode} />
            </Flex>
            <StyledLink borderBottom="ussr" href={`/userprofile/${userId}`}>
              {playerName}
            </StyledLink>
          </>
        )}
      </Flex>
      <Rating rating={rating} previousRating={previousRating} isUSSR={isUSSR} />
    </Flex>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // Fetch data for a single post
  // const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`);
  // const post = await res.json();

  console.log("params1", params);
  // // Return 404 if post is not found
  // if (!post.id) {
  //   return {
  //     notFound: true,
  //   };
  // }

  // Pass post data to the page via props
  return { props: { gameId: params?.id } };
};

export default Game;
