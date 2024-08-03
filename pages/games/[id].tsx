import type { GetServerSideProps } from "next";
import type { Game } from "types/game.types";
import { Box, Span, Flex } from "components/Atoms";
import { trpc } from "contexts/APIProvider";
import { FlagIcon } from "components/FlagIcon";
import Link from "next/link";
import { useRouter } from "next/router";
import { DetailContainer } from "components/DetailContainer";
import Text from "components/Text"
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import {styled} from "stitches.config"

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
  ratingDifference: number;
};

type GameProps = {
  gameId: string;
};

const Game: React.FC<GameProps> = ({ gameId }) => {
  const router = useRouter();

  // If the page is not yet generated, this will be displayed initially until the page is generated
  // if (router.isFallback) {
  //   return <div>Loading...</div>;
  // }

  console.log("game", gameId);
  const { data, isLoading } = trpc.useQuery(
    [
      "game-get",
      // @ts-ignore
      { id: gameId },
    ],
    { enabled: !!gameId },
  );

  if (!data || isLoading) return null;
  console.log("data", data);
  return (
    <DetailContainer>
      <Flex
        css={{
          width: "100%",
          maxWidth: "48rem",
          flexDirection: "column",
          backgroundColor: "white",
          padding: "24px",
          alignItems: "center",
          border: "solid 1px lightgray",
          borderRadius: "8px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Flex css={{ alignItems: "center", marginBottom: "12px" }}>
          <PlayerName
            playerName={data.usaPlayer}
            userId={data.usaPlayerId}
            rating={data.ratingsUSA.rating}
            ratingDifference={data.ratingsUSA.ratingDifference}
          />
          vs
          <PlayerName
            playerName={data.ussrPlayer}
            userId={data.ussrPlayerId}
            rating={data.ratingsUSSR.rating}
            ratingDifference={data.ratingsUSSR.ratingDifference}
          />
        </Flex>

        <Box css={{ display: "grid", gap: "1rem", gridTemplateColumns: "5fr 0.1fr 5fr" }}>
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
            <Span>{data.gameWinner}</Span>
            <Span>{data.endTurn}</Span>
            <Span>{data.endMode}</Span>
            <Span>{data.created_at?.toString()}</Span>
          </Flex>
        </Box>
      </Flex>
    </DetailContainer>
  );
};

const PlayerName: React.FC<PlayerNameProps> = ({
  playerName,
  userId,
  rating,
  ratingDifference,
}) => {
  return (
    <Flex css={{ flexDirection: "column" }}>
      <Flex css={{ margin: "0 8px 0 8px" }}>
        <Link href={`/userprofile/${userId}`}>{playerName}</Link>
        <FlagIcon code="US" />
      </Flex>

      <Flex css={{ margin: "0 8px 0 8px" }}>
        <Text fontSize="small">{Number(rating) + Number(ratingDifference)}</Text>
        <Box css={{ position: "relative", width: "20px" }}>
          <StyledChevronDownIcon color="red" />
        </Box>
        <Text fontSize="small">{rating}</Text>
        <Box css={{ position: "relative", width: "20px" }}>
          <StyledChevronDownIcon color="green" />
        </Box>
      </Flex>
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
