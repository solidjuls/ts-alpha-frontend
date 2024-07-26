import { Box, Span, Flex } from "components/Atoms";
import { trpc } from "contexts/APIProvider";
import { FlagIcon } from "components/FlagIcon";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { styled } from "stitches.config";
import { Backbutton } from "components/Backbutton";
import { DetailContainer } from "components/DetailContainer";

const spanCssGameData = {
  marginRight: "8px",
};

const spanCssRating = {
  fontSize: "12px",
};

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

export default function Game({ game }) {
  const router = useRouter();

  // If the page is not yet generated, this will be displayed initially until the page is generated
  // if (router.isFallback) {
  //   return <div>Loading...</div>;
  // }
  // console.log("game", game);
  console.log("game", game);
  const { data, isLoading } = trpc.useQuery(
    [
      "game-get",
      // @ts-ignore
      { id: game?.id },
    ],
    { enabled: !!game?.id },
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
            <Span>{data.created_at}</Span>
          </Flex>
        </Box>
      </Flex>
    </DetailContainer>
  );
}

const PlayerName = ({ playerName, userId, rating, ratingDifference }) => {
  return (
    <Flex css={{ flexDirection: "column" }}>
      <Flex css={{ margin: "0 8px 0 8px" }}>
        <Link href={`/userprofile/${userId}`}>{playerName}</Link>
        <FlagIcon code="US" />
      </Flex>

      <Flex css={{ margin: "0 8px 0 8px" }}>
        <Span css={spanCssRating}>{Number(rating) + Number(ratingDifference)}</Span>
        <Box css={{ position: "relative", width: "20px" }}>
          <StyledChevronDownIcon color="red" />
        </Box>
        <Span css={spanCssRating}>{rating}</Span>
        <Box css={{ position: "relative", width: "20px" }}>
          <StyledChevronDownIcon color="green" />
        </Box>
      </Flex>
    </Flex>
  );
};

export async function getServerSideProps({ params }) {
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
  return { props: { game: params } };
}
