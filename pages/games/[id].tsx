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
import { Button } from "components/Button";
import { UnstyledLink } from "components/Homepage/Homepage.styles";
import getAxiosInstance from "utils/axios";
import { useSession } from "contexts/AuthProvider";
import { userRoles } from "utils/constants";

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

const GameContent = ({ data }) => {
  const { role } = useSession();
  const {
    id,
    gameDate,
    gameWinner,
    game_code,
    gameType,
    endTurn,
    endMode,
    usaPlayerId,
    ussrPlayerId,
  } = data;
  const linkToRecreate = `/recreateform?id=${id}&gameDate=${gameDate}&endMode=${endMode}&usaPlayerId=${usaPlayerId}&ussrPlayerId=${ussrPlayerId}&gameWinner=${gameWinner}&game_code=${game_code}&gameType=${gameType}&endTurn=${endTurn}&video1=${data.video1}`;

  const deleteGame = async () => {
    getAxiosInstance().post(``);
    await getAxiosInstance().post(
      "/api/game/recreate",
      {
        data: { oldId: id, op: "delete" },
      },
      {
        cache: {
          update: {
            "game-list": "delete",
          },
        },
      },
    );
  };
  return (
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
      <Flex css={{ flexDirection: "column", alignItems: "center", marginBottom: "8px" }}>
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
            <Span>{endMode}</Span>
            <Span>{dateFormat(new Date(data.created_at))}</Span>
          </Flex>
        </Box>
      </Flex>
      {role === userRoles.SUPERADMIN && (
        <Flex>
          <Button css={{ width: "150px", margin: "8px" }}>
            <UnstyledLink href={linkToRecreate} target="_blank">
              Recreate game
            </UnstyledLink>
          </Button>
          <Button css={{ width: "150px", margin: "8px" }} onClick={deleteGame}>
            Delete this game
          </Button>
        </Flex>
      )}
    </>
  );
};

const Game: React.FC<GameProps> = ({ gameId }) => {
  const router = useRouter();
  // If the page is not yet generated, this will be displayed initially until the page is generated
  // if (router.isFallback) {
  //   return <div>Loading...</div>;
  // }
  const { data, isLoading } = useFetchInitialData({ url: `/api/game?id=${gameId}` });
  if (!data) return null;

  if (data.results && data.results.length === 0) {
    return null;
  }
  return (
    <DetailContainer>
      <Flex
        css={{
          width: "100%",
          maxWidth: "48rem",
          flexDirection: "column",
          backgroundColor: "white",
          padding: "24px 0 0 0",
          alignItems: "center",
          justifyContent: isLoading ? "center" : "flex-start",
          height: isLoading ? "250px" : "auto",
          border: "solid 1px lightgray",
          borderRadius: "8px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        {isLoading ? <Spinner size="3" /> : <GameContent data={data.results[0]} />}
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
